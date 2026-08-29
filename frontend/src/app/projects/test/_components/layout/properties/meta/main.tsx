import { Clock, Trash2 } from "lucide-react";

import { NodeData } from "@/app/projects/test/_providers/editor/config";
import { Title } from "@/app/projects/test/_components/layout/properties/misc";
import { formatDuration } from "@/app/projects/test/_components/canvas/nodes/base/utils";
import { EditorActionContextValue } from "@/app/projects/test/_providers/editor/provider";
import { Badge } from "@/components/ui/primitives/badge";
import { STATUS_ICONS } from "@/app/projects/test/_components/canvas/nodes/base/config";

import { Button } from "@/components/ui/primitives/button";

import { cn } from "@/lib/utils/cn";

type PropertiesMeta = {
  nodeId: string;
  runtime: NodeData["runtime"];
  onDelete: (nodeId: string) => void;
};

export function PropertiesMeta({ nodeId, runtime, onDelete }: PropertiesMeta) {
  const Icon = STATUS_ICONS[runtime.status].icon;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Title label="STATUS" />

        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              "border-0",
              STATUS_ICONS[runtime.status].bg,
              STATUS_ICONS[runtime.status].color,
            )}
            size="lg"
          >
            {runtime.status}
          </Badge>

          <Icon size={16} className={`${runtime.status === "RUNNING" && "animate-spin"}`} />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Title label="DURATION" />

        <div className="flex items-center gap-2">
          <span>{formatDuration(runtime.duration)}</span>

          <Clock size={16} className="text-ink-soft/60" />
        </div>
      </div>

      <Button
        onClick={() => onDelete(nodeId)}
        variant="no-brackets"
        size="sm"
        className="border-accent-ink text-accent-ink hover:bg-accent-ink/10 mt-8 w-full gap-x-2 border border-dashed py-2 font-medium transition-colors duration-200"
      >
        <Trash2 size={16} />
        <span>DELETE NODE</span>
      </Button>
    </div>
  );
}
