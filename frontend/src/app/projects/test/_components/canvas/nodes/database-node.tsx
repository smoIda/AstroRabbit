import { Handle, NodeProps, Position } from "@xyflow/react";

import { RequestNodeProps } from "@/app/projects/test/_components/canvas/config";

import { Diamond } from "@/components/ui/decorations/diamond";

export function DatabaseNode({ data }: NodeProps<RequestNodeProps>) {
  const Icon = data.icon;

  return (
    <div className="bg-white-ink-soft/40 relative flex size-20 rotate-45 items-center justify-center">
      <Icon className="size-1/2 -rotate-45!" />

      <div className="pointer-events-none absolute inset-2">
        <Handle
          type="source"
          position={Position.Top}
          style={{
            clipPath: "polygon(100% 0%, 20% 20%, 0% 100%, 0% 0%)",
          }}
          className="bg-accent-ink top-0 left-0 size-4 transform-none rounded-none border-none"
        />

        <Handle
          type="target"
          position={Position.Bottom}
          style={{
            clipPath: "polygon(100% 0%, 20% 20%, 0% 100%, 0% 0%)",
          }}
          className="bg-accent-ink right-0 bottom-0 rotate-180 left-auto size-4 transform-none rounded-none border-none"
        />
      </div>

      <Diamond
        className="absolute top-1/2 left-1/2 -z-10 size-18 -translate-1/2 rotate-0!"
        variant="filled"
      />
    </div>
  );
}
