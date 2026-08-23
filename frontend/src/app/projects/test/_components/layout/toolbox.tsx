"use client";

import { useEffect } from "react";

import { LucideIcon, MousePointer2, Plus } from "lucide-react";

import { CanvasNode, InitialEditor } from "@/app/projects/test/_providers/editor/config";
import { SETTINGS } from "@/app/projects/test/_components/canvas/config";
import { useEditor } from "@/app/projects/test/_hooks/use-editor";

import { Button } from "@/components/ui/primitives/button";

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
  const editor = useEditor();

  useEffect(() => {
    const handleInsert = (e: KeyboardEvent) => {
      let type: CanvasNode["type"];

      switch (e.key) {
        case "R":
          type = "HTTP_REQUEST";
          break;

        case "T":
          type = "DATABASE";
          break;

        default:
          return;
      }

      if (!validate(type, editor.state.nodes)) return;

      editor.action.createNode("HTTP_REQUEST");
    };

    window.addEventListener("keydown", handleInsert);

    return () => window.removeEventListener("keydown", handleInsert);
  }, [editor.state.nodes]);

  return (
    <div className="absolute bottom-8 left-8 z-60 flex flex-col items-center justify-center gap-y-4">
      {toolboxItems.map((item) => {
        const Icon = item.icon;

        return (
          <Button
            onClick={() => editor.action.selectTool(item.id)}
            key={item.id}
            size="icon"
            aria-label={item.id}
          >
            <Icon size={20} />
            {/* 
            <span
              className={cn(
                "text-ink-soft absolute -right-2 -bottom-1 text-[8px]",
                { "text-accent-ink": state.tool === item.id },
              )}
            >
              {item.keybind}
            </span> */}
          </Button>
        );
      })}
    </div>
  );
}
