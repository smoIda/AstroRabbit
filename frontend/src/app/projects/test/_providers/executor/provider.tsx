"use client";

import { createContext, useMemo, useReducer } from "react";

import {
  ActionExecutor,
  ExecutionStatus,
  InitialExecutor,
} from "@/app/projects/test/_providers/executor/config";
import { actionExecutor, initialExecutor } from "@/app/projects/test/_providers/executor/reducer";

export type ExecutorContextValue = {
  state: InitialExecutor;
  action: ReturnType<typeof actions>;
};

export const ExecutorContext = createContext<ExecutorContextValue | null>(null);

function actions(dispatch: React.Dispatch<ActionExecutor>) {
  return {
    reset: () => dispatch({ type: "RESET" }),

    setId: (executionId: string) => dispatch({ type: "SET_ID", payload: executionId }),

    patchExecutor: (status: ExecutionStatus, error?: string) =>
      dispatch({ type: "PATCH_EXECUTOR", payload: { status, error } }),
  };
}

export function ExecutorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(actionExecutor, initialExecutor);

  const action = useMemo(() => actions(dispatch), [dispatch]);

  const values: ExecutorContextValue = useMemo(
    () => ({
      state,
      action,
    }),
    [state, action],
  );

  return <ExecutorContext.Provider value={values}>{children}</ExecutorContext.Provider>;
}
