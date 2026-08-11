import { NodeProps, NodeToolbar, Position } from "@xyflow/react";

import { NodeData } from "@/app/projects/test/_components/canvas/nodes/config";
import Properties from "@/app/projects/test/_components/properties";
import { useExecutor } from "@/app/projects/test/_hooks/use-executor";

import { Diamond } from "@/components/ui/decorations/diamond";
import { Shadow } from "@/components/ui/decorations/shadow";

import { cn } from "@/lib/utils/cn";
import { useEffect } from "react";

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

      <div className="relative flex size-25 items-center justify-center">
        <Icon className="stroke-ink-soft size-2/5" />

        {props.children}

        <Diamond
          className={cn(
            "absolute top-1/2 left-1/2 -z-10 size-18 -translate-1/2",
            nodeStatus[props.id] === "RUNNING" && "border-green-400!",
            nodeStatus[props.id] === "FINISHED" && "border-amber-500"!,
            nodeStatus[props.id] === "CANCELLED" && "border-sky-500"!,
            nodeStatus[props.id] === "ERROR" && "border-red-600!",
          )}
          variant="filled"
        />

        {props.selected && <Shadow className="size-20 rotate-45" scale={1} />}

        <span className="absolute -top-10">
          {props.id + " - " + props.data.duration + "s"}
        </span>
      </div>
    </>
  );
}
