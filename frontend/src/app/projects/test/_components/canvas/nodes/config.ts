import { Node, NodeTypes } from "@xyflow/react";

import { LucideIcon } from "lucide-react";

import { HttpRequestNode } from "@/app/projects/test/_components/canvas/nodes/http-request-node";
import { DatabaseNode } from "@/app/projects/test/_components/canvas/nodes/database-node";
import { NodeStatus } from "@/app/projects/test/_providers/executor-provider";

export type Base = {
  label: string;
  icon: LucideIcon;
};

export type HttpRequest = Node<
  Base & {
    input: {
      headers: Record<string, string>;
      method: "GET" | "POST";
      body: string;
      url: string;
    };

    output: {
      status: NodeStatus;
      duration: number;
    };
  },
  "HTTP_REQUEST"
>;

export type Database = Node<
  Base & {
    input: {
      database: "MongoDB" | "PostgreSQL" | "MySQL";
    };

    output: {
      status: NodeStatus;
      duration: number;
    };
  },
  "DATABASE"
>;

export type NodeData = HttpRequest | Database;

export const nodeTypes: NodeTypes = {
  HTTP_REQUEST: HttpRequestNode,
  DATABASE: DatabaseNode,
};
