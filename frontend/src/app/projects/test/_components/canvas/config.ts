import { Node, NodeTypes } from "@xyflow/react";

import { RequestNode } from "@/app/projects/test/_components/canvas/nodes/request-node";
import { DatabaseNode } from "@/app/projects/test/_components/canvas/nodes/database-node";

export const nodeTypes: NodeTypes = {
  REQUEST: RequestNode,
  DATABASE: DatabaseNode,
};

export type RequestNodeProps = Node<
  { category: string; label: string; method: "GET" | "POST"; endpoint: string },
  "REQUEST"
>;

export type DatabaseNodeProps = Node<
  { category: string; label: string; database: string; latency?: number },
  "DATABASE"
>;

export type EditorNodeProps = RequestNodeProps | DatabaseNodeProps;
