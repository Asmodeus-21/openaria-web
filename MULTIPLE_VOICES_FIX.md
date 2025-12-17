# ARIA Multiple Voices Fix - Audio Queuing Solution

## Problem
Users heard multiple overlapping voices/duplicates when ARIA spoke:
- Same response played multiple times simultaneously
- Created chorus/echo effect
- Multiple audio sources playing at once

## Root Cause Analysis

**The Issue:** Audio chunks were being played immediately and simultaneously without proper sequencing.

When ElevenLabs sends multiple audio chunks in quick succession:
1. Chunk 1 arrives → immediately starts playing at `nextStartTimeRef.current`
2. Chunk 2 arrives → also starts playing, but timing calculation gets misaligned
3. Chunk 3, 4, etc. → all overlap, creating multiple voices

The old code tried to prevent this with `nextStartTimeRef.current` calculations, but this approach fails because:
- Race conditions when messages arrive rapidly
- `AudioContext.currentTime` doesn't guarantee sequential playback
- Multiple `AudioBufferSourceNode` instances playing without proper sequencing

## Solution: Audio Queue System

Implemented a **sequential audio queue** that ensures only ONE audio chunk plays at a time.

### Key Changes:

1. **Added Audio Queue** (`audioQueueRef`)
   ```typescript
   audioQueueRef.current: Array<{ buffer: AudioBuffer; duration: number }>
   ```
   - Stores audio chunks in order
   - Prevents overlapping playback

2. **Added Playing State** (`isPlayingRef`)
   ```typescript
   isPlayingRef.current: boolean
   ```
   - Tracks if audio is currently playing
   - Prevents multiple simultaneous playback starts

3. **New Queue Processor** (`processAudioQueue`)
   ```typescript
   const processAudioQueue = (ctx: AudioContext) => {
     // Takes next item from queue
     // Plays it
     // When finished, plays next item
     // Recursive until queue is empty
   }
   ```

### How It Works:

```
WebSocket Message arrives
    ↓
Decode audio chunk
    ↓
Add to queue: audioQueueRef.current.push({ buffer, duration })
    ↓
If NOT currently playing:
    Start processAudioQueue()
    ↓
    Get first chunk from queue
    ↓
    Play it
    ↓
    When finished (onended):
        Remove from active sources
        ↓
        If queue has more items:
            Play next chunk (recursive)
        Else:
            Stop speaking indicator
```

### Code Flow:

**Before (BROKEN):**
```typescript
// All chunks start immediately and overlap
bufferSource.start(nextStartTimeRef.current);
nextStartTimeRef.current += audioBuffer.duration;  // ❌ Can cause overlaps
```

**After (FIXED):**
```typescript
// Queue chunks and play sequentially
audioQueueRef.current.push({ buffer: audioBuffer, duration: audioBuffer.duration });

if (!isPlayingRef.current) {
  processAudioQueue(ctx);
}

// In processAudioQueue:
bufferSource.onended = () => {
  // After this chunk ends, automatically play next chunk
  if (audioQueueRef.current.length > 0) {
    processAudioQueue(ctx);  // Recursive call
  }
};

bufferSource.start(ctx.currentTime);  // ✓ Starts immediately at current time
```

## Benefits

✅ **Only one voice at a time** - Audio chunks play sequentially  
✅ **No overlapping** - Each chunk waits for the previous to finish  
✅ **Robust** - Works with rapid incoming messages  
✅ **Clean queuing** - Standard queue pattern, easy to understand  
✅ **Memory safe** - Queue is cleared on stop/interruption  
✅ **Handles interruptions** - Clear queue + stop all sources immediately  

## Testing

1. **Normal conversation** - ARIA speaks, you hear single clear voice
2. **Fast responses** - ARIA speaks rapidly, no overlapping
3. **Interruption** - User interrupts while ARIA is speaking, stops cleanly
4. **Multiple sessions** - Start/stop multiple calls, no queue carryover

## Files Modified

- `components/LiveAgentModal.tsx`
  - Added `audioQueueRef` (queue of audio buffers)
  - Added `isPlayingRef` (playback state)
  - Added `processAudioQueue()` (sequential playback function)
  - Updated message handler to queue instead of play-immediately
  - Updated `stopSession()` to clear queue
  - Removed problematic `nextStartTimeRef` timing logic

## Technical Notes

- Uses recursive function calls (one per audio chunk)
- Stack depth is minimal (only 1 chunk playing at a time)
- No memory leaks (sources are filtered out after `onended`)
- Works with all audio formats ElevenLabs sends
- Compatible with iOS/macOS fixes from previous audio fix

## Performance Impact

- **Negligible** - Queue is at most a few items (audio chunks)
- **Actually better** - Fewer simultaneous audio nodes = less CPU
- **More stable** - Sequential processing is more predictable

---

## Summary

This fix replaces simultaneous audio playback with sequential queue-based playback. Instead of starting all audio chunks at calculated times (which causes overlaps), chunks are added to a queue and played one-at-a-time, each triggering the next when finished. This ensures clean, single-voice responses with no overlapping audio.
