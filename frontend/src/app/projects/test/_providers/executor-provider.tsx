"use client";

import { useEffect, useRef, useState, createContext, useMemo } from "react";

import { useMutation, UseMutationResult } from "@tanstack/react-query";

import { API_URL, QUERY_KEYS } from "@/hooks/config";

import {
  CancellationRequest,
  CancellationResponse,
  cancelProgram,
  executeProgram,
  ExecutionRequest,
  ExecutionResponse,
} from "@/lib/api/executor";

export const ExecutorContext = createContext<ExecutorContext | null>(null);

export type ExecutorContext = UseMutationResult<
  ExecutionResponse,
  Error,
  ExecutionRequest
> & {
  cancel: UseMutationResult<CancellationResponse, Error, CancellationRequest>;
  executionId: string | null;
  executionStatus: ExecutionStatus;
  nodeStatus: Record<string, NodeStatus>;
  edgeStatus: Record<string, EdgeStatus>;
  streamError: string | null;
};

export type ExecutionStatus = "IDLE" | "RUNNING" | "FINISHED" | "CANCELLED" | "ERROR";
export type NodeStatus = ExecutionStatus;
export type EdgeStatus = Omit<ExecutionStatus, "CANCELLED" | "ERROR">;

type ExecutionEvent = {
  type:
    | "EXECUTION_STARTED"
    | "EXECUTION_FINISHED"
    | "EXECUTION_CANCELLED"
    | "EXECUTION_ERROR"
    | "NODE_STARTED"
    | "NODE_CANCELLED"
    | "NODE_FINISHED"
    | "NODE_ERROR"
    | "EDGE_STARTED"
    | "EDGE_FINISHED";
  nodeId?: string;
  edgeId?: string;
  duration?: number;
  data?: Record<string, unknown>;
};

export function ExecutorProvider({ children }: { children: React.ReactNode }) {
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [executionStatus, setExecutionStatus] =
    useState<ExecutionStatus>("IDLE");
  const [nodeStatus, setNodeStatus] = useState<Record<string, NodeStatus>>({});
  const [edgeStatus, setEdgeStatus] = useState<Record<string, EdgeStatus>>({});
  const [streamError, setStreamError] = useState<string | null>(null);

  const eventSource = useRef<EventSource | null>(null);

  function handle(event: ExecutionEvent) {
    switch (event.type) {
      case "EXECUTION_STARTED":
        setExecutionStatus("RUNNING");
        break;

      case "EXECUTION_FINISHED":
        setExecutionStatus("FINISHED");
        break;

      case "EXECUTION_CANCELLED":
        setExecutionStatus("CANCELLED");
        break;

      case "EXECUTION_ERROR":
        setExecutionStatus("ERROR");
        setStreamError(String(event.data ?? "Execution failed"));
        break;

      case "NODE_STARTED":
        if (event.nodeId) {
          setNodeStatus((prev) => ({
            ...prev,
            [event.nodeId!]: "RUNNING",
          }));
        }
        break;

      case "NODE_CANCELLED":
        if (event.nodeId) {
          setNodeStatus((prev) => ({
            ...prev,
            [event.nodeId!]: "CANCELLED",
          }));
        }
        break;

      case "NODE_FINISHED":
        if (event.nodeId) {
          setNodeStatus((prev) => ({
            ...prev,
            [event.nodeId!]: "FINISHED",
          }));
        }
        break;

      case "NODE_ERROR":
        if (event.nodeId) {
          setNodeStatus((prev) => ({
            ...prev,
            [event.nodeId!]: "ERROR",
          }));
        }
        break;

      case "EDGE_STARTED":
        if (event.edgeId) {
          setEdgeStatus((prev) => ({
            ...prev,
            [event.edgeId!]: "RUNNING",
          }));
        }
        break;

      case "EDGE_FINISHED":
        if (event.edgeId) {
          setEdgeStatus((prev) => ({
            ...prev,
            [event.edgeId!]: "FINISHED",
          }));
        }
        break;
    }
  }

  function stream(executionId: string) {
    eventSource.current?.close();

    const source = new EventSource(`${API_URL}/executor/${executionId}/events`);

    eventSource.current = source;

    source.onmessage = (message) => {
      const event: ExecutionEvent = JSON.parse(message.data);

      handle(event);

      // console.log(event.duration ?? 0);

      if (
        event.type === "EXECUTION_FINISHED" ||
        event.type === "EXECUTION_ERROR" ||
        event.type === "EXECUTION_CANCELLED"
      ) {
        source.close();
        eventSource.current = null;
      }
    };

    source.onerror = () => {
      setExecutionStatus("ERROR");
      setStreamError("Execution stream disconnected");

      source.close();
      eventSource.current = null;
    };
  }

  const execute = useMutation({
    mutationKey: QUERY_KEYS.EXECUTOR,
    mutationFn: executeProgram,

    onMutate: () => {
      setExecutionId(null);
      setExecutionStatus("IDLE");
      setStreamError(null);
      setNodeStatus({});
      setEdgeStatus({});
    },

    onSuccess: ({ executionId }) => {
      setExecutionId(executionId);
      stream(executionId);
    },

    onError: (error) => {
      setExecutionStatus("ERROR");
      setStreamError(error.message);
    },
  });

  const cancel = useMutation({
    mutationKey: QUERY_KEYS.EXECUTOR,
    mutationFn: cancelProgram,

    onError: (error) => setStreamError(error.message),
  });

  useEffect(() => {
    return () => eventSource.current?.close();
  }, []);

  const values: ExecutorContext = useMemo(
    () => ({
      ...execute,
      cancel,
      executionId,
      executionStatus,
      nodeStatus,
      edgeStatus,
      streamError,
    }),
    [
      execute,
      cancel,
      executionId,
      executionStatus,
      nodeStatus,
      edgeStatus,
      streamError,
    ],
  );

  return (
    <ExecutorContext.Provider value={values}>
      {children}
    </ExecutorContext.Provider>
  );
}
