# React Flow: First keyboard interaction is ignored after page refresh

## Problem

After refreshing the page, the first keyboard interaction with the React Flow canvas appears to be ignored, as if the first key press initializes or focuses the canvas.

The same behavior occurs with both `Delete` and `Backspace`.

## Reproduce

1. Refresh the page.
2. Select a node and press `Delete` or `Backspace`.
3. The first key press does nothing.
4. Press `Delete` or `Backspace` again, and the node is deleted.
5. Subsequent keyboard interactions work normally.
