"use client";

import { LucideIcon, Play, Redo, Undo } from "lucide-react";

import { useEditor } from "@/app/projects/test/_hooks/use-editor";

import { Button } from "@/components/ui/primitives/button";
import { executeProgram } from "@/app/projects/test/_engine/executor";

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
] as const;

export type ToolbarItemProps = {
  id: "RUN" | "REDO" | "UNDO";
  icon: LucideIcon;
  keybind: "V" | "CTRL+Y" | "CTRL+Z";
};

export default function Toolbar() {
  const { state, dispatch } = useEditor();

  async function handleExecute() {
    try {
      const result = await executeProgram(state.nodes, state.edges);

      alert(JSON.stringify(result, null, 2));
    } catch (err) {
      alert("err");
    }
  }

  return (
    <div className="absolute top-8 right-8 z-60 flex flex-row-reverse items-center justify-center gap-x-4">
      {toolboxItems.map((item) => {
        const Icon = item.icon;

        return (
          <Button
            onClick={handleExecute}
            key={item.id}
            size="icon"
            aria-label={item.id}
          >
            <Icon size={20} />
          </Button>
        );
      })}
    </div>
  );
}
