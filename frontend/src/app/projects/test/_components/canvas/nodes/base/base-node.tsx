import { NodeProps, NodeToolbar, Position } from "@xyflow/react";

import {
  BaseNodeData,
  EditorNodeProps,
} from "@/app/projects/test/_components/canvas/config";
import Properties from "@/app/projects/test/_components/properties";

import { Diamond } from "@/components/ui/decorations/diamond";
import { Shadow } from "@/components/ui/decorations/shadow";

import { cn } from "@/lib/utils/cn";

type BaseNodeProps = NodeProps<EditorNodeProps> & {
  children: React.ReactNode;
};

export function BaseNode(props: BaseNodeProps) {
  const Icon = props.data.icon;

  return (
    <>
      <NodeToolbar
        isVisible={props.selected}
        position={Position.Right}
        offset={16}
      >
        <Properties
          id={props.id}
          data={props.data}
          x={props.positionAbsoluteX}
          y={props.positionAbsoluteY}
        />
      </NodeToolbar>

      <div
        className={cn(
          "relative flex size-25 items-center justify-center",
          props.selected && "border-2 border-dashed",
        )}
      >
        <Icon className="stroke-ink-soft size-2/5" />

        {props.children}

        <Diamond
          className="absolute top-1/2 left-1/2 -z-10 size-18 -translate-1/2"
          variant="filled"
        />

        <Shadow className="size-20 rotate-45" scale={1} />
      </div>
    </>
  );
}
