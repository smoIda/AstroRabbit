"use client";

import { LucideIcon, Play, Redo, Square, Undo } from "lucide-react";

import { useReactFlow } from "@xyflow/react";

import { useEditor } from "@/app/projects/test/_hooks/use-editor";
import { useExecutor } from "@/app/projects/test/_hooks/use-executor";

import { Button } from "@/components/ui/primitives/button";

import { ExecutionRequest } from "@/lib/api/executor";

const toolboxItems: ToolbarItem[] = [
  {
    id: "RUN",
    icon: Play,
    keybind: "V",
  },
  {
    id: "REDO",
    icon: Redo,
    keybind: "CTRL+Y",
  },
  {
    id: "UNDO",
    icon: Undo,
    keybind: "CTRL+Z",
  },
];

export type ToolbarItem = {
  id: "RUN" | "REDO" | "UNDO";
  icon: LucideIcon;
  keybind: "V" | "CTRL+Y" | "CTRL+Z";
};

export function Header() {
  const { run, cancel, state: executorState } = useExecutor();

  const { state: editorState } = useEditor();

  const { getNode } = useReactFlow();

  const stop = () => {
    const executionId = executorState.id;

    if (!executionId) return;

    cancel(executionId);
  };

  const status = executorState.status;

  return (
    <div className="absolute top-8 right-8 z-60 flex items-center justify-center gap-x-4">
      <Button size="icon" aria-label="BOOM">
        <Undo size={20} />
      </Button>

      <Button size="icon" aria-label="YO">
        <Redo size={20} />
      </Button>

      <Button size="icon" aria-label="w">
        {status === "RUNNING" ? <Square size={20} /> : <Play size={20} />}
      </Button>
    </div>
  );
}
