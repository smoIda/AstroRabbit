import { useCallback, useRef } from "react";

import { ExecutionEvent } from "@/app/projects/test/_providers/executor/config";
import { ExecutorContextValue } from "@/app/projects/test/_providers/executor/provider";
import { EditorActionContextValue } from "@/app/projects/test/_providers/editor/provider";

import { API_URL } from "@/hooks/config";

type Stream = {
  subscribe: (executionId: string) => void;
  close: () => void;
};

const isTerminal = (event: ExecutionEvent) =>
  event.type === "EXECUTION_SUCCESS" ||
  event.type === "EXECUTION_ERROR" ||
  event.type === "EXECUTION_ABORTED";

export function useStream(
  { patchExecutor }: ExecutorContextValue["action"],
  { patchNodeExecution, patchEdgeExecution }: EditorActionContextValue["action"],
): Stream {
  const eventSource = useRef<EventSource | null>(null);

  const onEvent = useCallback(
    (event: ExecutionEvent) => {
      switch (event.type) {
        case "EXECUTION_STARTED":
          return patchExecutor("RUNNING");

        case "EXECUTION_SUCCESS":
          return patchExecutor("SUCCESS");

        case "EXECUTION_ABORTED":
          return patchExecutor("ABORTED");

        case "EXECUTION_ERROR":
          return patchExecutor("ERROR", event.output);

        case "NODE_STARTED":
          return patchNodeExecution(event.nodeId, "RUNNING");

        case "NODE_SKIPPED":
          return patchNodeExecution(event.nodeId, "SKIPPED", event.duration);

        case "NODE_SUCCESS":
          return patchNodeExecution(event.nodeId, "SUCCESS", event.duration, event.output);

        case "NODE_ERROR":
          return patchNodeExecution(event.nodeId, "ERROR", event.duration, event.output);

        case "EDGE_STARTED":
          return patchEdgeExecution(event.edgeId, "RUNNING");

        case "EDGE_FINISHED":
          return patchEdgeExecution(event.edgeId, "FINISHED");

        case "EDGE_SKIPPED":
          return patchEdgeExecution(event.edgeId, "SKIPPED");
      }
    },
    [patchExecutor, patchNodeExecution, patchEdgeExecution],
  );

  const close = useCallback(() => {
    if (!eventSource.current) return;

    eventSource.current.close();
    eventSource.current = null;
  }, []);

  const subscribe = useCallback(
    (executionId: string) => {
      eventSource.current?.close();

      const source = new EventSource(`${API_URL}/executor/${executionId}/events`);

      eventSource.current = source;

      source.onmessage = (message) => {
        const event: ExecutionEvent = JSON.parse(message.data);

        onEvent(event);

        if (isTerminal(event)) close();
      };

      source.onerror = () => {
        console.error("Something unexpectedly occurred while streaming");

        close();
      };
    },
    [onEvent, close],
  );

  return { subscribe, close };
}
