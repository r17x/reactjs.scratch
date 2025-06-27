# Input Field Text Truncation Issue

## Summary
The text input field in the Todo List component is not properly handling text input events, causing only the first character to be captured and displayed.

## Reproduction Steps
1. Navigate to `http://localhost:5173/`
2. Locate the "Enter a todo..." text input field under the "Todo List" section
3. Type any text longer than one character (e.g., "Test todo item")
4. Observe that only the first character ("T") appears in the input field

## Expected Behavior
- The input field should display the complete text as the user types
- All characters should be captured and stored in the component's state
- The input should maintain focus throughout the typing process

## Actual Behavior
- Only the first character of the typed text is displayed
- Subsequent characters are not captured or displayed
- The input field appears to lose focus or reset after each character

## Technical Analysis
This issue is likely related to the implementation of synthetic events in the React scratch implementation. The problem appears to be in the `onChange` event handling for input elements.

## Root Cause
Based on the CLAUDE.md TODO list, this is a known limitation: "Proper implementation of Synthetic Events - This is important to retain the focus on input elements while updating the state."

The current synthetic event implementation is not properly:
1. Preventing the default browser behavior
2. Maintaining the input element's focus
3. Correctly updating the component state with the full input value

## Impact
- Todo functionality is completely broken
- Users cannot add meaningful todo items
- Demonstrates a fundamental issue with form input handling

## Priority
**High** - This breaks core functionality of the demo application

## Related Files
- Input handling logic in the Todo component
- Synthetic event implementation in the React scratch library
- Event delegation and state update mechanisms

## Next Steps
1. Examine the current synthetic event implementation
2. Fix the input event handling to properly capture and maintain text input
3. Ensure input focus is maintained during state updates
4. Test with various input scenarios to verify the fix