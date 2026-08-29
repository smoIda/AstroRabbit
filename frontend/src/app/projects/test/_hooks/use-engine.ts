import { useContext } from "react";

import { EngineContext, EngineContextValue } from "@/app/projects/test/_providers/engine/provider";

export function useEngine(): EngineContextValue {
  const context = useContext(EngineContext);

  if (!context) {
    throw new Error("useEngine must be used inside EngineProvider");
  }

  return context;
}
