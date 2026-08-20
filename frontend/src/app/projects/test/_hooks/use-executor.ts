import { useContext } from "react";

import { ExecutorContext } from "@/app/projects/test/_providers/executor/provider";
import { ExecutorContextValue } from "@/app/projects/test/_providers/executor/config";

export function useExecutor(): ExecutorContextValue {
  const context = useContext(ExecutorContext);

  if (!context) {
    throw new Error("useExecutor must be used inside ExecutorProvider");
  }

  return context;
}
