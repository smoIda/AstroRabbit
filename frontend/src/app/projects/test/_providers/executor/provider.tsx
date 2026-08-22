"use client";

import { createContext, useEffect, useMemo, useReducer, useRef } from "react";

import { useMutation } from "@tanstack/react-query";

import { useEditor } from "@/app/projects/test/_hooks/use-editor";
import {
  updateEdge,
  updateExecutor,
  updateNode,
} from "@/app/projects/test/_providers/executor/utils";
import {
  ActionExecutor,
  ExecutionEvent,
  ExecutorContextValue,
  InitialExecutor,
} from "@/app/projects/test/_providers/executor/config";

import { API_URL, QUERY_KEYS } from "@/hooks/config";

import { cancelProgram, executeProgram, skipNode } from "@/lib/api/executor";

export const ExecutorContext = createContext<ExecutorContextValue | null>(null);

const initialExecutor: InitialExecutor = {
  id: null,
  status: "IDLE",
  error: null,
};

const actionExecutor = (
  state: InitialExecutor,
  action: ActionExecutor,
): InitialExecutor => {
  switch (action.type) {
    case "RESET":
      return {
        ...state,
        id: null,
        status: "IDLE",
      };

    case "SET_ID":
      return {
        ...state,
        id: action.payload,
      };

    case "SET_EXECUTOR":
      return {
        ...state,
        status: action.payload.status,
        error:
          action.payload.status === "ERROR"
            ? action.payload.error || "Internal execution error"
            : "",
      };

    default:
      return state;
  }
};

export function ExecutorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(actionExecutor, initialExecutor);

  const { dispatch: editorDispatch } = useEditor();

  const eventSource = useRef<EventSource | null>(null);

  function onEvent(event: ExecutionEvent) {
    switch (event.type) {
      case "EXECUTION_STARTED":
        dispatch(updateExecutor("RUNNING"));
        break;

      case "EXECUTION_SUCCESS":
        dispatch(updateExecutor("SUCCESS"));
        break;

      case "EXECUTION_CANCELLED":
        dispatch(updateExecutor("CANCELLED"));
        break;

      case "EXECUTION_ERROR":
        dispatch(updateExecutor("ERROR", event.output));
        break;

      case "NODE_STARTED":
        editorDispatch(updateNode(event.nodeId, "RUNNING"));
        break;

      case "NODE_SKIPPED":
        editorDispatch(updateNode(event.nodeId, "SKIPPED", event.duration));
        break;

      case "NODE_SUCCESS":
        editorDispatch(
          updateNode(event.nodeId, "SUCCESS", event.duration, event.output),
        );
        break;

      case "NODE_ERROR":
        editorDispatch(
          updateNode(event.nodeId, "ERROR", event.duration, event.output),
        );
        break;

      case "EDGE_STARTED":
        editorDispatch(updateEdge(event.edgeId, "RUNNING"));
        break;

      case "EDGE_FINISHED":
        editorDispatch(updateEdge(event.edgeId, "FINISHED"));
        break;

      case "EDGE_SKIPPED":
        editorDispatch(updateEdge(event.edgeId, "SKIPPED"));
        break;
    }
  }

  function stream(executionId: string) {
    eventSource.current?.close();

    const source = new EventSource(`${API_URL}/executor/${executionId}/events`);

    eventSource.current = source;

    source.onmessage = (message) => {
      const event: ExecutionEvent = JSON.parse(message.data);

      onEvent(event);

      if (
        event.type === "EXECUTION_SUCCESS" ||
        event.type === "EXECUTION_ERROR" ||
        event.type === "EXECUTION_CANCELLED"
      ) {
        source.close();
        eventSource.current = null;
      }
    };

    source.onerror = () => {
      onEvent({
        type: "EXECUTION_ERROR",
        output: "Something unexpectedly occcurred while streaming",
      });

      source.close();
      eventSource.current = null;
    };
  }

  const initiateExecution = useMutation({
    mutationKey: QUERY_KEYS.EXECUTOR,
    mutationFn: executeProgram,

    onMutate: () =>
      dispatch({
        type: "RESET",
      }),

    onSuccess: (executionId) => {
      dispatch({
        type: "SET_ID",
        payload: executionId,
      });

      stream(executionId);
    },

    onError: (error) => {
      onEvent({
        type: "EXECUTION_ERROR",
        output: error.message,
      });
    },
  });

  const cancelExecution = useMutation({
    mutationKey: QUERY_KEYS.EXECUTOR,
    mutationFn: cancelProgram,

    onError: (error) => dispatch(updateExecutor("ERROR", error.message)),
  });

  const skipNodeExecution = useMutation({
    mutationKey: QUERY_KEYS.EXECUTOR,
    mutationFn: skipNode,

    onError: (error) => dispatch(updateExecutor("ERROR", error.message)),
  });

  useEffect(() => {
    return () => eventSource.current?.close();
  }, []);

  const values: ExecutorContextValue = useMemo(
    () => ({
      ...initiateExecution,
      cancelExecution,
      skipNodeExecution,
      state,
      dispatch,
    }),
    [initiateExecution, cancelExecution, skipNodeExecution, state],
  );

  return (
    <ExecutorContext.Provider value={values}>
      {children}
    </ExecutorContext.Provider>
  );
}
