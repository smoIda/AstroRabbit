import { useContext } from "react";

import {
  ExecutorContext,
  ExecutorContextValue,
} from "@/app/projects/test/_providers/executor/provider";

export function useExecutor(): ExecutorContextValue {
  const context = useContext(ExecutorContext);

  if (!context) {
    throw new Error("useExecutor must be used inside ExecutorProvider");
  }

  return context;
}
