import { Handle, NodeProps, Position } from "@xyflow/react";

import { DatabaseNodeProps } from "@/app/projects/test/_components/canvas/config";
import { Diamond } from "@/components/ui/decorations/diamond";

export function DatabaseNode({ data }: NodeProps<DatabaseNodeProps>) {
  return (
    <div className="border-accent-ink! bg-primary border-2 p-4">
      {data.label}

      <Handle
        type="source"
        style={{
          background: "none",
          border: "none",
          width: "1em",
          height: "1em",
        }}
        position={Position.Top}
      >
        <Diamond
          className="bg-accent-ink! absolute top-1/2 left-1/2 -translate-1/2"
          variant="filled"
        />
      </Handle>

      <Handle type="target" position={Position.Bottom} />
    </div>
  );
}
