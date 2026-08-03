import { EdgeTypes, Node, NodeTypes } from "@xyflow/react";

import { LucideIcon } from "lucide-react";

import { RequestNode } from "@/app/projects/test/_components/canvas/nodes/request-node";
import { DatabaseNode } from "@/app/projects/test/_components/canvas/nodes/database-node";
import { SharpEdge } from "@/app/projects/test/_components/canvas/edges/custom-edge";



export type BaseNodeData = {
  type: string;
  label: string;
  icon: LucideIcon;
};

export type RequestNodeProps = Node<
  BaseNodeData & {
    method: "GET" | "POST";
    endpoint: string;
  },
  "REQUEST"
>;

export type DatabaseNodeProps = Node<
  BaseNodeData & {
    database: string;
    latency?: number;
  },
  "DATABASE"
>;

export type EditorNodeProps = RequestNodeProps | DatabaseNodeProps;

export const nodeTypes: NodeTypes = {
  REQUEST: RequestNode,
  DATABASE: DatabaseNode,
};

export const edgeTypes: EdgeTypes = {
  SHARP: SharpEdge,
};
