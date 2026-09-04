import { useCallback, useRef, useState } from "react";

import { useConnection, useStore } from "@xyflow/react";

import { Clock, PlusSquare } from "lucide-react";

import {
  STATUS_ICONS,
  type BaseNode,
} from "@/app/projects/test/_components/canvas/nodes/base/config";
import { BaseHandle } from "@/app/projects/test/_components/canvas/nodes/base/handle";
import {
  formatDuration,
  getVisibleConfigs,
} from "@/app/projects/test/_components/canvas/nodes/base/utils";
import { NodeLabel } from "@/app/projects/test/_components/canvas/nodes/base/label";
import { useEditorAction } from "@/app/projects/test/_hooks/use-editor";
import { toJSON, toString } from "@/app/projects/test/_components/layout/properties/utils";

import { Diamond } from "@/components/ui/decorations/diamond";
import { Shadow } from "@/components/ui/decorations/shadow";
import { Bracket } from "@/components/ui/decorations/bracket";
import { Badge } from "@/components/ui/primitives/badge";
import { Button } from "@/components/ui/primitives/button";

import { cn } from "@/lib/utils/cn";
import { formatText } from "@/lib/utils/formatText";

export function BaseNode({ id, type, data, selected, className, handles, configIcons }: BaseNode) {
  const [isRenaming, setIsRenaming] = useState(false);

  const NodeIcon = data.icon;
  const StatusIcon = STATUS_ICONS[data.runtime.status].icon;

  const { action: editorAction } = useEditorAction();

  const selectedCount = useStore((s) => s.nodes.filter((node) => node.selected).length);

  const connection = useConnection(); // Detects edges dragging

  const delayRef = useRef<NodeJS.Timeout | null>(null);

  const onLabelChange = useCallback(
    (newLabel: string) => {
      if (delayRef.current) clearTimeout(delayRef.current);

      delayRef.current = setTimeout(() => editorAction.patchNodeBranding(id, newLabel), 500);
    },
    [id, editorAction],
  );

  return (
    <>
      <div
        className={cn(
          "group relative flex w-80 flex-col border-2 bg-white",
          selectedCount > 0 && !selected && "border-ink/40 *:opacity-40",
          className,
        )}
      >
        <Bracket className="bg-accent-ink top-0.5 right-0.5 size-8" position="top-right" />

        <div className="flex w-full items-center gap-x-4 px-4 py-2">
          <div className="relative flex size-8 shrink-0 items-center justify-center">
            <Diamond variant="filled" className="bg-ink/5 absolute inset-0 size-8" />

            <NodeIcon className="text-ink relative z-10 size-5" />
          </div>

          <div className="flex w-full min-w-0 flex-col">
            <NodeLabel
              label={data.label}
              isRenaming={isRenaming}
              onRenamingChange={setIsRenaming}
              onChange={onLabelChange}
            />

            <div
              onWheel={(e) => {
                const el = e.currentTarget;

                if (el.scrollWidth > el.clientWidth) {
                  e.stopPropagation();

                  if (e.deltaY !== 0) {
                    el.scrollLeft += e.deltaY;
                  }
                }
              }}
              className="nowheel flex w-full scrollbar-none items-center gap-x-2 overflow-x-auto"
            >
              <Badge color="accent">{formatText(type)}</Badge>

              {data.badge.length > 0 &&
                data.badge.map((badge) => {
                  return (
                    <Badge
                      key={`${id}-badge`}
                      title={badge}
                      className="group-hover/badge:opacity-30"
                      color="accent"
                    >
                      {badge}
                    </Badge>
                  );
                })}

              <Button
                aria-label="Add badge"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                size="icon"
                className="nodrag nopan p-0"
              >
                <PlusSquare size={16} className="active:bg-accent-ink" />
              </Button>
            </div>
          </div>
        </div>

        <div
          data-selected={selected}
          className={cn(
            "grid grid-rows-[0fr] transition-[grid-template-rows] duration-200",
            "data-[selected=true]:grid-rows-[1fr]",
            !connection.inProgress && "group-hover:grid-rows-[1fr]",
          )}
        >
          <div className="overflow-hidden">
            <div className="border-ink/20 relative flex w-full flex-col items-start gap-y-2 border-t-2 border-dashed p-2">
              {getVisibleConfigs(type, data.config).map(([key, value]) => {
                const Icon = configIcons[formatText(key).toUpperCase()];

                const formattedValue =
                  typeof value === "object" && value !== null ? toJSON(value) : toString(value);

                return (
                  <div key={key} className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-x-2">
                      {Icon && <Icon size={12} strokeWidth={2} className="text-ink/40" />}

                      <span className="text-xs font-semibold uppercase">{formatText(key)}</span>
                    </div>

                    <span className="w-40 truncate text-right text-xs">{formattedValue}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-ink/20 flex w-full items-center justify-between gap-x-2 border-t-2 border-dashed p-2">
          <div className="flex items-center justify-between gap-x-2">
            <Clock size={12} strokeWidth={2} className="text-ink/40" />

            <span className="text-xs font-medium">
              {formatDuration(Number(data.runtime.duration))}
            </span>
          </div>

          <StatusIcon
            size={16}
            className={cn(
              STATUS_ICONS[data.runtime.status].color,
              data.runtime.status === "RUNNING" && "animate-spin",
            )}
          />
        </div>

        {selected && <Shadow />}
      </div>

      <BaseHandle
        handles={handles}
        className={cn(
          "pointer-events-none opacity-0",
          (selected || connection.inProgress) && "pointer-events-auto opacity-100",
        )}
      />
    </>
  );
}
