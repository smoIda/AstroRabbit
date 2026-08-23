import { useContext } from "react";

import {
  EditorContext,
  EditorContextValue,
} from "@/app/projects/test/_providers/editor/provider";

export function useEditor(): EditorContextValue {
  const context = useContext(EditorContext);

  if (!context) throw new Error("useEditor must be inside EditorProvider");

  return context;
}
