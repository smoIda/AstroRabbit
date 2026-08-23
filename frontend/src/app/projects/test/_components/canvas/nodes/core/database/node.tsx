import { NodeProps } from "@xyflow/react";

import { HardDrive } from "lucide-react";

import { Database } from "@/app/projects/test/_components/canvas/nodes/core/database/config";
import { BaseNode } from "@/app/projects/test/_components/canvas/nodes/base/node";
import { generateHandle } from "@/app/projects/test/_components/canvas/utils";

const ICONS = {
  DATABASE: HardDrive,
} as const;

export function DatabaseNode(node: NodeProps<Database>) {
  return (
    <BaseNode
      {...node}
      configIcons={ICONS}
      handles={generateHandle(node.type)}
    />
  );
}
