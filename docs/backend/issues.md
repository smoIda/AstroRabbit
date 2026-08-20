# Edge skipping is not working properly

## Problem

Currently, node skipping does not handle its own edge state, causing the executor to dump multiple EDGE_FINISHED at the end of the execution event list. It goes like this:

```
EXECUTION_STARTED
NODE_STARTED
NODE_SUCCESS
EDGE_STARTED
NODE_STARTED
NODE_SKIPPED
*EDGE_SKIPPED* <-- Tried to implement the catch here
EDGE_STARTED
NODE_STARTED
NODE_SUCCESS
**2x EDGE_FINISHED**
EXECUTION_SUCCESS
```

## Reproduce

Simply start an execution then skip a node