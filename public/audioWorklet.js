/**
 * AudioWorklet Processor for capturing and encoding microphone audio
 * Runs in a dedicated audio thread to avoid main thread blocking
 * Replaces deprecated ScriptProcessorNode
 */

class AudioWorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.isMuted = false;
    
    // Listen for mute/unmute messages from main thread
    this.port.onmessage = (event) => {
      if (event.data.type === 'mute') {
        this.isMuted = event.data.value;
      }
    };
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0];
    
    // Skip if no input or muted
    if (!input || !input[0] || this.isMuted) {
      return true;
    }

    const channelData = input[0];
    
    // Send audio chunk to main thread for WebSocket transmission
    // We send a copy to avoid issues with buffer reuse
    const audioData = new Float32Array(channelData);
    this.port.postMessage({
      type: 'audio',
      data: audioData
    });

    return true;
  }
}

// Register the processor
registerProcessor('audio-input-processor', AudioWorkletProcessor);
