import { useState } from "react";

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

import { Diamond } from "@/components/ui/decorations/diamond";
import { Shadow } from "@/components/ui/decorations/shadow";
import { Bracket } from "@/components/ui/decorations/bracket";
import { Badge } from "@/components/ui/primitives/badge";
import { Button } from "@/components/ui/primitives/button";

import { cn } from "@/lib/utils/cn";
import { formatText } from "@/lib/utils/formatText";

function Label(data: BaseNode["data"]) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [oldLabel, setOldLabel] = useState(data.label);
  const [label, setLabel] = useState(data.label);

  const onStart = (e: React.MouseEvent) => {
    e.stopPropagation();

    setOldLabel(label);
    setIsRenaming(true);
  };

  const onCommit = () => {
    if (label.trim().length === 0) setLabel(oldLabel);
    else {
      setLabel(label.trim());
      setOldLabel(label.trim());
    }
    setIsRenaming(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (e.key === "Enter") onCommit();

    if (e.key === "Escape") {
      setLabel(oldLabel.trim());
      setIsRenaming(false);
    }
  };

  return isRenaming ? (
    <input
      type="text"
      value={label}
      maxLength={50}
      placeholder="Node name"
      autoFocus
      onChange={(e) => setLabel(e.target.value)}
      onBlur={onCommit}
      onKeyDown={onKeyDown}
      className="text-ink nopan nodrag mb-1 w-full border-b text-lg font-semibold outline-none"
    />
  ) : (
    <span
      title={label.trim()}
      onDoubleClick={(e) => onStart(e)}
      className="text-ink truncate text-lg font-semibold select-none"
    >
      {label}
    </span>
  );
}

export function BaseNode({ id, type, data, selected, className, handles, configIcons }: BaseNode) {
  const NodeIcon = data.icon;
  const StatusIcon = STATUS_ICONS[data.runtime.status].icon;

  const selectedCount = useStore((s) => s.nodes.filter((node) => node.selected).length);

  const connection = useConnection(); // Detects edges dragging

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
            <Label {...data} />

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
              <Badge key={`${id}-badge`} color="accent-soft">
                {formatText(type)}
              </Badge>

              {data.badge.length > 0 &&
                data.badge.map((badge) => {
                  return (
                    <Badge title={badge} className="group-hover/badge:opacity-30" color="accent">
                      {badge}
                    </Badge>
                  );
                })}

              <Button
                aria-label="Add badge"
                onClick={(e) => {
                  e.stopPropagation();
                }}
                variant="no-brackets"
                size="icon"
                className="nodrag nopan p-0"
              >
                <PlusSquare size={16} className="text-ink-soft active:bg-accent-ink" />
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
            <div className="border-ink/10 relative flex w-full flex-col items-start gap-y-2 border-t-2 border-dashed p-2">
              {getVisibleConfigs(type, data.config).map(([key, value]) => {
                const Icon =
                  configIcons[
                    key
                      .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
                      .replace(/[-\s]+/g, "_")
                      .toUpperCase()
                  ];

                const formattedValue =
                  typeof value === "object" && value !== null
                    ? JSON.stringify(value)
                    : String(value ?? "");

                return (
                  <div key={key} className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-x-2">
                      {Icon && <Icon size={12} strokeWidth={2} className="text-ink-soft/60" />}
                      <span className="text-xs font-semibold uppercase">
                        {key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/_/g, " ")}
                      </span>
                    </div>

                    <span className="w-40 truncate text-right text-xs">{formattedValue}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-ink/10 flex w-full items-center justify-between gap-x-2 border-t-2 border-dashed p-2">
          <div className="flex items-center justify-between gap-x-2">
            <Clock size={12} strokeWidth={2} className="text-ink-soft/60" />

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
