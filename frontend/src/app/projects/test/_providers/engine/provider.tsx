"use client";

import { useCallback, useEffect, createContext, useMemo } from "react";

import { useMutation } from "@tanstack/react-query";

import { useEditorAction, useEditorState } from "@/app/projects/test/_hooks/use-editor";
import { useExecutor } from "@/app/projects/test/_hooks/use-executor";
import { useStream } from "@/app/projects/test/_providers/engine/use-stream";

import { QUERY_KEYS } from "@/hooks/config";

import { abortProgram, executeProgram, skipNode } from "@/lib/api/executor";

export type EngineContextValue = {
  execution: {
    execute: (startAt: string) => void;
    abort: () => void;
  };

  node: {
    skip: (nodeId: string) => void;
  };
};

export const EngineContext = createContext<EngineContextValue | null>(null);

export function EngineProvider({ children }: { children: React.ReactNode }) {
  const { state: editorState } = useEditorState();
  const { action: editorAction } = useEditorAction();

  const { state: executorState, action: executorAction } = useExecutor();

  const stream = useStream(executorAction, editorAction);

  const executeMutation = useMutation({
    mutationKey: [...QUERY_KEYS.EXECUTOR, "execute"],
    mutationFn: executeProgram,

    onMutate: () => {
      editorAction.reset();
      executorAction.reset();
    },
    onSuccess: (executionId) => {
      executorAction.setId(executionId);
      stream.subscribe(executionId);
    },
    onError: (error) => executorAction.patchExecutor("ERROR", error.message),
  });

  const execute = useCallback(
    (startAt: string) => {
      const nodes = editorState.nodes.filter(
        (node) =>
          node.id === startAt ||
          editorState.edges.some((edge) => edge.source === node.id || edge.target === node.id),
      );

      const validNodeIds = new Set(nodes.map((node) => node.id));

      const edges = editorState.edges.filter(
        (edge) => validNodeIds.has(edge.source) && validNodeIds.has(edge.target),
      );

      executeMutation.mutate({ nodes, edges, startAt });
    },
    [editorState.nodes, editorState.edges, executeMutation.mutate],
  );

  const abortMutation = useMutation({
    mutationKey: [...QUERY_KEYS.EXECUTOR, "abort"],
    mutationFn: abortProgram,

    onError: (error) => executorAction.patchExecutor("ERROR", error.message),
  });

  const abort = useCallback(() => {
    if (!executorState.id)
      return executorAction.patchExecutor(
        "ERROR",
        "The specified ID for executor not found - Unable to abort",
      );

    abortMutation.mutate(executorState.id);
  }, [executorState.id, abortMutation.mutate, executorAction.patchExecutor]);

  const skipMutation = useMutation({
    mutationKey: [...QUERY_KEYS.EXECUTOR, "skip"],
    mutationFn: skipNode,

    onError: (error) => executorAction.patchExecutor("ERROR", error.message),
  });

  const skip = useCallback(
    (nodeId: string) => {
      if (!nodeId || !executorState.id) return;

      skipMutation.mutate({ executionId: executorState.id, nodeId });
    },
    [executorState.id, skipMutation.mutate],
  );

  useEffect(() => stream.close, [stream.close]);

  const values: EngineContextValue = useMemo(
    () => ({ execution: { execute, abort }, node: { skip } }),
    [execute, abort, skip],
  );

  return <EngineContext.Provider value={values}>{children}</EngineContext.Provider>;
}
