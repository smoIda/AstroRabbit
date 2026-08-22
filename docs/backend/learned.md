# Recursive graph traversal bug

*RESOLVED: 8/20/2026*

## Problem

While implementing AstroRabbit's execution engine, I wanted edges to finish immediately after their destination node finished:

    EDGE_STARTED
    ↓
    NODE_STARTED
    ↓
    NODE_SUCCESS
    ↓
    EDGE_FINISHED
    ↓
    EDGE_STARTED
    ↓
    ...

Instead, `EDGE_FINISHED` events were delayed until descendant nodes had completed, causing multiple `EDGE_FINISHED` events to appear at the end of execution. For example,

    EDGE_STARTED
    ↓
    NODE_STARTED
    ↓
    NODE_SUCCESS
    ↓
    EDGE_STARTED
    ↓
    NODE_STARTED
    ↓
    ...
    ↓
    [n] EDGE_FINISHED
    ↓
    EXECUTION_SUCCESS

## Cause

`execute_node()` was responsible for both executing a node and recursively traversing its outgoing edges. Therefore, `await execute_node(next_node)` did not return when the target node finished; it returned only after its entire descendant chain had finished.

## Fix

Separated the responsibilities:

- `execute_node()` executes exactly one node and returns.
- `traverse_edge()` starts an edge, executes its target node, finishes the edge, then continues traversing.

This restored the intended event ordering.

## Lesson

Keep node execution and graph traversal as separate responsibilities. When using `await`, understand exactly what the awaited function guarantees to have completed before returning.