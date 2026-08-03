import { NodeProps } from "@xyflow/react";

import { RequestNodeProps } from "@/app/projects/test/_components/canvas/config";
import { BaseNode } from "@/app/projects/test/_components/canvas/nodes/base/base-node";
import { BaseHandle } from "@/app/projects/test/_components/canvas/nodes/base/base-handle";

export function RequestNode(node: NodeProps<RequestNodeProps>) {
  return (
    <BaseNode {...node}>
      <div className="absolute inset-1">
        <BaseHandle
          positions={{
            top: ["target"],
            right: ["target"],
            bottom: ["source"],
            left: ["target"],
          }}
        />
      </div>
    </BaseNode>
  );
}
