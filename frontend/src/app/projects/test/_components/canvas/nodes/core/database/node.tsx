import { NodeProps } from "@xyflow/react";

import { HardDrive } from "lucide-react";

import { BaseHandle } from "@/app/projects/test/_components/canvas/nodes/base/handle";
import { Database } from "@/app/projects/test/_components/canvas/nodes/core/database/config";
import { BaseNode } from "@/app/projects/test/_components/canvas/nodes/base/node";

const icons = {
  DATABASE: HardDrive,
} as const;

export function DatabaseNode(node: NodeProps<Database>) {
  return (
    <BaseNode {...node} configIcons={icons}>
      <BaseHandle sides={["left", "right"]} />
    </BaseNode>
  );
}
