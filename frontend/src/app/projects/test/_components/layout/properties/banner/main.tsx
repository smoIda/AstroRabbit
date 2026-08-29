import { FastForward, LucideIcon, Play } from "lucide-react";

import { CanvasNode } from "@/app/projects/test/_providers/editor/config";
import { EngineContextValue } from "@/app/projects/test/_providers/engine/provider";

import { Diamond } from "@/components/ui/decorations/diamond";
import { Button } from "@/components/ui/primitives/button";

type PropertiesBanner = {
  nodeId: string;
  type: CanvasNode["type"];
  icon: LucideIcon;
  label: string;
  onExecute: (startAt: string) => void;
  onNodeSkip: (nodeId: string) => void;
};

export function PropertiesBanner({
  nodeId,
  type,
  icon: NodeIcon,
  label,
  onExecute,
  onNodeSkip,
}: PropertiesBanner) {
  const ACTIONS = {
    RUN: {
      icon: Play,
      fn: onExecute,
    },

    SKIP: {
      icon: FastForward,
      fn: onNodeSkip,
    },
  };

  return (
    <div className="border-ink/10 flex items-center justify-between gap-x-4 border-b-2 border-dashed px-6 py-4">
      <div className="flex items-center gap-x-4">
        <div className="relative flex size-8 shrink-0 items-center justify-center">
          <Diamond variant="filled" className="bg-ink/5 absolute inset-0 size-8" />

          <NodeIcon className="text-ink relative z-10 size-5" />
        </div>

        <div>
          <span className="text-ink truncate font-semibold">{label}</span>

          <p className="text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
            {type}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-x-2">
        {Object.entries(ACTIONS).map(([key, value]) => {
          const Icon = value.icon;

          return (
            <Button
              key={key}
              aria-label={key}
              size="icon"
              onClick={() => value.fn(nodeId)}
              className="flex font-semibold"
            >
              <Icon size={20} className="fill-current" />
            </Button>
          );
        })}
      </div>
    </div>
  );
}
