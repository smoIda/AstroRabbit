"use client";

import { useEffect } from "react";

import { Globe, LucideIcon, MousePointer2, Plus } from "lucide-react";

import { useEditor } from "@/app/projects/test/_hooks/use-editor";

import { Button } from "@/components/ui/primitives/button";

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

export type ToolboxItemProps = {
  id: "SELECT" | "INSERT" | "IDK";
  icon: LucideIcon;
  keybind: "V";
};

export type CreateNodeProps<T> = T extends unknown ? Omit<T, "id"> : never;

export default function Toolbox() {
  const { state, dispatch } = useEditor();

  useEffect(() => {
    const handleInsert = (e: KeyboardEvent) => {
      if (e.key === "E")
        dispatch({
          type: "CREATE_NODE",
          payload: {
            type: "HTTP_REQUEST",
            position: {
              x: 10,
              y: 10,
            },
            data: {
              label: "User",
              icon: Globe,
              duration: 0,
              method: "GET",
              endpoint: "/getdata",
            },
          },
        });
    };

    window.addEventListener("keydown", handleInsert);

    return () => window.removeEventListener("keydown", handleInsert);
  }, []);

  return (
    <div className="absolute bottom-8 left-8 z-60 flex flex-col items-center justify-center gap-y-4">
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
    </div>
  );
}
