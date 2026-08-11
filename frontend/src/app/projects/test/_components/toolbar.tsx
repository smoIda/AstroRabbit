"use client";

import { LucideIcon, Play, Redo, Square, Undo } from "lucide-react";

import { useEditor } from "@/app/projects/test/_hooks/use-editor";
import { useExecutor } from "@/app/projects/test/_hooks/use-executor";

import { Button } from "@/components/ui/primitives/button";

import { ExecutionRequest } from "@/lib/api/executor";

const toolboxItems: ToolbarItemProps[] = [
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

export type ToolbarItemProps = {
  id: "RUN" | "REDO" | "UNDO";
  icon: LucideIcon;
  keybind: "V" | "CTRL+Y" | "CTRL+Z";
};

export default function Toolbar() {
  const { mutate, cancel, executionId, executionStatus } = useExecutor();
  const { state, dispatch } = useEditor();

  const execute = () => {
    const request: ExecutionRequest = {
      nodes: state.nodes,
      edges: state.edges,
      startAt: "1",
    };

    console.log(request)
    mutate(request);
  };

  const stop = () => {
    if (!executionId) return;

    cancel.mutate({ executionId });
  };

  return (
    <div className="absolute top-8 right-8 z-60 flex flex-row-reverse items-center justify-center gap-x-4">
      {toolboxItems.map((item) => {
        const Icon = executionStatus !== "RUNNING" ? item.icon : Square;

        return (
          <Button
            onClick={executionStatus === "RUNNING" ? stop : execute}
            key={item.id}
            size="icon"
            aria-label={item.id}
            className={`${executionStatus === "RUNNING" && "text-accent-ink"}`}
          >
            <Icon size={20} />
          </Button>
        );
      })}
    </div>
  );
}
