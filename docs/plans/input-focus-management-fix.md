# Input Focus Management Fix Plan

## Problem Summary

The Todo app input field in the ReactJS.scratch implementation only captures the
first character when users type, making it impossible to enter meaningful text.
This breaks the core functionality of the demo application.

## Root Cause Analysis

### Technical Analysis

The issue stems from the current DOM rendering approach in
`src/react-dom/client/index.ts`:

1. **DOM Destruction on Re-render**: When `setState` is called, `forceUpdate()`
   executes `componentContainer.innerHTML = ''` (line 89), completely clearing
   the DOM
2. **Focus Loss**: The input element is destroyed and recreated, losing focus
   and cursor position
3. **Stale Event References**: The original event object becomes invalid after
   DOM replacement
4. **No State Preservation**: Input-specific state (focus, cursor position,
   selection) is not preserved across renders

### Current Event Handling Flow

```
User types → onInput event → setState() → forceUpdate() → innerHTML = '' → DOM recreated → Input loses focus → Subsequent keystrokes ignored
```

### Code Location

- **Main Issue**: `src/react-dom/client/index.ts:61` - Basic event listener
  attachment
- **Re-render Issue**: `src/react-dom/client/index.ts:89` - `innerHTML = ''`
  destroys DOM state
- **Event Handler**: `src/react-dom/client/index.ts:59-61` - Lacks synthetic
  event system

## Technical Solution Approach

### 1. Implement Synthetic Event System

Create a proper event wrapper system that:

- Wraps native events to preserve properties
- Maintains event references across re-renders
- Provides React-like event handling behavior
- Handles event pooling to prevent memory leaks

### 2. Enhance DOM Reconciliation

Replace the current "clear and rebuild" approach with:

- DOM diffing to identify actual changes
- Selective updates instead of full replacement
- Preservation of input state during updates
- Proper handling of controlled components

### 3. Input State Preservation

Implement mechanisms to:

- Store input focus state before re-render
- Restore focus and cursor position after re-render
- Handle controlled input value updates properly
- Maintain selection state across updates

### 4. Event System Improvements

Upgrade event handling to:

- Use event delegation for better performance
- Provide consistent event object interfaces
- Handle all input events (onInput, onChange, onFocus, onBlur)
- Support event prevention and propagation control

## Implementation Plan

### Phase 1: Synthetic Event Foundation

**File**: `src/react-dom/client/index.ts`

- [x] **Create SyntheticEvent interface**

  ```typescript
  interface SyntheticEvent {
    target: EventTarget;
    currentTarget: EventTarget;
    preventDefault(): void;
    stopPropagation(): void;
    nativeEvent: Event;
  }
  ```

- [x] **Implement event wrapper function**

  - [x] Preserve event properties in closure
  - [x] Handle event normalization
  - [x] Provide React-like API

- [x] **Update event listener attachment**
  - [x] Replace direct `addEventListener` calls
  - [x] Use synthetic event wrappers
  - [ ] Handle event delegation

### Phase 2: DOM State Preservation

**File**: `src/react-dom/client/index.ts`

- [x] **Implement input state capture**

  ```typescript
  interface InputState {
    element: HTMLInputElement;
    value: string;
    selectionStart: number | null;
    selectionEnd: number | null;
    focused: boolean;
  }
  ```

- [x] **Add state preservation logic**

  - [x] Capture input state before re-render
  - [x] Store focus and cursor information
  - [x] Identify which element needs restoration

- [x] **Implement state restoration**
  - [x] Restore focus after DOM update
  - [x] Set cursor position correctly
  - [x] Maintain selection state

### Phase 3: Smart DOM Updates

**File**: `src/react-dom/client/index.ts`

- [x] **Replace innerHTML clearing**

  - [x] Implement selective DOM updates
  - [x] Compare old and new element trees
  - [x] Update only changed elements

- [x] **Add controlled component handling**

  - [x] Detect controlled vs uncontrolled inputs
  - [x] Handle value synchronization properly
  - [x] Prevent unnecessary DOM updates

- [x] **Optimize re-render performance**
  - [x] Skip updates when state hasn't changed
  - [x] Batch multiple updates together
  - [x] Minimize DOM manipulation

