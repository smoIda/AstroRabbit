import { useContext } from "react";

import { EditorContext } from "@/app/projects/test/_providers/editor/provider";
import { EditorContextValue } from "@/app/projects/test/_providers/editor/config";

export function useEditor(): EditorContextValue {
  const context = useContext(EditorContext);

  if (!context) throw new Error("useEditor must be inside EditorProvider");

  return context;
}
