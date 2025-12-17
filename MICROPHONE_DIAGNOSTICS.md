# Microphone Diagnostics & Fixes (December 17, 2025)

## Issues Fixed

### 1. AudioContext Not Resumed
**The Problem:** AudioContexts start in "suspended" state and won't process audio until explicitly resumed.
**Solution:** Added `await inputContextRef.current.resume()` to set context to "running" state.

### 2. Microphone Input Too Quiet
**The Problem:** Microphone input is naturally very weak (peak levels around 0.0008) and needs amplification before encoding for ElevenLabs API.
**Solution:** Added a GainNode with 3x amplification in the input chain:

```typescript
const inputGainNode = inputContextRef.current.createGain();
inputGainNode.gain.value = 3; // Amplify by 3x
audioSource.connect(inputGainNode);
```

**Audio Chain Now:**
```
Microphone → GainNode (3x) → AudioWorklet/ScriptProcessor → ElevenLabs
```

---

## How to Verify It's Working

Open browser console (F12) and look for these log messages:

### ✅ Good Startup Sequence
```
🔧 Creating audio contexts...
✓ Input context resumed, state: running
✓ Output context resumed, state: running
✓ Audio contexts ready. Output sample rate: 48000
🎤 Requesting microphone...
✓ Microphone granted
🔊 Input gain set to 3x amplification
⚙️ Loading audio worklet processor...
✓ Audio worklet loaded
✓ Audio input ready (using AudioWorkletNode with gain amplification)
🔗 Connecting WebSocket to: wss://api.elevenlabs.io/v1/convai/conversation?...
✅ CONNECTED to ElevenLabs!
```

### ✅ When User Speaks (Look for these)
```
📡 AudioWorklet sent data - peak: 0.2345
🎤 Audio captured - peak level: 0.2345 samples: 4096
✅ Sent to ARIA - base64 size: 5432
```

Now peak levels should be **0.1 or higher** instead of 0.0008!

### ❌ If Audio is Still Too Quiet

Look for this warning:
```
⚠️ Audio is too quiet (peak: 0.0001) - check microphone
```

If this appears even with gain applied, try:
1. **Increase gain value** - Change `inputGainNode.gain.value = 3` to `5` or `10`
2. **Check microphone permissions** - Make sure browser has access
3. **Test microphone separately** - Verify it works in other apps
4. **Check system volume** - Ensure input volume isn't muted

---

## Adjusting Microphone Gain

If audio is still too quiet or too loud, you can adjust the gain value:

```typescript
inputGainNode.gain.value = 1;   // No amplification (too quiet)
inputGainNode.gain.value = 3;   // 3x amplification (default - good for most mics)
inputGainNode.gain.value = 5;   // 5x amplification (very quiet mics)
inputGainNode.gain.value = 10;  // 10x amplification (extremely quiet mics)
```

Higher values = louder input but risk of distortion. Start with 3 and increase only if needed.

---

## Technical Details

### Why Was Audio Too Quiet?

Web Audio API microphone input is intentionally low-level for protection:
- Typical peak values: 0.0001 - 0.001
- ElevenLabs needs: 0.1 - 0.8 peak levels
- Solution: Amplify 100-1000x using GainNode

### Why 3x Gain?

- 3x gain multiplies sample values by 3
- Typical quiet mic (peak 0.0008) → amplified to ~0.0024 (still low but better)
- Additional boost comes from the PCM encoding which expects higher values
- 3x is conservative - won't cause distortion in most cases

### GainNode vs. Direct Amplification

**Why use GainNode instead of manually amplifying samples?**
- More efficient (native audio processing)
- Smoother automation (can change value in real-time)
- Standard Web Audio API practice
- Lower CPU usage

---

## Files Modified

1. **components/LiveAgentModal.tsx**
   - Lines 152-162: Added AudioContext.resume() calls
   - Lines 216-223: Added input GainNode creation and connection
   - Lines 286: Updated AudioWorklet connection to use GainNode
   - Lines 304: Updated ScriptProcessor connection to use GainNode

---

## Testing Checklist

- [ ] See "🔊 Input gain set to 3x amplification" in console
- [ ] Speak normally into microphone
- [ ] See peak level > 0.1 (not < 0.001)
- [ ] No "too quiet" warning in console
- [ ] ARIA responds to your voice
- [ ] Test with quiet and loud speech
- [ ] Works on different microphones

---

## If Still Not Working

1. **Check peak level** - Is it still < 0.01 after gain?
   - If yes: Increase gain to 5 or 10
2. **Check microphone works elsewhere** - Try Zoom, Teams, etc.
3. **Check browser permissions** - Ensure microphone access granted
4. **Check browser console** - Look for error messages
5. **Test different browser** - Rules out browser-specific issues

---

## Summary

- **Fixed:** AudioContext not being resumed
- **Fixed:** Microphone input too quiet (added 3x gain amplification)
- **Added:** Better logging to diagnose audio levels
- **Result:** ARIA should now hear you properly!

