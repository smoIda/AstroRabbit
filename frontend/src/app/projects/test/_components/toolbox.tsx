"use client";

import { MousePointer2, Plus } from "lucide-react";

import { ToolboxItemProps } from "@/app/projects/test/_providers/editor-providers";
import { useEditor } from "@/app/projects/test/_hooks/use-editor";

import { Button } from "@/components/ui/primitives/button";
import { cn } from "@/lib/utils/cn";

const toolboxItems: ToolboxItemProps[] = [
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

export default function Toolbox() {
  const { state, dispatch } = useEditor();

  return (
    <aside className="absolute top-8 left-1/2 z-60 flex -translate-x-1/2 items-center justify-center gap-x-4">
      {toolboxItems.map((item) => {
        const Icon = item.icon;

        return (
          <Button
            onClick={() => dispatch({ type: "SELECT_TOOL", payload: item.id })}
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
    </aside>
  );
}
