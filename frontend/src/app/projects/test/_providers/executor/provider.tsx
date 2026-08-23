"use client";

import { createContext, useCallback, useEffect, useMemo, useReducer } from "react";

import { useMutation } from "@tanstack/react-query";

import { useStream } from "@/app/projects/test/_hooks/use-stream";
import { useEditor } from "@/app/projects/test/_hooks/use-editor";
import {
  ActionExecutor,
  ExecutionStatus,
  InitialExecutor,
} from "@/app/projects/test/_providers/executor/config";
import { actionExecutor, initialExecutor } from "@/app/projects/test/_providers/executor/reducer";

import { QUERY_KEYS } from "@/hooks/config";

import { cancelProgram, executeProgram, skipNode } from "@/lib/api/executor";

export type ExecutorContextValue = {
  run: (startAt: string) => void;
  cancel: (nodeId: string) => void;
  skip: (nodeId: string) => void;
  state: InitialExecutor;
  action: ReturnType<typeof ExecutorDispatch>;
};

export const ExecutorContext = createContext<ExecutorContextValue | null>(null);

function ExecutorDispatch(dispatch: React.Dispatch<ActionExecutor>) {
  return {
    reset: () => dispatch({ type: "RESET" }),

    setId: (executionId: string) => dispatch({ type: "SET_ID", payload: executionId }),

    setExecutor: (status: ExecutionStatus, error?: string) =>
      dispatch({ type: "SET_EXECUTOR", payload: { status, error } }),
  };
}

export function ExecutorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(actionExecutor, initialExecutor);

  const editor = useEditor();

  const action = useMemo(() => ExecutorDispatch(dispatch), [dispatch]);

  const { stream, closeStream } = useStream(action, editor.action);

  const runMutation = useMutation({
    mutationKey: QUERY_KEYS.EXECUTOR,
    mutationFn: executeProgram,

    onMutate: () => action.reset(),
    onSuccess: (executionId) => {
      action.setId(executionId);
      stream(executionId);
    },
    onError: (error) => action.setExecutor("ERROR", error.message),
  });

  const run = useCallback(
    (startAt: string) => {
      const nodes = editor.state.nodes.filter(
        (node) =>
          node.id === startAt ||
          editor.state.edges.some((edge) => edge.source === node.id || edge.target === node.id),
      );

      runMutation.mutate({ nodes, edges: editor.state.edges, startAt });
    },
    [editor.state.nodes, editor.state.edges, runMutation.mutate],
  );

  const cancelMutation = useMutation({
    mutationKey: QUERY_KEYS.EXECUTOR,
    mutationFn: cancelProgram,

    onError: (error) => action.setExecutor("ERROR", error.message),
  });

  const cancel = useCallback(() => {
    if (!state.id)
      return action.setExecutor(
        "ERROR",
        "The specified ID for executor not found - Unable to cancel",
      );

    cancelMutation.mutate(state.id);
  }, [state.id, cancelMutation.mutate, action.setExecutor]);

  const skipMutation = useMutation({
    mutationKey: QUERY_KEYS.EXECUTOR,
    mutationFn: skipNode,

    onError: (error) => action.setExecutor("ERROR", error.message),
  });

  const skip = useCallback(
    (nodeId: string) => {
      if (!nodeId || !state.id) return;

      skipMutation.mutate({ executionId: state.id, nodeId });
    },
    [state.id, skipMutation.mutate],
  );

  useEffect(() => closeStream, [closeStream]);

  const values: ExecutorContextValue = useMemo(
    () => ({
      run,
      cancel,
      skip,
      state,
      action,
    }),
    [run, cancel, skip, state, action],
  );

  return <ExecutorContext.Provider value={values}>{children}</ExecutorContext.Provider>;
}
