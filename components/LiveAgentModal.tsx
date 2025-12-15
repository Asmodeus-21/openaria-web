import React, { useEffect, useRef, useState } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { Mic, X, Volume2, MicOff, Activity } from 'lucide-react';
import { createBlob, decodeAudioData } from '../services/audioUtils';
import Button from './Button';

interface LiveAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LiveAgentModal: React.FC<LiveAgentModalProps> = ({ isOpen, onClose }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for audio handling
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  // Initialize Gemini
  // NOTE: In a real production app, you would likely proxy this or use a temporary key.
  // For this demo, we assume process.env.API_KEY is available as per instructions.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const startSession = async () => {
    setError(null);
    setIsConnecting(true);

    try {
      // 1. Audio Context Setup
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const outputNode = outputContextRef.current.createGain();
      outputNode.connect(outputContextRef.current.destination);

      // 2. Connect to Live API
      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: "You are ARIA, a professional, calm, and highly intelligent AI receptionist for a high-end business. You are helpful, concise, and speak with a premium tone. Your goal is to schedule an appointment or answer questions about business hours. Keep responses short and conversational.",
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } }, 
          },
        },
        callbacks: {
          onopen: async () => {
            console.log('ARIA Connection Opened');
            setIsConnected(true);
            setIsConnecting(false);

            // Start Microphone Stream
            try {
              const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
              streamRef.current = stream;
              
              if (!inputContextRef.current) return;

              const source = inputContextRef.current.createMediaStreamSource(stream);
              sourceRef.current = source;
              
              const scriptProcessor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
              processorRef.current = scriptProcessor;

              scriptProcessor.onaudioprocess = (e) => {
                if (isMuted) return; // Don't send if muted
                
                const inputData = e.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                
                sessionPromise.then((session) => {
                  session.sendRealtimeInput({ media: pcmBlob });
                });
              };

              source.connect(scriptProcessor);
              scriptProcessor.connect(inputContextRef.current.destination);
              
            } catch (err) {
              console.error("Microphone error:", err);
              setError("Could not access microphone.");
              stopSession();
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            
            if (base64Audio && outputContextRef.current) {
              if (outputContextRef.current.state === 'closed') return;
              
              const ctx = outputContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              
              const audioBuffer = await decodeAudioData(base64Audio, ctx);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
            }

            // Handle Interruptions
            if (message.serverContent?.interrupted) {
              nextStartTimeRef.current = 0;
              // Ideally stop currently playing nodes here if we tracked them
            }
          },
          onclose: () => {
            console.log('ARIA Connection Closed');
            setIsConnected(false);
          },
          onerror: (err) => {
            console.error('ARIA Connection Error:', err);
            setError("Connection failed. Please try again.");
            setIsConnected(false);
            setIsConnecting(false);
          }
        }
      });

      sessionRef.current = sessionPromise;

    } catch (err) {
      console.error("Setup error:", err);
      setError("Failed to initialize ARIA.");
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    // Cleanup Audio
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (inputContextRef.current && inputContextRef.current.state !== 'closed') {
      inputContextRef.current.close();
    }
    inputContextRef.current = null;

    if (outputContextRef.current && outputContextRef.current.state !== 'closed') {
      outputContextRef.current.close();
    }
    outputContextRef.current = null;
    
    setIsConnected(false);
    setIsConnecting(false);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    if (isOpen) {
      startSession();
    } else {
      stopSession();
    }
    return () => {
      stopSession();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center p-8 transition-all animate-float">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-8 relative">
           {/* Abstract Visual Representation of ARIA */}
           <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-700 ${isConnected ? 'bg-blue-500 shadow-[0_0_60px_-15px_rgba(59,130,246,0.5)]' : 'bg-slate-200'}`}>
              <div className={`w-28 h-28 rounded-full bg-white flex items-center justify-center relative overflow-hidden`}>
                 {isConnected && (
                   <>
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-indigo-50 opacity-50" />
                    <Activity className="text-blue-500 w-12 h-12 animate-pulse" />
                    <div className="absolute inset-0 border-4 border-blue-100 rounded-full animate-ping opacity-20" />
                   </>
                 )}
                 {!isConnected && !isConnecting && <MicOff className="text-slate-300 w-10 h-10" />}
                 {isConnecting && <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />}
              </div>
           </div>
        </div>

        <h3 className="text-2xl font-semibold text-slate-900 mb-2">
          {isConnecting ? 'Connecting to ARIA...' : isConnected ? 'ARIA is Listening' : 'Connection Closed'}
        </h3>
        <p className="text-slate-500 text-center mb-8">
          {isConnected 
            ? "Go ahead, ask about scheduling or services. Experience the speed of Gemini 3.0." 
            : "Initializing secure voice channel..."}
        </p>
        
        {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                {error}
            </div>
        )}

        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={toggleMute} 
            disabled={!isConnected}
            className={`rounded-full w-14 h-14 p-0 flex items-center justify-center ${isMuted ? 'bg-red-50 border-red-200 text-red-500' : ''}`}
          >
            {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
          </Button>
          
          <Button 
             variant="secondary"
             className="min-w-[140px]"
             onClick={onClose}
          >
            End Call
          </Button>
        </div>
        
        <div className="mt-8 flex items-center gap-2 text-xs text-slate-400">
           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
           Powered by Gemini 3.0 Live API
        </div>

      </div>
    </div>
  );
};

export default LiveAgentModal;