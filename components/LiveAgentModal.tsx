import React, { useEffect, useRef, useState } from 'react';
import { Mic, X, MicOff, Activity } from 'lucide-react';
import { pcmToBase64, decodeAudioData, resampleAudio } from '../services/audioUtils';
import Button from './Button';

// Wavelength visualization component
const WavelengthVisualizer = ({ isActive }: { isActive: boolean }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className={`absolute rounded-full border-2 transition-all duration-300 ${
            isActive
              ? 'border-blue-400 animate-pulse'
              : 'border-slate-300'
          }`}
          style={{
            width: `${60 + i * 20}px`,
            height: `${60 + i * 20}px`,
            opacity: isActive ? 0.6 - i * 0.1 : 0.3 - i * 0.05,
            animation: isActive ? `wavelengthPulse 2s ease-out infinite ${i * 0.2}s` : 'none',
          }}
        />
      ))}
    </div>
  );
};

interface LiveAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ElevenLabsMessage {
  type: string;
  user_audio_chunk?: string;
  audio?: string;
  status?: string;
  [key: string]: any;
}

const ELEVENLABS_AGENT_ID = 'agent_7701kcj3ms7tff8tkh857ssbn604';
const ELEVENLABS_WS_URL = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${ELEVENLABS_AGENT_ID}`;

const LiveAgentModal: React.FC<LiveAgentModalProps> = ({ isOpen, onClose }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for audio handling
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const outputNodeRef = useRef<GainNode | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioSourcesRef = useRef<AudioBufferSourceNode[]>([]);

  // Establish WebSocket connection and initialize audio
  const startSession = async () => {
    setError(null);
    setIsConnecting(true);

    try {
      // 1. Audio Context Setup
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ 
        sampleRate: 16000 
      });
      outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ 
        sampleRate: 24000 
      });
      
      outputNodeRef.current = outputContextRef.current.createGain();
      outputNodeRef.current.connect(outputContextRef.current.destination);
      nextStartTimeRef.current = 0;
      audioSourcesRef.current = [];

      // 2. Request microphone access (early to show permission dialog)
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: { 
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true 
          } 
        });
      } catch (err) {
        console.error("Microphone error:", err);
        setError("Could not access microphone. Please check permissions.");
        setIsConnecting(false);
        return;
      }

      streamRef.current = stream;
      
      // 3. Setup audio processing
      if (!inputContextRef.current) {
        throw new Error('Audio context not initialized');
      }

      const audioSource = inputContextRef.current.createMediaStreamSource(stream);
      sourceRef.current = audioSource;
      
      // Create ScriptProcessor for real-time audio capture
      const scriptProcessor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
      processorRef.current = scriptProcessor;

      scriptProcessor.onaudioprocess = async (e) => {
        // Don't send audio if muted or WebSocket not ready
        if (isMuted || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
        
        try {
          const inputData = e.inputBuffer.getChannelData(0);
          const inputSampleRate = e.inputBuffer.sampleRate;
          
          // Resample from input sample rate to 16kHz
          const resampledData = await resampleAudio(inputData, inputSampleRate, 16000);
          
          // Convert to base64
          const base64Audio = pcmToBase64(resampledData);
          
          // Send to ElevenLabs WebSocket
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              user_audio_chunk: base64Audio
            }));
          }
        } catch (err) {
          console.error("Error processing audio chunk:", err);
        }
      };

      audioSource.connect(scriptProcessor);
      scriptProcessor.connect(inputContextRef.current.destination);

      // 4. Connect to ElevenLabs WebSocket
      const ws = new WebSocket(ELEVENLABS_WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to ElevenLabs Conversational AI');
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
      };

      ws.onmessage = async (event) => {
        try {
          const message: ElevenLabsMessage = JSON.parse(event.data);

          // Handle audio output from agent
          if (message.type === 'audio' && message.audio) {
            setIsAgentSpeaking(true);
            
            if (!outputContextRef.current) return;
            if (outputContextRef.current.state === 'closed') return;

            try {
              const ctx = outputContextRef.current;
              // Schedule playback at the appropriate time for gapless audio
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);

              const audioBuffer = await decodeAudioData(message.audio, ctx, 24000);
              const bufferSource = ctx.createBufferSource();
              bufferSource.buffer = audioBuffer;
              
              if (outputNodeRef.current) {
                bufferSource.connect(outputNodeRef.current);
              }

              // Track source for potential interruption
              audioSourcesRef.current.push(bufferSource);

              bufferSource.onended = () => {
                audioSourcesRef.current = audioSourcesRef.current.filter(s => s !== bufferSource);
                if (audioSourcesRef.current.length === 0) {
                  setIsAgentSpeaking(false);
                }
              };

              bufferSource.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
            } catch (decodeErr) {
              console.error("Error decoding/playing audio:", decodeErr);
            }
          }

          // Handle conversation initiation
          if (message.type === 'conversation_initiation_metadata') {
            console.log('Conversation initiated with agent:', message);
          }

          // Handle user interruption (user speaks over agent)
          if (message.type === 'interruption') {
            console.log('User interrupted agent');
            nextStartTimeRef.current = 0;
            // Stop all currently playing audio
            audioSourcesRef.current.forEach(source => {
              try {
                source.stop();
              } catch (e) {
                // Source already stopped, ignore
              }
            });
            audioSourcesRef.current = [];
            setIsAgentSpeaking(false);
          }

          // Handle agent speaking status
          if (message.type === 'agent_response') {
            if (message.status === 'speaking') {
              setIsAgentSpeaking(true);
            } else if (message.status === 'listening') {
              setIsAgentSpeaking(false);
            }
          }

        } catch (err) {
          console.error("Error processing WebSocket message:", err);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        console.error('WebSocket ready state:', ws.readyState);
        console.error('WebSocket URL:', ELEVENLABS_WS_URL);
        setError('Connection error. Please try again.');
        setIsConnected(false);
        setIsConnecting(false);
      };

      ws.onclose = (event) => {
        console.log('WebSocket closed');
        console.log('Close code:', event.code);
        console.log('Close reason:', event.reason);
        console.log('Was clean:', event.wasClean);
        setIsConnected(false);
        setIsConnecting(false);
        setIsAgentSpeaking(false);
      };

    } catch (err) {
      console.error("Setup error:", err);
      setError("Failed to initialize connection.");
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    // Stop all playing audio sources
    audioSourcesRef.current.forEach(source => {
      try {
        source.stop();
      } catch (e) {
        // Already stopped
      }
    });
    audioSourcesRef.current = [];

    // Close WebSocket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    // Cleanup microphone stream
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

    // Close audio contexts
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
    setIsAgentSpeaking(false);
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
      
      <div className="relative w-full max-w-md bg-gradient-to-b from-white via-blue-50 to-white rounded-3xl shadow-2xl overflow-hidden flex flex-col items-center p-8 transition-all border border-blue-100/50 backdrop-blur-sm" style={{ animation: 'float 3s ease-in-out infinite' }}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="mb-8 relative">
          {/* Premium Animated Orb with Wavelength Visualization */}
          <style>{`
            @keyframes wavelengthPulse {
              0% { transform: scale(1); opacity: 0.6; }
              100% { transform: scale(1.5); opacity: 0; }
            }
            @keyframes glow {
              0%, 100% { box-shadow: 0 0 40px -10px rgba(59, 130, 246, 0.6), inset 0 0 30px -10px rgba(99, 102, 241, 0.2); }
              50% { box-shadow: 0 0 60px -5px rgba(99, 102, 241, 0.8), inset 0 0 40px -5px rgba(99, 102, 241, 0.3); }
            }
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-8px); }
            }
          `}</style>
          
          <div className={`w-40 h-40 rounded-full flex items-center justify-center transition-all duration-700 relative ${
            isConnected 
              ? isAgentSpeaking 
                ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-[0_0_80px_-10px_rgba(99,102,241,0.8)]' 
                : 'bg-gradient-to-br from-blue-500 to-indigo-500 shadow-[0_0_60px_-15px_rgba(59,130,246,0.6)]'
              : 'bg-slate-200 shadow-lg'
          }`} style={{ animation: isConnected ? 'float 3s ease-in-out infinite' : 'none' }}>
            
            {isConnected && isAgentSpeaking && <WavelengthVisualizer isActive={true} />}
            
            <div className={`w-36 h-36 rounded-full bg-white flex items-center justify-center relative overflow-hidden backdrop-blur-sm transition-all duration-500`}
              style={{ 
                boxShadow: isConnected ? 'inset 0 0 30px rgba(99, 102, 241, 0.1)' : 'none'
              }}>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 via-white to-indigo-50 opacity-70" />
              
              {isConnected && (
                <>
                  <Activity className={`text-indigo-600 w-16 h-16 relative z-10 transition-transform duration-300 ${isAgentSpeaking ? 'scale-110 animate-pulse' : 'scale-100'}`} />
                  {isAgentSpeaking && (
                    <>
                      <div className="absolute inset-2 border-4 border-indigo-300 rounded-full animate-pulse opacity-40" />
                      <div className="absolute inset-6 border-2 border-blue-200 rounded-full animate-pulse opacity-20 animation-delay-200" />
                    </>
                  )}
                </>
              )}
              {!isConnected && !isConnecting && <MicOff className="text-slate-300 w-12 h-12 relative z-10" />}
              {isConnecting && <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin relative z-10" />}
            </div>
          </div>
        </div>

        <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
          {isConnecting ? 'Connecting to ARIA...' : isConnected ? 'ARIA' : 'Connection Closed'}
        </h3>
        <p className="text-slate-600 text-center mb-8 font-medium">
          {isConnected 
            ? isAgentSpeaking
              ? "🎤 ARIA is speaking..."
              : "Go ahead and speak. ARIA is listening."
            : "Initializing secure voice channel..."}
        </p>
        
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <Button 
            variant="outline" 
            onClick={toggleMute} 
            disabled={!isConnected}
            className={`rounded-full w-14 h-14 p-0 flex items-center justify-center transition-all ${isMuted ? 'bg-red-50 border-red-200 text-red-500' : 'text-slate-600'}`}
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
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Powered by ARIA
        </div>

      </div>
    </div>
  );
};

export default LiveAgentModal;