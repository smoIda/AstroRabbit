import { Connection, Edge, EdgeChange, EdgeTypes, NodeChange, NodeTypes } from "@xyflow/react";

import { LucideIcon } from "lucide-react";

import { EdgeStatus } from "@/app/projects/test/_components/canvas/edges/config";
import { ToolboxItem } from "@/app/projects/test/_components/layout/toolbox";
import {
  HttpRequest,
  HttpRequestData,
} from "@/app/projects/test/_components/canvas/nodes/core/http-request/config";
import {
  Database,
  DatabaseData,
} from "@/app/projects/test/_components/canvas/nodes/core/database/config";
import { HttpRequestNode } from "@/app/projects/test/_components/canvas/nodes/core/http-request/node";
import { DatabaseNode } from "@/app/projects/test/_components/canvas/nodes/core/database/node";
import { Sharp } from "@/app/projects/test/_components/canvas/edges/sharp";

export type NodeData = HttpRequestData | DatabaseData;

export type CanvasNode = HttpRequest | Database;
export type CanvasEdge = Edge<{ status: EdgeStatus }>;

export const NODE_TYPES: NodeTypes = {
  HTTP_REQUEST: HttpRequestNode,
  DATABASE: DatabaseNode,
};

export const EDGE_TYPES: EdgeTypes = {
  SHARP: Sharp,
};

export type InitialEditor = {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  tool: ToolboxItem["id"];
};

export type ActionEditor =
  | { type: "SELECT_TOOL"; payload: ToolboxItem["id"] }
  | { type: "PATCH_BADGE"; payload: { nodeId: string; method: "CREATE" | "DELETE"; badge: string } }
  | { type: "CREATE_NODE"; payload: CanvasNode["type"] }
  | { type: "CHANGE_NODE"; payload: NodeChange<CanvasNode>[] }
  | { type: "PATCH_NODE_BRANDING"; payload: { id: string; label: string; icon?: LucideIcon } }
  | { type: "PATCH_NODE_CONFIG"; payload: { id: string; key: string; value: unknown } }
  | {
      type: "PATCH_NODE_EXECUTION";
      payload: { id: string; runtime: NodeData["runtime"]; output?: NodeData["output"] };
    }
  | { type: "DELETE_NODE"; payload: string }
  | { type: "CREATE_EDGE"; payload: Connection }
  | { type: "CHANGE_EDGE"; payload: EdgeChange<CanvasEdge>[] }
  | { type: "PATCH_EDGE_EXECUTION"; payload: { id: string; status: EdgeStatus } }
  | { type: "DELETE_EDGE"; payload: string };
