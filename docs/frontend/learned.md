# Lifecycle invariant

## Problem

The SSE stream would freeze halfway through an execution. There were no logs, warnings, or errors indicating what went wrong, the browser would simply stop receiving events.

The backend was healthy, and the SSE endpoint returned 200 OK in the network tab. Even stranger, the execution appeared to stop at a random node and at a random point in time. There seemed to be no consistent pattern that could identify the source of the problem.

## Cause

When I was refactoring my code, I moved the stream and the engine, originally in `ExecutorProvider`, to dedicated hooks. After that, I started working on the node execution,

## Fix

My first assumption was the backend. I checked the execution service and found nothing wrong.

Next, I investigated the SSE connection. The `/events` request returned **200 OK**, so I initially had no reason to suspect the stream itself.

I then investigated the related frontend possibilities: `useStream`, `useEngine`, state synchronization, stale state, and the recent refactor that had moved the engine and stream logic out of `ExecutorProvider` and into dedicated hooks.

I even temporarily moved `useEngine` back into `ExecutorProvider`, suspecting that the refactor had introduced a lifecycle or state-management problem. At one point, I considered creating a dedicated `EngineProvider` just to isolate whether state ownership was the issue, but I did not do that because I genuinely thought there was something deeper than the lifecycle.

I added console.log and backend print statements everywhere I could think of. And, of course, everything worked flawlessly while I was watching it.

The breakthrough came when I was researching on the Internet:

> Who owns the engine?

That immediately made me inspect the node hotbar, the component responsible for initiating execution, and there it was.

## Realization

The execution itself was not nondeterministic. The actual sequence was:

    Execution starts
    ↓
    I changes node selection
    ↓
    Hotbar unmounts
    ↓
    Hotbar cleanup runs
    ↓
    SSE connection is cleaned up
    ↓
    Frontend stops receiving execution events
    ↓
    Execution appears to stop at a random node while the backend finished the execution, exited with no issues

The apparent randomness came from when _the node selection changed_, not from _the execution engine_. The hotbar owned part of the execution lifecycle, but its own component lifecycle was shorter than the execution lifecycle. When the component unmounted, its cleanup logic ran and unintentionally terminated something that was still needed by the ongoing execution.

## Lesson

The SSE request returning _200 OK_ only proved that the connection was successfully established. It did not guarantee that the connection would remain alive for the entire execution. I was checking whether each individual piece worked, but I wasn't checking whether their _lifetimes_ were compatible.

When debugging an asynchronous system, ask who owns each resource, when that owner can disappear, and what happens during cleanup. For any long-running operation, I should explicitly consider:

- Who creates it?
- Who owns it?
- How long is it supposed to live?
- What causes its owner to unmount or disappear?
- What does its cleanup function do?
- Can that cleanup happen while the operation is still running?
- Is the resource lifecycle longer than the component lifecycle?

A component being responsible for starting an execution does not necessarily mean it should be responsible for owning the execution.

This bug also changed how I think about *random failures*. When an asynchronous process appears to stop at random points, I should not immediately assume the process itself is nondeterministic. 

-> The apparent randomness may come from an external lifecycle event.