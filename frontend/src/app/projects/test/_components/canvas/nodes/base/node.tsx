import { useState } from "react";

import { NodeToolbar, Position, useConnection, useStore } from "@xyflow/react";

import {
  Ban,
  CheckCheck,
  Clock,
  FastForward,
  LucideIcon,
  Play,
  PlusSquare,
  Square,
  SquareDashed,
  Trash2,
} from "lucide-react";

import { Properties } from "@/app/projects/test/_components/layout/properties";
import { useEditor } from "@/app/projects/test/_hooks/use-editor";
import {
  NodeStatus,
  type BaseNode,
} from "@/app/projects/test/_components/canvas/nodes/base/config";
import { BaseHandle } from "@/app/projects/test/_components/canvas/nodes/base/handle";
import { useExecutor } from "@/app/projects/test/_hooks/use-executor";

import { Diamond } from "@/components/ui/decorations/diamond";
import { Shadow } from "@/components/ui/decorations/shadow";
import { Bracket } from "@/components/ui/decorations/bracket";
import { Badge } from "@/components/ui/primitives/badge";
import { Button } from "@/components/ui/primitives/button";

import { cn } from "@/lib/utils/cn";
import { ExecutionRequest } from "@/lib/api/executor";

const STATUS_ICONS: Record<NodeStatus, LucideIcon> = {
  IDLE: SquareDashed,
  RUNNING: Square,
  SUCCESS: CheckCheck,
  SKIPPED: FastForward,
  ERROR: Ban,
};

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