### Phase 4: Event System Enhancement

**File**: `src/react-dom/client/index.ts`

- [x] **Implement event delegation**

  - [x] Add single event listener to container
  - [x] Route events to correct handlers
  - [x] Improve performance and memory usage

- [x] **Add event normalization**

  - [x] Provide consistent event interfaces
  - [x] Handle cross-browser differences
  - [x] Support all necessary event types

- [x] **Event lifecycle management**
  - [x] Proper event cleanup on unmount
  - [x] Handle dynamic event listener changes
  - [x] Support event prevention and bubbling

## Files to Modify

### Primary Changes

- **`src/react-dom/client/index.ts`**
  - Lines 59-61: Replace basic event handling
  - Lines 87-94: Replace innerHTML clearing with smart updates
  - Add synthetic event system implementation
  - Add input state preservation logic

### Potential Secondary Changes

- **`src/react/index.ts`**
  - May need synthetic event type definitions
  - Possible hook enhancements for event handling

## Testing Strategy

### Manual Testing Scenarios

- [ ] **Basic Input Functionality**

  - [ ] Type multiple characters in input field
  - [ ] Verify all characters are captured and displayed
  - [ ] Test backspace and delete keys

- [ ] **Focus Management**

  - [ ] Click in input field, type, verify focus maintained
  - [ ] Tab navigation between form elements
  - [ ] Click outside input, then back in

- [ ] **Cursor Position**

  - [ ] Type text, move cursor with arrow keys, type more
  - [ ] Select text and replace
  - [ ] Copy/paste operations

- [ ] **State Updates**
  - [ ] Verify todo addition works with multi-character input
  - [ ] Test rapid typing scenarios
  - [ ] Validate state consistency

### Edge Cases

- [ ] **Special Characters**

  - [ ] Unicode characters
  - [ ] Emoji input
  - [ ] Special symbols

- [ ] **Browser Events**

  - [ ] IME composition (Asian languages)
  - [ ] Auto-complete interactions
  - [ ] Browser spell-check integration

- [ ] **Performance**
  - [ ] Rapid state updates
  - [ ] Large todo lists
  - [ ] Memory leak prevention

### Regression Testing

- [ ] Verify existing button clicks still work
- [ ] Ensure counter component functionality unchanged
- [ ] Test other form elements (if any)
- [ ] Validate overall app stability

## Success Criteria

1. **Functional Requirements**

   - ✅ Users can type full sentences in the input field
   - ✅ Input maintains focus during typing
   - ✅ Cursor position is preserved correctly
   - ✅ Todo items can be added successfully

2. **Technical Requirements**

   - ✅ No innerHTML clearing for minor updates
   - ✅ Proper synthetic event implementation
   - ✅ Input state preservation across re-renders
   - ✅ No memory leaks from event handling

3. **User Experience**
   - ✅ Smooth typing experience
   - ✅ Expected input field behavior
   - ✅ No visual glitches during state updates
   - ✅ Consistent with standard web form behavior

## Risk Assessment

### Low Risk

- Basic event wrapper implementation
- Input state capture/restore logic

### Medium Risk

- DOM reconciliation complexity
- Event delegation implementation
- Cross-browser compatibility

### High Risk

- Major refactoring of rendering system
- Potential breaking changes to existing functionality
- Performance implications of new reconciliation

## Timeline Estimate

- **Phase 1 (Synthetic Events)**: 2-3 hours
- **Phase 2 (State Preservation)**: 2-3 hours
- **Phase 3 (Smart Updates)**: 3-4 hours
- **Phase 4 (Event Enhancement)**: 1-2 hours
- **Testing & Refinement**: 2-3 hours

**Total Estimated Time**: 10-15 hours

## Next Steps

1. Start with Phase 1 implementation
2. Test each phase incrementally
3. Get user feedback after each major milestone
4. Iterate based on testing results
5. Document any API changes or new patterns

This plan provides a structured approach to fixing the input focus management
issue while maintaining the existing functionality and improving the overall
robustness of the ReactJS.scratch implementation.
