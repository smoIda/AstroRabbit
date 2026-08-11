import { NodeProps } from "@xyflow/react";

import { HttpRequest } from "@/app/projects/test/_components/canvas/nodes/config";
import { BaseNode } from "@/app/projects/test/_components/canvas/nodes/base/base-node";
import { BaseHandle } from "@/app/projects/test/_components/canvas/nodes/base/base-handle";

export function HttpRequestNode(node: NodeProps<HttpRequest>) {
  return (
    <BaseNode {...node}>
      <BaseHandle
        positions={{
          top: ["target"],
          right: ["target"],
          bottom: ["source"],
          left: ["target"],
        }}
      />
    </BaseNode>
  );
}
