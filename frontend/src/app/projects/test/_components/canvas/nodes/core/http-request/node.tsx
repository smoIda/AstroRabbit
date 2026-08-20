import { NodeProps } from "@xyflow/react";

import { ClockFading, Code2, FileText, Hash, Link2, List, TrendingDown } from "lucide-react";

import { BaseNode } from "@/app/projects/test/_components/canvas/nodes/base/node";
import { BaseHandle } from "@/app/projects/test/_components/canvas/nodes/base/handle";
import { HttpRequest } from "@/app/projects/test/_components/canvas/nodes/core/http-request/config";

const ICONS = {
  HEADERS: List,
  METHOD: Code2,
  BODY: FileText,
  URL: Link2,

  LATENCY: ClockFading,
  STATUS_CODE: Hash,
  FAILURE_RATE: TrendingDown
} as const;

export function HttpRequestNode(node: NodeProps<HttpRequest>) {
  return (
    <BaseNode {...node} configIcons={ICONS}>
      <BaseHandle sides={["right"]} />
    </BaseNode>
  );
}
