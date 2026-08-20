"use client";

import { useEffect } from "react";

import { Database, Globe, LucideIcon, MousePointer2, Plus } from "lucide-react";

import { CanvasNode } from "@/app/projects/test/_providers/editor/config";
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

export type CreateNode<T> = T extends CanvasNode ? Omit<T, "id"> : never;

export function Toolbox() {
  const { state, dispatch } = useEditor();

  useEffect(() => {
    const handleInsert = (e: KeyboardEvent) => {
      try {
        if (e.key === "E")
          dispatch({
            type: "CREATE_NODE",
            payload: {
              type: "HTTP_REQUEST",
              position: {
                x: 100,
                y: 100,
              },
              data: {
                label: "High Risk Customers",
                icon: Globe,
                provider: "CUSTOM_API",
                badge: [],

                config: {
                  headers: {
                    "Content-type": "application/json",
                  },
                  method: "GET",
                  body: "Hello world from hee hee hahahahahahahahaha",
                  url: "https://httpbingo.org/get",
                },

                runtime: {
                  status: "IDLE",
                  duration: 0,
                },

                output: {
                  statusCode: 0,
                  headers: {},
                  body: "Hello from X Y Z",
                },
              },
            },
          });
        else if (e.key === "F")
          dispatch({
            type: "CREATE_NODE",
            payload: {
              type: "DATABASE",
              position: {
                x: 10,
                y: 10,
              },
              data: {
                label: "/users",
                icon: Database,
                badge: [],

                config: {
                  database: "MongoDB",
                },

                runtime: {
                  status: "IDLE",
                  duration: 0,
                },

                output: {
                  body: "Yo",
                },
              },
            },
          });
      } catch (error) {
        console.log(error);
      }
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
