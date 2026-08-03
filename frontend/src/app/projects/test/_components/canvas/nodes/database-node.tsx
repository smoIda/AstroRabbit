import { NodeProps } from "@xyflow/react";

import { DatabaseNodeProps } from "@/app/projects/test/_components/canvas/config";
import { BaseNode } from "@/app/projects/test/_components/canvas/nodes/base/base-node";
import { BaseHandle } from "@/app/projects/test/_components/canvas/nodes/base/base-handle";

export function DatabaseNode(node: NodeProps<DatabaseNodeProps>) {
  return (
    <BaseNode {...node}>
      <div className="absolute inset-1">
        <BaseHandle
          positions={{
            top: ["source"],
            right: ["source"],
            bottom: ["source"],
            left: ["source"],
          }}
        />
      </div>
    </BaseNode>
  );
}
