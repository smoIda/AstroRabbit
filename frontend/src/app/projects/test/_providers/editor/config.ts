import { Connection, EdgeChange, NodeChange, NodeTypes } from "@xyflow/react";

import {
  CanvasEdge,
  EdgeStatus,
} from "@/app/projects/test/_components/canvas/edges/config";
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

export type CreateNode<T> = T extends CanvasNode ? Omit<T, "id"> : never;

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type EditorContextValue = {
  state: InitialEditor;
  dispatch: React.Dispatch<ActionEditor>;
};

export type NodeData = HttpRequestData | DatabaseData;

export type CanvasNode = HttpRequest | Database;

export const nodeTypes: NodeTypes = {
  HTTP_REQUEST: HttpRequestNode,
  DATABASE: DatabaseNode,
};

export type InitialEditor = {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  tool: ToolboxItem["id"];
};

export type ActionEditor =
  | {
      type: "SELECT_TOOL";
      payload: ToolboxItem["id"];
    }
  | {
      type: "MODIFY_BADGE";
      payload: { method: "CREATE" | "DELETE"; nodeId: string; badge: string };
    }
  | {
      type: "CREATE_NODE";
      payload: CreateNode<CanvasNode>;
    }
  | {
      type: "CHANGE_NODE";
      payload: NodeChange<CanvasNode>[];
    }
  | {
      type: "SET_NODE";
      payload: { id: string; data: DeepPartial<NodeData> };
    }
  | {
      type: "DELETE_NODE";
      payload: string;
    }
  | {
      type: "CREATE_EDGE";
      payload: Connection;
    }
  | {
      type: "CHANGE_EDGE";
      payload: EdgeChange<CanvasEdge>[];
    }
  | { type: "SET_EDGE"; payload: { id: string; status: EdgeStatus } }
  | {
      type: "DELETE_EDGE";
      payload: string;
    };
