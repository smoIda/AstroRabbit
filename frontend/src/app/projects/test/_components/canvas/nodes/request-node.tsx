import { Handle, NodeProps, Position } from "@xyflow/react";

import { RequestNodeProps } from "@/app/projects/test/_components/canvas/config";

import { Diamond } from "@/components/ui/decorations/diamond";

export function RequestNode({ data }: NodeProps<RequestNodeProps>) {
  const Icon = data.icon;

  return (
    <div className="relative flex size-25 items-center justify-center">
      <Icon className="stroke-ink-soft size-1/2" />

      <div className="absolute inset-1">
        <Handle
          type="source"
          position={Position.Top}
          style={{ clipPath: "polygon(100% 50%, 50% 20%, 0% 50%, 50% 0%)" }}
          className="bg-accent-ink top-0 left-1/2 size-6 -translate-x-1/2 transform-none rounded-none border-none"
        />

        <Handle
          type="source"
          position={Position.Right}
           style={{ clipPath: "polygon(50% 100%, 80% 50%, 50% 0%, 100% 50%)" }}
          className="bg-accent-ink top-1/2 right-0 size-6 -translate-y-1/2 transform-none rounded-none border-none"
        />

        <Handle
          type="target"
          position={Position.Bottom}
          style={{ clipPath: "polygon(0% 50%, 50% 80%, 100% 50%, 50% 100%)" }}
          className="bg-accent-ink bottom-0 left-1/2 size-6 -translate-x-1/2 transform-none rounded-none border-none"
        />
      </div>

      <Diamond
        className="absolute top-1/2 left-1/2 -z-10 size-18 -translate-1/2"
        variant="filled"
      />

      <Diamond
        className="absolute top-1/2 left-1/2 -z-20 size-20 -translate-1/2 opacity-40"
        variant="solid"
        backgroundColor="white-soft"
      />
    </div>
  );
}
