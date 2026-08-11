import { Node, NodeTypes } from "@xyflow/react";

import { LucideIcon } from "lucide-react";

import { HttpRequestNode } from "@/app/projects/test/_components/canvas/nodes/http-request-node";
import { DatabaseNode } from "@/app/projects/test/_components/canvas/nodes/database-node";

export type Base = {
  label: string;
  icon: LucideIcon;
  duration: number;
};

export type HttpRequest = Node<
  Base & {
    method: "GET" | "POST";
    url: string;
    headers: Record<string, string>;
    body: string;
  },
  "HTTP_REQUEST"
>;

export type Database = Node<
  Base & {
    database: string;
  },
  "DATABASE"
>;

export type NodeData = HttpRequest | Database;

export const nodeTypes: NodeTypes = {
  HTTP_REQUEST: HttpRequestNode,
  DATABASE: DatabaseNode,
};
