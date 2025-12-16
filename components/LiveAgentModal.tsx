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

const ELEVENLABS_AGENT_ID = 'agent_4501kckg7737f2dtvd8589hzj5b7';
const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY || '';

// Correct WebSocket URL format for ElevenLabs Conversational AI with API key
const getElevenLabsURL = () => {
  const baseUrl = `wss://api.elevenlabs.io/v1/convai/conversation?agent_id=${ELEVENLABS_AGENT_ID}`;
  if (ELEVENLABS_API_KEY) {
    return `${baseUrl}&api_key=${ELEVENLABS_API_KEY}`;
  }
  return baseUrl;
};
const ELEVENLABS_WS_URL = getElevenLabsURL();

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
  const workletNodeRef = useRef<AudioWorkletNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const audioSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const isMutedRef = useRef(isMuted);

  // Establish WebSocket connection and initialize audio
  const startSession = async () => {
    console.log('🚀 Starting ARIA voice session with Agent:', ELEVENLABS_AGENT_ID);
    setError(null);
    setIsConnecting(true);

    try {
      // Setup audio contexts for input and output
      console.log('🔧 Creating audio contexts...');
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      outputNodeRef.current = outputContextRef.current.createGain();
      outputNodeRef.current.connect(outputContextRef.current.destination);
      nextStartTimeRef.current = 0;
      audioSourcesRef.current = [];
      console.log('✓ Audio contexts ready');

      // Request microphone access
      console.log('🎤 Requesting microphone...');
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        console.log('✓ Microphone granted');
      } catch (err) {
        console.error("❌ Microphone denied:", err);
        setError("Microphone access denied. Please allow microphone permissions.");
        setIsConnecting(false);
        return;
      }

      streamRef.current = stream;

      // Setup audio input processing using AudioWorkletNode (replaces deprecated ScriptProcessorNode)
      if (!inputContextRef.current) throw new Error('Audio context not initialized');
      
      const audioSource = inputContextRef.current.createMediaStreamSource(stream);
      sourceRef.current = audioSource;
      
      // Load and register the audio worklet
      console.log('⚙️ Loading audio worklet processor...');
      try {
        await inputContextRef.current.audioWorklet.addModule('/audioWorklet.js');
        console.log('✓ Audio worklet loaded');
      } catch (err) {
        console.warn('⚠️ AudioWorklet not available, using fallback:', err);
        // Fallback to a simpler approach if AudioWorklet fails
        setError('Audio processing unavailable on this browser');
        setIsConnecting(false);
        return;
      }

      // Create AudioWorkletNode
      const workletNode = new AudioWorkletNode(inputContextRef.current, 'audio-input-processor');
      workletNodeRef.current = workletNode;

      // Handle audio data from the worklet
      workletNode.port.onmessage = (event) => {
        if (event.data.type === 'audio' && event.data.data) {
          // Skip if muted or WebSocket not ready
          if (isMutedRef.current || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
          
          try {
            const inputData = event.data.data;
            const base64Audio = pcmToBase64(inputData);
            
            // Send audio chunk to ElevenLabs
            wsRef.current.send(JSON.stringify({
              user_audio_chunk: base64Audio
            }));
          } catch (err) {
            console.error("Error sending audio:", err);
          }
        }
      };

      // Connect audio graph: microphone → worklet → destination
      audioSource.connect(workletNode);
      workletNode.connect(inputContextRef.current.destination);
      console.log('✓ Audio input ready (using AudioWorkletNode)');

      // Connect to ElevenLabs
      console.log('🔗 Connecting WebSocket to:', ELEVENLABS_WS_URL);
      const ws = new WebSocket(ELEVENLABS_WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ CONNECTED to ElevenLabs!');
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
      };

      ws.onmessage = async (event) => {
        try {
          const message: ElevenLabsMessage = JSON.parse(event.data);

          // Handle agent audio response
          if (message.type === 'audio' && message.audio) {
            console.log('🔊 Playing agent audio');
            setIsAgentSpeaking(true);
            
            if (!outputContextRef.current || outputContextRef.current.state === 'closed') return;

            try {
              const ctx = outputContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);

              const audioBuffer = await decodeAudioData(message.audio, ctx, 24000);
              const bufferSource = ctx.createBufferSource();
              bufferSource.buffer = audioBuffer;
              
              if (outputNodeRef.current) {
                bufferSource.connect(outputNodeRef.current);
              }

              audioSourcesRef.current.push(bufferSource);
              bufferSource.onended = () => {
                audioSourcesRef.current = audioSourcesRef.current.filter(s => s !== bufferSource);
                if (audioSourcesRef.current.length === 0) {
                  setIsAgentSpeaking(false);
                }
              };

              bufferSource.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
            } catch (err) {
              console.error("Error playing audio:", err);
            }
          }

          if (message.type === 'interruption') {
            console.log('⏸ User interrupted');
            audioSourcesRef.current.forEach(s => { try { s.stop(); } catch (e) {} });
            audioSourcesRef.current = [];
            setIsAgentSpeaking(false);
          }

        } catch (err) {
          console.error("Message error:", err);
        }
      };

      ws.onerror = (event) => {
        console.error('❌ WebSocket error:', event);
        setError('Connection error - Check Agent ID');
        setIsConnected(false);
        setIsConnecting(false);
      };

      ws.onclose = (event) => {
        console.log(`❌ Closed - Code: ${event.code}, Reason: "${event.reason || 'none'}"`);
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
    
    // Disconnect AudioWorkletNode
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect();
      workletNodeRef.current = null;
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

  // Update isMutedRef whenever isMuted changes and notify worklet
  useEffect(() => {
    isMutedRef.current = isMuted;
    // Notify the worklet about mute state changes
    if (workletNodeRef.current) {
      workletNodeRef.current.port.postMessage({ type: 'mute', value: isMuted });
    }
  }, [isMuted]);

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