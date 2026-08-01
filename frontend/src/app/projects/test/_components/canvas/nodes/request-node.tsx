import { Handle, NodeProps, Position } from "@xyflow/react";

import { RequestNodeProps } from "@/app/projects/test/_components/canvas/config";

import { Bracket } from "@/components/ui/decorations/bracket";
import { Diamond } from "@/components/ui/decorations/diamond";
import { Frame } from "@/components/ui/decorations/frame";

export function RequestNode({ data }: NodeProps<RequestNodeProps>) {
  return (
    <Frame>
      <div className="bg-white-ink h-40 w-60">
        <Bracket className="top-0.5 left-0.5 size-6" color="accent" />

        <div className="flex flex-col items-center justify-center">
          <span className="ml-auto flex items-center justify-center text-sm">
            {data.category}
          </span>

          <div className="ml-2">
            <div className="text-lg font-bold">{data.method}</div>

            <div className="text-gray-500">{data.endpoint}</div>
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Left}
          className="-left-px! flex size-3! items-center justify-center border-none! bg-transparent!"
        >
          <Diamond size="md" variant="outline" color="white" />
        </Handle>

        <Handle
          type="target"
          position={Position.Right}
          className="-right-px! flex size-3! items-center justify-center border-none! bg-transparent!"
        >
          <Diamond size="md" variant="outline" color="white" />
        </Handle>
      </div>
    </Frame>
  );
}
