import { EdgeTypes, Node, NodeTypes } from "@xyflow/react";

import { LucideIcon } from "lucide-react";

import { RequestNode } from "@/app/projects/test/_components/canvas/nodes/request-node";
import { DatabaseNode } from "@/app/projects/test/_components/canvas/nodes/database-node";
import { SharpEdge } from "@/app/projects/test/_components/canvas/edges/custom-edge";

export const nodeTypes: NodeTypes = {
  REQUEST: RequestNode,
  DATABASE: DatabaseNode,
};

export type RequestNodeProps = Node<
  {
    category: string;
    label: string;
    icon: LucideIcon;
    method: "GET" | "POST";
    endpoint: string;
  },
  "REQUEST"
>;

export type DatabaseNodeProps = Node<
  {
    category: string;
    label: string;
    icon: LucideIcon;
    database: string;
    latency?: number;
  },
  "DATABASE"
>;

export type EditorNodeProps = RequestNodeProps | DatabaseNodeProps;

export const edgeTypes: EdgeTypes = {
  SHARP: SharpEdge,
};
