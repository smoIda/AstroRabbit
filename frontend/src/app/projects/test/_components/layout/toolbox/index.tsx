"use client";

import { useEffect, useState } from "react";

import { LucideIcon, MousePointer2, Plus } from "lucide-react";

import { CanvasNode, InitialEditor } from "@/app/projects/test/_providers/editor/config";
import { SETTINGS } from "@/app/projects/test/_components/canvas/config";
import { useEditorAction, useEditorState } from "@/app/projects/test/_hooks/use-editor";

import { Button } from "@/components/ui/primitives/button";
import { cn } from "@/lib/utils/cn";

const toolboxItems: ToolboxItem[] = [
  {
    id: "SELECT",
    icon: MousePointer2,
    keybind: "V",
  },

  {
    id: "INSERT",
    icon: Plus,
    keybind: "V",
  },

  {
    id: "IDK",
    icon: Plus,
    keybind: "V",
  },
] as const;

export type ToolboxItem = {
  id: "SELECT" | "INSERT" | "IDK";
  icon: LucideIcon;
  keybind: "V";
};

function validate(type: CanvasNode["type"], nodes: InitialEditor["nodes"]) {
  const count = nodes.filter((node) => node.type === type).length;

  if (count >= SETTINGS[type].maxInstances) return false;

  return true;
}

// Unprovable typescript issue but the correlation is real omfg

export function Toolbox() {
  const { state: editorState } = useEditorState();
  const { action: editorAction } = useEditorAction();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleInsert = (e: KeyboardEvent) => {
      let type: CanvasNode["type"];

      switch (e.key) {
        case "E":
          type = "HTTP_REQUEST";
          break;

        case "R":
          type = "DATABASE";
          break;

        default:
          return;
      }

      if (!validate(type, editorState.nodes)) return;

      editorAction.createNode(type);
    };

    window.addEventListener("keydown", handleInsert);

    return () => window.removeEventListener("keydown", handleInsert);
  }, [editorState.nodes]);

  return (
    <aside
      className={cn(
        "grid grid-cols-[0fr] transition-[grid-template-columns] duration-200",
        isOpen && "grid-cols-[1fr]",
      )}
    >
      <div className="overflow-hidden">
        <div className="mt-4 ml-4 h-[calc(100%-30px)] w-80 border-2 bg-white">
          {/* Content goes here */}
        </div>
      </div>
    </aside>
  );
}
