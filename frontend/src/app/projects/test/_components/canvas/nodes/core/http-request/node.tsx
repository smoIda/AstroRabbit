import { NodeProps } from "@xyflow/react";

import {
  ClockFading,
  Code2,
  FileText,
  Hash,
  Link2,
  List,
  TrendingDown,
} from "lucide-react";

import { HttpRequest } from "@/app/projects/test/_components/canvas/nodes/core/http-request/config";
import { BaseNode } from "@/app/projects/test/_components/canvas/nodes/base/node";
import { generateHandle } from "@/app/projects/test/_components/canvas/utils";

const ICONS = {
  HEADERS: List,
  METHOD: Code2,
  BODY: FileText,
  URL: Link2,

  LATENCY: ClockFading,
  STATUS_CODE: Hash,
  FAILURE_RATE: TrendingDown,
} as const;

export function HttpRequestNode(node: NodeProps<HttpRequest>) {
  return (
    <BaseNode
      {...node}
      configIcons={ICONS}
      handles={generateHandle(node.type)}
    />
  );
}
