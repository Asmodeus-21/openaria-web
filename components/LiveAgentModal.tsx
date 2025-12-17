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
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioQueueRef = useRef<Array<{ buffer: AudioBuffer; duration: number }>>([]);
  const isPlayingRef = useRef(false);
  const inputAudioQueueRef = useRef<Float32Array[]>([]);
  const isMutedRef = useRef(isMuted);

  // Process audio queue sequentially to prevent overlapping/multiple voices
  const processAudioQueue = (ctx: AudioContext) => {
    // Guard: if already processing, don't start another instance
    if (isPlayingRef.current) {
      console.log('⚠️ Already playing, not starting another playback');
      return;
    }

    if (audioQueueRef.current.length === 0) {
      isPlayingRef.current = false;
      console.log('✅ Audio queue empty, playback finished');
      return;
    }

    // Prevent concurrent execution
    isPlayingRef.current = true;
    const { buffer } = audioQueueRef.current.shift()!;
    
    console.log('📊 Queue status - remaining items:', audioQueueRef.current.length, 'currently playing:', isPlayingRef.current);
    
    if (!buffer) {
      console.error('❌ Buffer is null, skipping playback');
      isPlayingRef.current = false;
      return;
    }
    
    const bufferSource = ctx.createBufferSource();
    bufferSource.buffer = buffer;
    
    if (!outputNodeRef.current) {
      console.error('❌ Output node is null, cannot connect');
      isPlayingRef.current = false;
      return;
    }
    
    bufferSource.connect(outputNodeRef.current);
    audioSourcesRef.current.push(bufferSource);

    // When this source ends, play the next one in queue
    bufferSource.onended = () => {
      console.log('✓ Audio chunk finished, checking queue for more');
      audioSourcesRef.current = audioSourcesRef.current.filter(s => s !== bufferSource);
      isPlayingRef.current = false; // Mark as not playing before processing queue
      
      if (audioQueueRef.current.length === 0) {
        if (audioSourcesRef.current.length === 0) {
          setIsAgentSpeaking(false);
          console.log('✅ All audio finished, agent stopped speaking');
        }
      } else {
        // Play next item in queue
        console.log('▶️ Processing next audio from queue');
        processAudioQueue(ctx);
      }
    };

    console.log('▶️ Starting audio playback now (buffer duration:', buffer.duration.toFixed(2) + 's)');
    bufferSource.start(ctx.currentTime);
  };

  // Establish WebSocket connection and initialize audio
  const startSession = async () => {
    console.log('🚀 Starting ARIA voice session with Agent:', ELEVENLABS_AGENT_ID);
    setError(null);
    setIsConnecting(true);

    try {
      // Setup audio contexts for input and output
      console.log('🔧 Creating audio contexts...');
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      outputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // CRITICAL: Resume audio contexts - they start in 'suspended' state on most browsers
      // Audio won't work until context is in 'running' state
      if (inputContextRef.current.state === 'suspended') {
        console.log('⏸ Input context suspended, resuming...');
        await inputContextRef.current.resume();
        console.log('✓ Input context resumed, state:', inputContextRef.current.state);
      }
      
      if (outputContextRef.current.state === 'suspended') {
        console.log('⏸ Output context suspended, resuming...');
        await outputContextRef.current.resume();
        console.log('✓ Output context resumed, state:', outputContextRef.current.state);
      }
      
      // CRITICAL FIX: Create a MediaStreamAudioDestinationNode for proper audio routing on iOS/Safari
      // This ensures audio is routed to system speakers instead of just the context destination
      const audioDestination = outputContextRef.current.createMediaStreamDestination();
      outputNodeRef.current = outputContextRef.current.createGain();
      outputNodeRef.current.gain.value = 1; // Ensure full volume
      
      // Connect ONLY to MediaStreamDestination + audio element
      // (Do NOT also connect to context.destination as this causes duplicate playback)
      outputNodeRef.current.connect(audioDestination);
      
      // Create an audio element to play the media stream
      // This is critical for iOS/Safari where Web Audio API alone won't produce speaker output
      const audioElement = new Audio();
      audioElement.srcObject = audioDestination.stream;
      audioElement.playsInline = true; // iOS requires this
      audioElement.setAttribute('playsinline', 'true'); // iOS fallback attribute
      audioElement.autoplay = true; // Start playing when stream has data
      audioElement.muted = false; // IMPORTANT: audio must NOT be muted
      audioElement.volume = 1; // Maximum volume
      audioElement.crossOrigin = 'anonymous'; // For CORS compatibility
      
      // Store reference for cleanup
      audioElementRef.current = audioElement;
      
      // Attempt to play. May fail due to browser autoplay restrictions, but that's OK
      // The audio will resume playing as soon as there's user interaction or the stream has significant audio
      audioElement.play()
        .then(() => console.log('✓ Audio element playing'))
        .catch(err => console.warn('⚠️ Audio element autoplay blocked (requires user interaction first):', err.message));
      
      nextStartTimeRef.current = 0;
      audioSourcesRef.current = [];
      console.log('✓ Audio contexts ready. Output sample rate:', outputContextRef.current.sampleRate);
      console.log('✓ Audio routing configured for cross-platform compatibility (iOS/macOS/Android/Desktop)');

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
      
      // Add input gain node to amplify quiet microphone input
      // Microphone input is often very weak and needs amplification for proper encoding
      const inputGainNode = inputContextRef.current.createGain();
      inputGainNode.gain.value = 8; // Amplify by 8x (increased from 3x for stronger input signal)
      console.log('🔊 Input gain set to 8x amplification');
      
      // Connect: microphone → gain → processing
      audioSource.connect(inputGainNode);
      
      // Load and register the audio worklet
      console.log('⚙️ Loading audio worklet processor...');
      let isAudioWorkletSupported = true;
      try {
        await inputContextRef.current.audioWorklet.addModule('/audioWorklet.js');
        console.log('✓ Audio worklet loaded');
      } catch (err) {
        console.warn('⚠️ AudioWorklet not available (common on iOS/Safari), using fallback:', err);
        isAudioWorkletSupported = false;
        // We'll use ScriptProcessorNode fallback instead of failing
      }

      // Audio processing handler - works with both AudioWorklet and ScriptProcessorNode
      const handleAudioData = (inputData: Float32Array) => {
        // If muted, skip entirely
        if (isMutedRef.current) {
          console.warn('⏸ Audio captured but muted - skipping');
          return;
        }
        
        // Debug: Log that we received audio data
        console.log('📦 handleAudioData called with', inputData.length, 'samples');
        
        try {
          // CRITICAL: Make a copy of the input data because Web Audio API reuses buffers
          // If we don't copy, we'll be encoding stale/recycled data
          const audioDataCopy = new Float32Array(inputData);
          
          // Check if we're actually capturing audio (not all zeros)
          const max = Math.max(...Array.from(audioDataCopy).map(Math.abs));
          console.log('🎤 Audio captured - peak level:', max.toFixed(6), 'samples:', audioDataCopy.length, 'ws state:', wsRef.current?.readyState);
          
          // Diagnostic: Flag if audio is extremely quiet (may indicate permission issue or hardware mute)
          if (max < 0.0001) {
            console.warn('⚠️ VERY QUIET AUDIO DETECTED (peak: ' + max.toFixed(8) + ') - Check: 1) Microphone muted in browser? 2) System mic volume low? 3) Browser permissions?');
          } else if (max < 0.001) {
            console.log('ℹ️ Microphone input is quiet but acceptable. Peak:', max.toFixed(6));
          }
          
          const base64Audio = pcmToBase64(audioDataCopy);
          
          // If WebSocket is ready, send immediately
          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({
              user_audio_chunk: base64Audio
            }));
            console.log('✅ Sent to ARIA - base64 size:', base64Audio.length);
          } else {
            // If not ready yet, queue for later
            const wsStatus = wsRef.current 
              ? `readyState: ${wsRef.current.readyState} (${['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][wsRef.current.readyState] || 'UNKNOWN'})`
              : 'undefined/null';
            console.warn('⏳ WebSocket not ready (wsRef.current status:', wsStatus, ') - queueing audio chunk');
            inputAudioQueueRef.current.push(audioDataCopy);
          }
        } catch (err) {
          console.error("Error sending audio:", err);
        }
      };

      if (isAudioWorkletSupported) {
        // Use AudioWorkletNode (preferred method)
        const workletNode = new AudioWorkletNode(inputContextRef.current, 'audio-input-processor');
        workletNodeRef.current = workletNode;

        // Handle audio data from the worklet
        workletNode.port.onmessage = (event) => {
          if (event.data.type === 'audio' && event.data.data) {
            console.log('📡 AudioWorklet sent data - peak:', event.data.peakLevel?.toFixed(4) || 'N/A');
            handleAudioData(event.data.data);
          }
        };

        // Connect audio graph: microphone → gain → worklet → destination
        inputGainNode.connect(workletNode);
        workletNode.connect(inputContextRef.current.destination);
        console.log('✓ Audio input ready (using AudioWorkletNode with gain amplification)');
      } else {
        // Fallback to ScriptProcessorNode for iOS/Safari
        console.log('⚠️ Using ScriptProcessorNode fallback for audio input');
        const scriptNode = inputContextRef.current.createScriptProcessor(4096, 1, 1);
        
        scriptNode.onaudioprocess = (event) => {
          // IMPORTANT: Get a COPY of the channel data, not a reference
          // The input buffer is reused, so we must copy it immediately
          const inputData = new Float32Array(event.inputBuffer.getChannelData(0));
          handleAudioData(inputData);
        };

        // Connect audio graph: microphone → gain → script processor → destination
        inputGainNode.connect(scriptNode);
        scriptNode.connect(inputContextRef.current.destination);
        console.log('✓ Audio input ready (using ScriptProcessorNode fallback)');
      }

      // Connect to ElevenLabs
      console.log('🔗 Connecting WebSocket to:', ELEVENLABS_WS_URL);
      const ws = new WebSocket(ELEVENLABS_WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('✅ CONNECTED to ElevenLabs! WebSocket readyState:', ws.readyState);
        setIsConnected(true);
        setIsConnecting(false);
        setError(null);
        
        // Flush any queued audio chunks from before connection
        const queuedCount = inputAudioQueueRef.current.length;
        console.log('📤 Flushing', queuedCount, 'queued audio chunks');
        let sentCount = 0;
        while (inputAudioQueueRef.current.length > 0) {
          const queuedAudio = inputAudioQueueRef.current.shift();
          if (queuedAudio) {
            try {
              const base64Audio = pcmToBase64(queuedAudio);
              ws.send(JSON.stringify({
                user_audio_chunk: base64Audio
              }));
              sentCount++;
            } catch (err) {
              console.error('❌ Error sending queued audio:', err);
            }
          }
        }
        console.log(`✅ Queued audio flushed (${sentCount}/${queuedCount} sent), ready for live capture`);
      };

      ws.onmessage = async (event) => {
        try {
          const message: ElevenLabsMessage = JSON.parse(event.data);
          console.log('📨 WebSocket message received:', message.type);

          // Handle agent audio response - audio_base_64 is inside audio_event
          const audioData = (message as any).audio_event?.audio_base_64;
          if (message.type === 'audio' && audioData) {
            console.log('🔊 Playing agent audio, data length:', audioData.length);
            setIsAgentSpeaking(true);
            
            // CRITICAL: Resume audio element playback when audio arrives
            // Some browsers require this after initial autoplay is blocked
            if (audioElementRef.current && audioElementRef.current.paused) {
              audioElementRef.current.play()
                .then(() => console.log('✓ Resumed audio element playback'))
                .catch(err => console.warn('⚠️ Could not resume audio element:', err.message));
            }
            
            if (!outputContextRef.current) {
              console.error('❌ Output context is null');
              return;
            }

            if (outputContextRef.current.state === 'closed') {
              console.error('❌ Output context is closed');
              return;
            }

            try {
              const ctx = outputContextRef.current;
              console.log('🎵 Output context state:', ctx.state, 'Current time:', ctx.currentTime);

              // Decode audio at 16000 Hz (ElevenLabs PCM rate)
              let audioBuffer = await decodeAudioData(audioData, ctx, 16000);
              console.log('✓ Audio decoded, duration:', audioBuffer.duration, 'sampleRate:', audioBuffer.sampleRate);
              
              // Resample if output context uses different sample rate
              if (ctx.sampleRate !== 16000) {
                console.log('🔄 Resampling from 16000 Hz to', ctx.sampleRate, 'Hz');
                audioBuffer = await resampleAudio(audioBuffer, ctx.sampleRate, ctx);
                console.log('✓ Resampled, new duration:', audioBuffer.duration);
              }
              
              // Add to queue instead of playing immediately
              audioQueueRef.current.push({ buffer: audioBuffer, duration: audioBuffer.duration });
              console.log('📋 Audio queued. Total in queue:', audioQueueRef.current.length, 'Currently playing:', isPlayingRef.current);
              
              // Process queue if not already playing
              // Double-check that we're not already processing
              if (!isPlayingRef.current && audioSourcesRef.current.length === 0) {
                console.log('🚀 Starting queue processor');
                processAudioQueue(ctx);
              } else {
                console.log('⏳ Already processing queue, new chunk will be played in sequence');
              }
            } catch (err) {
              console.error("❌ Error playing audio:", err);
              setIsAgentSpeaking(false);
            }
          }

          if (message.type === 'interruption') {
            console.log('⏸ User interrupted');
            // Stop all sources immediately
            audioSourcesRef.current.forEach(s => { try { s.stop(); } catch (e) {} });
            audioSourcesRef.current = [];
            // Clear the queue
            audioQueueRef.current = [];
            isPlayingRef.current = false;
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
    
    // Clear both output and input queues
    audioQueueRef.current = [];
    inputAudioQueueRef.current = [];
    isPlayingRef.current = false;

    // Cleanup audio element for proper iOS audio routing
    if (audioElementRef.current) {
      try {
        audioElementRef.current.pause();
        audioElementRef.current.srcObject = null;
      } catch (e) {
        console.warn('Error cleaning up audio element:', e);
      }
      audioElementRef.current = null;
    }

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