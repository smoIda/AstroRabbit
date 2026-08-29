import { useContext } from "react";

import {
  EditorActionContext,
  EditorActionContextValue,
  EditorStateContext,
  EditorStateContextValue,
} from "@/app/projects/test/_providers/editor/provider";

export function useEditorState(): EditorStateContextValue {
  const context = useContext(EditorStateContext);

  if (!context) throw new Error("useEditorState must be inside EditorProvider");

  return context;
}

export function useEditorAction(): EditorActionContextValue {
  const context = useContext(EditorActionContext);

  if (!context) throw new Error("useEditorAction must be inside EditorProvider");

  return context;
}