export function BaseNode(props: BaseNode) {
  const NodeIcon = props.data.icon;
  const StatusIcon = STATUS_ICONS[props.data.runtime.status];

  const { state: editorState, dispatch: editorDispatch } = useEditor();
  const { inProgress } = useConnection(); // Detects edges dragging
  const {
    state: executionState,
    skipNodeExecution,
    mutate: Execute,
  } = useExecutor();

  const selectedCount = useStore(
    (s) => s.nodes.filter((node) => node.selected).length,
  );

  function formatDuration(duration: number) {
    if (!Number.isFinite(duration) || duration <= 0) return "--";

    if (duration < 1) return `${Math.round(duration * 1000)}\u00A0ms`;

    return `${duration.toFixed(2)}\u00A0s`;
  }

  const start = (startAt: string) => {
    const nodes = editorState.nodes.filter(
      (node) =>
        node.id === startAt ||
        editorState.edges.some(
          (edge) => edge.source === node.id || edge.target === node.id,
        ),
    );

    const edges = editorState.edges;

    const request: ExecutionRequest = { nodes, edges, startAt };

    console.log(request);

    Execute(request);
  };

  const skip = (executionId: string, nodeId: string) => {
    if (!nodeId || !executionId) return;

    skipNodeExecution.mutate({ executionId, nodeId });
  };

  return (
    <>
      <NodeToolbar
        isVisible={props.selected && selectedCount === 1 && !inProgress}
        position={Position.Top}
        offset={16}
      >
        <Properties {...props} />
      </NodeToolbar>

      <div className="w-full">
        <span>{props.id}</span>
        <Button
          onClick={() => {
            if (!props.id) return;

            start(props.id);
          }}
          size="icon"
          aria-label="Run"
          variant="no-brackets"
        >
          <Play size={12} />
        </Button>

        {props.data.runtime.status === "RUNNING" && (
          <Button
            onClick={() => {
              if (!executionState.id) return;

              skip(executionState.id, props.id);
            }}
            className="nopan nodrag bg-accent-ink absolute -top-6 right-0 px-1"
            variant="no-brackets"
          >
            Skip
          </Button>
        )}
      </div>

      <div
        className={cn(
          "group relative flex w-80 flex-col border-2 bg-white",
          selectedCount > 0 && !props.selected && "border-ink/40 *:opacity-40",
          props.className,
        )}
      >
        <Bracket
          className="bg-accent-ink top-0.5 right-0.5 size-8"
          position="top-right"
        />

        <div className="flex w-full items-center gap-x-4 px-4 py-2">
          <div className="relative flex size-8 shrink-0 items-center justify-center">
            <Diamond
              variant="filled"
              className="from-white-ink/40 via-white-ink-soft/20 to-white-ink-soft absolute inset-0 size-8 bg-linear-to-br"
            />

            <NodeIcon className="stroke-ink relative z-10 size-5" />
          </div>

          <div className="flex w-full min-w-0 flex-col">
            <Label {...props.data} />

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
              <Badge key={`${props.id}-badge`} color="accent-soft">
                {props.type
                  .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                  .replace(/_/g, " ")}
              </Badge>

              {props.data.badge.length > 0 &&
                props.data.badge.map((badge) => {
                  return (
                    <Button
                      key={badge}
                      onClick={(e) => {
                        e.stopPropagation();

                        editorDispatch({
                          type: "MODIFY_BADGE",
                          payload: {
                            method: "DELETE",
                            nodeId: props.id,
                            badge: badge,
                          },
                        });
                      }}
                      variant="no-brackets"
                      className="nodrag nopan group/badge"
                    >
                      <Badge
                        title={badge}
                        className="group-hover/badge:opacity-30"
                        color="accent"
                      >
                        {badge}
                      </Badge>

                      <Trash2
                        className={cn(
                          "stroke-accent-ink absolute -translate-y-full opacity-0",
                          "transition-[opacity,translate] duration-200 group-hover/badge:translate-y-0 group-hover/badge:opacity-100",
                        )}
                        size={12}
                      />
                    </Button>
                  );
                })}

              <Button
                onClick={(e) => {
                  e.stopPropagation();
                }}
                variant="no-brackets"
                size="icon"
                className="nodrag nopan"
              >
                <PlusSquare
                  size={16}
                  className="stroke-ink-soft active:bg-accent-ink"
                />
              </Button>
            </div>
          </div>
        </div>

        <div
          data-selected={props.selected}
          className={cn(
            "grid grid-rows-[0fr] transition-[grid-template-rows] duration-200",
            "data-[selected=true]:grid-rows-[1fr]",
            !inProgress && "group-hover:grid-rows-[1fr]",
          )}
        >
          <div className="overflow-hidden">
            <div className="border-ink/10! relative flex w-full flex-col items-start gap-y-2 border-t-2 border-dashed p-2">
              {Object.entries(props.data.config).map(([key, value]) => {
                const Icon =
                  props.configIcons[
                    key
                      .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
                      .replace(/[-\s]+/g, "_")
                      .toUpperCase()
                  ];

                return (
                  <div
                    key={key}
                    className="flex w-full items-center justify-between"
                  >
                    <div className="flex items-center gap-x-2">
                      {Icon && (
                        <Icon
                          size={12}
                          strokeWidth={2}
                          className="stroke-ink-soft/60"
                        />
                      )}
                      <span className="text-xs font-semibold uppercase">
                        {key
                          .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
                          .replace(/_/g, " ")}
                      </span>
                    </div>

                    <span className="w-40 truncate text-right text-xs">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-ink/10! flex w-full items-center justify-between gap-x-2 border-t-2 border-dashed p-2">
          <div className="flex items-center justify-between gap-x-2">
            <Clock size={12} strokeWidth={2} className="stroke-ink-soft/60" />

            <span className="text-xs font-medium">
              {formatDuration(Number(props.data.runtime.duration))}
            </span>
          </div>

          <StatusIcon
            size={16}
            className={cn(
              props.data.runtime.status === "IDLE" && "stroke-gray-500",
              props.data.runtime.status === "RUNNING" && "stroke-sky-500",
              props.data.runtime.status === "SUCCESS" && "stroke-emerald-500",
              props.data.runtime.status === "SKIPPED" && "stroke-orange-500",
              props.data.runtime.status === "ERROR" && "stroke-red-500",
            )}
          />
        </div>

        {props.selected && <Shadow />}
      </div>

      <BaseHandle
        handles={props.handles}
        className={cn(
          "pointer-events-none opacity-0",
          (props.selected || inProgress) && "pointer-events-auto opacity-100",
        )}
      />
    </>
  );
}
