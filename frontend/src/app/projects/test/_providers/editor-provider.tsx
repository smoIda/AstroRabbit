"use client";

import { createContext, useMemo, useReducer } from "react";

import { Database, Globe } from "lucide-react";

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
} from "@xyflow/react";

import { ToolboxItemProps } from "@/app/projects/test/_components/toolbox";
import { ToolbarItemProps } from "@/app/projects/test/_components/toolbar";
import { EditorNodeProps } from "@/app/projects/test/_components/canvas/config";
import { getConnectionHandles } from "@/app/projects/test/_utils/get-connection-handles";
import { updateEdgeHandles } from "@/app/projects/test/_utils/update-edge-handles";

export const EditorContext = createContext<EditorContextProps | undefined>(
  undefined,
);

export type EditorContextProps = {
  state: InitialEditorProps;
  dispatch: React.Dispatch<ActionEditorProps>;
};

export const InitialEditor: InitialEditorProps = {
  tool: "SELECT",
  nodes: [
    {
      id: "1",
      type: "REQUEST",
      position: {
        x: 100,
        y: 100,
      },
      data: {
        type: "HTTP Request",
        label: "User",
        icon: Globe,
        method: "GET",
        endpoint: "/getdata",
      },
    },

    {
      id: "2",
      type: "DATABASE",
      position: { x: 150, y: 300 },
      data: {
        type: "Database",
        label: "/users",
        icon: Database,
        database: "MongoDB",
      },
    },
  ],
  edges: [],
  state: "IDLE",
};

export const ActionEditor = (
  state: InitialEditorProps,
  action: ActionEditorProps,
): InitialEditorProps => {
  switch (action.type) {
    case "SELECT_TOOL":
      return {
        ...state,
        tool: action.payload,
      };

    case "CREATE_NODE":
      return {
        ...state,
        nodes: [...state.nodes, action.payload],
      };

    case "CREATE_EDGE": {
      const source = state.nodes.find(
        (node) => node.id === action.payload.source,
      );

      const target = state.nodes.find(
        (node) => node.id === action.payload.target,
      );

      if (!source || !target) {
        return state;
      }

      const handles = getConnectionHandles(source, target);

      const edge: Edge = {
        id: crypto.randomUUID(),
        ...action.payload,
        type: "SHARP",
        sourceHandle: handles.sourceHandle,
        targetHandle: handles.targetHandle,
      };

      return {
        ...state,
        edges: addEdge(edge, state.edges),
      };
    }

    case "CHANGE_NODE": {
      const nodes = applyNodeChanges<EditorNodeProps>(
        action.payload,
        state.nodes,
      );

      const positionChanged = action.payload.some(
        (change) => change.type === "position",
      );

      if (!positionChanged) {
        return {
          ...state,
          nodes,
        };
      }

      return {
        ...state,
        nodes,
        edges: updateEdgeHandles(nodes, state.edges),
      };
    }

    case "CHANGE_EDGE":
      return {
        ...state,
        edges: applyEdgeChanges<Edge>(action.payload, state.edges),
      };

    default:
      return state;
  }
};

type InitialEditorProps = {
  nodes: EditorNodeProps[];
  edges: Edge[];
  tool: ToolboxItemProps["id"];
  state: "IDLE" | "RUNNING" | "SUCCESS" | "ERROR";
};

type ActionEditorProps =
  | {
      type: "SELECT_TOOL";
      payload: ToolboxItemProps["id"];
    }
  | {
      type: "CREATE_NODE";
      payload: EditorNodeProps;
    }
  | {
      type: "CREATE_EDGE";
      payload: Connection;
    }
  | {
      type: "CHANGE_NODE"; // Handles DRAGGING, SELECTING, DESELECTING, RESIZING a node
      payload: NodeChange<EditorNodeProps>[];
    }
  | {
      type: "CHANGE_EDGE"; // Same as node
      payload: EdgeChange<Edge>[];
    };

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(ActionEditor, InitialEditor);

  const values = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state],
  );

  return (
    <EditorContext.Provider value={values}>{children}</EditorContext.Provider>
  );
}
