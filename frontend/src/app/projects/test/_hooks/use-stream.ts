import { useCallback, useRef } from "react";

import { ExecutionEvent } from "@/app/projects/test/_providers/executor/config";
import { ExecutorContextValue } from "@/app/projects/test/_providers/executor/provider";
import { EditorContextValue } from "@/app/projects/test/_providers/editor/provider";

import { API_URL } from "@/hooks/config";

const isTerminal = (event: ExecutionEvent) =>
  event.type === "EXECUTION_SUCCESS" ||
  event.type === "EXECUTION_ERROR" ||
  event.type === "EXECUTION_CANCELLED";

export function useStream(
  executor: ExecutorContextValue["action"],
  editor: EditorContextValue["action"],
) {
  const eventSource = useRef<EventSource | null>(null);

  const onEvent = useCallback(
    (event: ExecutionEvent) => {
      switch (event.type) {
        case "EXECUTION_STARTED":
          return executor.setExecutor("RUNNING");

        case "EXECUTION_SUCCESS":
          return executor.setExecutor("SUCCESS");

        case "EXECUTION_CANCELLED":
          return executor.setExecutor("CANCELLED");

        case "EXECUTION_ERROR":
          return executor.setExecutor("ERROR", event.output);

        case "NODE_STARTED":
          return editor.setNode(event.nodeId, "RUNNING");

        case "NODE_SKIPPED":
          return editor.setNode(event.nodeId, "SKIPPED", event.duration);

        case "NODE_SUCCESS":
          return editor.setNode(event.nodeId, "SUCCESS", event.duration, event.output);

        case "NODE_ERROR":
          return editor.setNode(event.nodeId, "ERROR", event.duration, event.output);

        case "EDGE_STARTED":
          return editor.setEdge(event.edgeId, "RUNNING");

        case "EDGE_FINISHED":
          return editor.setEdge(event.edgeId, "FINISHED");

        case "EDGE_SKIPPED":
          return editor.setEdge(event.edgeId, "SKIPPED");
      }
    },
    [executor, editor],
  );

  const closeStream = useCallback(() => {
    if (!eventSource.current) return;

    eventSource.current.close();
    eventSource.current = null;
  }, []);

  const stream = useCallback(
    (executionId: string) => {
      eventSource.current?.close();

      const source = new EventSource(`${API_URL}/executor/${executionId}/events`);

      eventSource.current = source;

      source.onmessage = (message) => {
        const event: ExecutionEvent = JSON.parse(message.data);

        onEvent(event);

        if (isTerminal(event)) closeStream();
      };

      source.onerror = () => {
        onEvent({
          type: "EXECUTION_ERROR",
          output: "Something unexpectedly occurred while streaming",
        });

        closeStream();
      };
    },
    [onEvent, closeStream],
  );

  return { stream, closeStream };
}
