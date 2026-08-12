import { NodeProps, NodeToolbar, Position } from "@xyflow/react";

import { NodeData } from "@/app/projects/test/_components/canvas/nodes/config";
import Properties from "@/app/projects/test/_components/properties";
import { useExecutor } from "@/app/projects/test/_hooks/use-executor";

import { Diamond } from "@/components/ui/decorations/diamond";
import { Shadow } from "@/components/ui/decorations/shadow";

import { cn } from "@/lib/utils/cn";

type BaseNodeProps = NodeProps<NodeData> & {
  children: React.ReactNode;
};

export function BaseNode(props: BaseNodeProps) {
  const Icon = props.data.icon;

  const { nodeStatus } = useExecutor();

  return (
    <>
      <NodeToolbar
        isVisible={props.selected}
        position={Position.Right}
        offset={32}
      >
        <Properties
          id={props.id}
          data={props.data}
          x={props.positionAbsoluteX}
          y={props.positionAbsoluteY}
        />
      </NodeToolbar>

      <div className="border-ink bg-white-ink relative flex w-80 flex-col border-2">
        <div className="flex w-full items-center gap-x-4 px-4 py-2">
          <div className="relative flex size-8 shrink-0 items-center justify-center">
            <Diamond variant="filled" className="absolute inset-0 size-8" />

            <Icon className="stroke-ink-soft relative z-10 size-5" />
          </div>

          <div className="flex min-w-0 flex-1 flex-col">
            <span className="truncate text-lg font-semibold">
              {props.data.label}
            </span>

            <span className="text-xs">{props.type.replace("_", " ")}</span>
          </div>
        </div>

        <div className="border-ink/10! flex w-full flex-col items-start gap-y-2 border-t-2 p-2">
          {Object.entries(props.data.input).map(([key, value]) => {
            return (
              <div
                key={key}
                className="flex w-full items-center justify-between"
              >
                <span className="text-xs font-semibold uppercase">{key}</span>

                <span className="w-40 truncate text-right text-xs">
                  {typeof value === "object" ? JSON.stringify(value) : value}
                </span>
              </div>
            );
          })}
        </div>

        <div className="border-ink/10! flex w-full flex-col items-start gap-y-2 border-t-2 p-2">
          {Object.entries(props.data.output).map(([key, value]) => {
            return (
              <div
                key={key}
                className="flex w-full items-center justify-between"
              >
                <span className="text-xs font-semibold uppercase">{key}</span>

                <span className="w-40 truncate shrink-0 text-right text-xs">
                  {key === "duration" ? (
                    value + " ms"
                  ) : (
                    <Diamond
                      variant="filled"
                      className={cn(
                        "border",
                        nodeStatus[props.id] === "RUNNING" && "bg-accent-ink",
                        nodeStatus[props.id] === "FINISHED" && "bg-green-500",
                        nodeStatus[props.id] === "ERROR" && "bg-red-500",
                        nodeStatus[props.id] === "CANCELLED" && "bg-orange-500",
                      )}
                    />
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {props.selected && <Shadow />}
      </div>
    </>
  );
}
