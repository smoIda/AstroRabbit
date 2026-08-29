"use client";

import { LucideIcon, Play, Redo, Square, Undo } from "lucide-react"

import { Button } from "@/components/ui/primitives/button";

import { useEngine } from "@/app/projects/test/_hooks/use-engine";

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
  const engine = useEngine();

  return (
    <div className="absolute top-8 right-8 z-60 flex items-center justify-center gap-x-4">
      <Button size="icon" aria-label="BOOM">
        <Undo size={20} />
      </Button>

      <Button size="icon" aria-label="YO">
        <Redo size={20} />
      </Button>

      <Button onClick={() => engine.execution.abort()} size="icon" aria-label="w">
        <Square size={20} />
      </Button>
    </div>
  );
}
