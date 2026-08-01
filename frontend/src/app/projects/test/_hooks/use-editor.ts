import { useContext } from "react";

import {
  EditorContext,
  EditorContextProps,
} from "@/app/projects/test/_providers/editor-providers";

export function useEditor(): EditorContextProps {
  const context = useContext(EditorContext);

  if (!context) throw new Error("useEditor must be inside EditorProvider");

  return context;
}
