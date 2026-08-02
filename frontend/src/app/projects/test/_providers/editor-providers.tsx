"use client";

import { createContext, useMemo, useReducer } from "react";

import { Database, Globe, LucideIcon } from "lucide-react";

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
} from "@xyflow/react";

import { EditorNodeProps } from "@/app/projects/test/_components/canvas/config";

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
        category: "HTTP Request",
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
        category: "Database",
        label: "/users",
        icon: Database,
        database: "MongoDB",
      },
    },
  ],
  edges: [],
};

export const ActionEditor = (
  state: InitialEditorProps,
  action: ActionEditorProps,
): InitialEditorProps => {
  switch (action.type) {
    case "SELECT_TOOL":
      return { ...state, tool: action.payload };

    case "CREATE_NODE":
      return { ...state, nodes: [...state.nodes, action.payload] };

    case "CREATE_EDGE":
      return { ...state, edges: addEdge({...action.payload, type: "SHARP"}, state.edges) };

    case "CHANGE_NODE":
      return {
        ...state,
        nodes: applyNodeChanges<EditorNodeProps>(action.payload, state.nodes),
      };

    case "CHANGE_EDGE":
      return {
        ...state,
        edges: applyEdgeChanges<Edge>(action.payload, state.edges),
      };

    default:
      return state;
  }
};

export type ToolboxItemProps = {
  id: "SELECT" | "INSERT" | "IDK";
  icon: LucideIcon;
  keybind: "V";
};

type InitialEditorProps = {
  nodes: EditorNodeProps[];
  edges: Edge[];
  tool: ToolboxItemProps["id"];
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
