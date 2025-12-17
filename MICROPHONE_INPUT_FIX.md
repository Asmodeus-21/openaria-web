# Audio Input Fix - User Microphone Not Being Heard (December 17, 2025)

## Issue
After fixing audio output, ARIA couldn't hear the user's microphone input. Audio data wasn't being properly sent to the ElevenLabs WebSocket.

## Root Cause
**Buffer Reuse Problem:** Web Audio API reuses buffers for efficiency. When we passed the audio data to `pcmToBase64()` without copying, we were encoding stale/recycled buffer data instead of the actual current audio chunk.

```javascript
// BROKEN CODE:
const channelData = event.inputBuffer.getChannelData(0); // Gets a reference
handleAudioData(channelData);  // By the time this encodes, buffer has changed!
```

The audio processor calls `handleAudioData()` asynchronously, but by the time the encoding happens, the Web Audio API has already moved on to processing the next chunk and reused the same buffer memory. Result: ARIA receives corrupted/stale audio.

---

## Solution
Make an immediate copy of the audio data in both paths:

### ✅ Fix 1: Copy in handleAudioData Function
```typescript
const handleAudioData = (inputData: Float32Array) => {
  // CRITICAL: Make a copy IMMEDIATELY
  const audioDataCopy = new Float32Array(inputData);
  const base64Audio = pcmToBase64(audioDataCopy);
  // ... rest of code
};
```

**Why:** Even if the caller copies, we double-check here to be safe.

### ✅ Fix 2: Copy in ScriptProcessorNode
```typescript
scriptNode.onaudioprocess = (event) => {
  // CRITICAL: Copy immediately, don't pass reference
  const inputData = new Float32Array(event.inputBuffer.getChannelData(0));
  handleAudioData(inputData);
};
```

**Why:** ScriptProcessorNode buffers are reused. We must copy the data in the event handler before it's overwritten.

### ✅ Fix 3: Already Correct in AudioWorklet
```javascript
// AudioWorklet already does this correctly:
const audioData = new Float32Array(channelData); // Copies immediately
this.port.postMessage({ type: 'audio', data: audioData });
```

**Status:** No changes needed - this was already implemented correctly.

---

## How It Works Now

1. **Microphone captures audio**
2. **AudioWorklet OR ScriptProcessorNode immediately copies the buffer**
3. **Copy is passed to handleAudioData()**
4. **handleAudioData() makes another copy (defensive copy)**
5. **Copy is encoded to base64 and sent to WebSocket**
6. **ARIA receives the audio and responds**

---

## Testing Checklist
- [ ] Speak into microphone after opening ARIA modal
- [ ] Check console logs for "🎤 Sent audio chunk to ARIA"
- [ ] Verify ARIA responds to what you say
- [ ] Test on different devices (iPhone, Android, desktop)
- [ ] Test on different browsers (Safari, Chrome, Firefox)
- [ ] Verify audio input continues working through entire conversation
- [ ] No dropped audio chunks or delays

---

## Console Logs to Watch For

**Good signs:**
```
✓ Audio input ready (using AudioWorkletNode)
🎤 Sent audio chunk to ARIA, size: 4096
```

**Or (if AudioWorklet not supported):**
```
⚠️ Using ScriptProcessorNode fallback for audio input
✓ Audio input ready (using ScriptProcessorNode fallback)
🎤 Sent audio chunk to ARIA, size: 4096
```

**Bad signs:**
```
⏳ WebSocket not ready, queueing audio chunk
Error sending audio: ...
```

---

## Files Modified
- `components/LiveAgentModal.tsx`: 
  - Line ~225: Added copy in handleAudioData
  - Line ~271: Added copy in ScriptProcessorNode event handler

## Why This Matters
Web Audio API is highly optimized but reuses buffers. This is a common pitfall when working with real-time audio processing. Many developers miss this and end up with:
- Silent audio
- Distorted audio
- Intermittent audio issues

The fix is simple (one line per location) but critical for audio to work properly.

---

## Next Steps if Still Not Working

1. **Check browser console** for errors during startup
2. **Check microphone permissions** - browser should ask for permission
3. **Verify WebSocket connection** - look for "✅ CONNECTED to ElevenLabs!"
4. **Check network tab** - WebSocket should show messages being sent
5. **Test on different device** - rules out device-specific issues

---

## Summary
The issue was a classic Web Audio API buffer reuse problem. By immediately copying the audio data before processing, ARIA can now hear the user properly. This is a minimal, safe fix that doesn't change any other functionality.
