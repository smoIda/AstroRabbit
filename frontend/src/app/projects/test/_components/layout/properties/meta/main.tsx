import { Clock } from "lucide-react";

import { NodeData } from "@/app/projects/test/_providers/editor/config";
import { Title } from "@/app/projects/test/_components/layout/properties/misc";
import { formatDuration } from "@/app/projects/test/_components/canvas/nodes/base/utils";
import { STATUS_ICONS } from "@/app/projects/test/_components/canvas/nodes/base/config";

import { Badge } from "@/components/ui/primitives/badge";

import { cn } from "@/lib/utils/cn";

type PropertiesMeta = {
  nodeId: string;
  runtime: NodeData["runtime"];
};

export function PropertiesMeta({ nodeId, runtime }: PropertiesMeta) {
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

          <Icon
            size={16}
            className={cn(
              runtime.status === "RUNNING" && "animate-spin",
              STATUS_ICONS[runtime.status].color,
            )}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Title label="DURATION" />

        <div className="flex items-center gap-2">
          <span>{formatDuration(runtime.duration)}</span>

          <Clock size={16} className="text-ink/40" />
        </div>
      </div>
    </div>
  );
}
