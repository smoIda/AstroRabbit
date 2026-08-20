# Architecture Decisions

## 001 — Use SSE for execution streaming

### Context
The frontend needs to receive real-time node execution events
while the backend executes a flow.

### Decision
Use Server-Sent Events (SSE) for backend - frontend execution events.

### Why
- Execution events are primarily one-way.
- Browser has native EventSource support.
- Simpler than WebSockets.
- REST can handle commands such as pause/cancel later.

### Alternatives considered

#### WebSocket
Could provide bidirectional communication over one connection,
but adds complexity that v1 doesn't need.

#### Polling
Simpler, but introduces latency and unnecessary requests.

### Consequences
- Execution events are streamed through SSE.
- Commands continue using HTTP endpoints.
- If interactive debugging becomes sufficiently complex,
  WebSockets may be reconsidered.