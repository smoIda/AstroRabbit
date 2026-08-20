import { NodeProps } from "@xyflow/react";

import { Code2, FileText, Link, List } from "lucide-react";

import { BaseNode } from "@/app/projects/test/_components/canvas/nodes/base/node";
import { BaseHandle } from "@/app/projects/test/_components/canvas/nodes/base/handle";
import { HttpRequest } from "@/app/projects/test/_components/canvas/nodes/core/http-request/config";

const icons = {
  HEADERS: List,
  METHOD: Code2,
  BODY: FileText,
  URL: Link,
} as const;

export function StartNode(node: NodeProps<HttpRequest>) {
  return (
    <BaseNode {...node} configIcons={icons}>
      <BaseHandle sides={["right"]} />
    </BaseNode>
  );
}
