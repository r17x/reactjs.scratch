# Direct Event Listeners Approach

## Branch: `approach-direct-listeners`

## Problem
Event handlers are being accumulated across re-renders, causing multiple handler executions per event.

## This Approach
Replace the event delegation system with direct event listeners attached to DOM elements.

### Strategy
1. **Remove event delegation**: Eliminate the complex event delegation system entirely
2. **Direct addEventListener**: Use `addEventListener` and `removeEventListener` directly on DOM elements
3. **Lifecycle management**: Properly add/remove listeners during DOM updates
4. **Cleanup on unmount**: Ensure listeners are removed when elements are removed

### Key Changes
- Remove event delegation infrastructure
- Modify `updateElementProps` to use direct listeners
- Add cleanup logic for removed elements
- Simplify event handling code

### Trade-offs
- **Pros**: Simpler, more predictable event handling
- **Cons**: More memory usage (one listener per element vs. one per container)

### Expected Outcome
Event handlers should work correctly with a simpler, more reliable approach similar to how React works.

## Testing
Run the failing test:
```bash
CI=true npm test tests/dom-integration.test.ts -t "should handle event handlers correctly across re-renders"
```

## Current Status
- ✅ DOM updates working correctly
- ✅ Input value updates working
- ❌ Event handler accumulation issue remains