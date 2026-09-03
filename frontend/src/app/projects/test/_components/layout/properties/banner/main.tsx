import { FastForward, LucideIcon, PencilLine, Play, Trash2, X } from "lucide-react";

import { CanvasNode } from "@/app/projects/test/_providers/editor/config";
import { ExecutionStatus } from "@/app/projects/test/_providers/executor/config";

import { Diamond } from "@/components/ui/decorations/diamond";
import { Button } from "@/components/ui/primitives/button";
import { Badge } from "@/components/ui/primitives/badge";

import { formatText } from "@/lib/utils/formatText";
import { cn } from "@/lib/utils/cn";

type PropertiesBanner = {
  nodeId: string;
  type: CanvasNode["type"];
  icon: LucideIcon;
  label: string;
  executorStatus: ExecutionStatus;
  onClose: () => void;
  onExecute: (startAt: string) => void;
  onNodeSkip: (nodeId: string) => void;
  onDelete: (nodeId: string) => void;
};

export function PropertiesBanner({
  nodeId,
  type,
  icon: NodeIcon,
  label,
  executorStatus,
  onClose,
  onExecute,
  onNodeSkip,
  onDelete,
}: PropertiesBanner) {
  const ACTIONS = {
    EXECUTE: {
      icon: Play,
      color: "text-accent-ink hover:text-accent-ink/60 active:text-accent-ink/60",
      disabled: executorStatus === "RUNNING",
      fn: onExecute,
    },

    SKIP: {
      icon: FastForward,
      color: "text-warning-ink hover:text-warning-ink/60 active:text-warning-ink/60",
      disabled: executorStatus !== "RUNNING",
      fn: onNodeSkip,
    },

    DELETE: {
      icon: Trash2,
      color: "",
      disabled: executorStatus === "RUNNING",
      fn: onDelete,
    },
  } as const;

  return (
    <div className="flex flex-col items-center">
      <div className="border-ink/10 flex w-full items-center gap-x-4 border-b-2 border-dashed px-6 py-4">
        <div className="relative flex size-8 shrink-0 items-center justify-center">
          <Diamond variant="filled" className="bg-ink/5 absolute inset-0 size-8" />

          <NodeIcon className="text-ink relative z-10 size-5" />
        </div>

        <div className="flex w-full min-w-0 flex-col items-start">
          <div className="flex items-center gap-x-2">
            <Button aria-label="Rename node" size="icon" flush>
              <PencilLine size={16} />
            </Button>

            <span className="text-ink w-full truncate text-lg font-semibold">{label}</span>
          </div>

          <Badge size="md" color="accent-soft">
            {formatText(type)}
          </Badge>
        </div>

        <Button
          className="active:scale-90"
          aria-label="Close panel"
          variant="destructive"
          size="icon"
          flush
          onClick={onClose}
        >
          <X size={24} />
        </Button>
      </div>

      <div className="border-ink/10 flex w-full items-center gap-x-6 border-b-2 border-dashed px-4 py-2">
        {Object.entries(ACTIONS).map(([k, v]) => {
          const Icon = v.icon;
          const isDestructive = k === "DELETE";

          return (
            <Button
              key={k}
              size="md"
              variant={isDestructive ? "destructive" : "normal"}
              flush
              disabled={v.disabled}
              onClick={() => v.fn(nodeId)}
              className={cn(
                "gap-x-2 font-medium tracking-wider uppercase transition-colors",
                isDestructive && "ml-auto",
                v.color,
              )}
            >
              <Icon size={14} className="shrink-0" />

              <span>{k}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
