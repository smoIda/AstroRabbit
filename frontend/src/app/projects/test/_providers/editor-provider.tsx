"use client";

import { createContext, useMemo, useReducer } from "react";

import { Database, Globe } from "lucide-react";

import { nanoid } from "nanoid";

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
} from "@xyflow/react";

import {
  CreateNodeProps,
  ToolboxItemProps,
} from "@/app/projects/test/_components/toolbox";
import { NodeData } from "@/app/projects/test/_components/canvas/nodes/config";

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
      type: "HTTP_REQUEST",
      position: {
        x: 100,
        y: 100,
      },
      data: {
        label: "User",
        icon: Globe,

        input: {
          headers: {
            "Content-type": "application/json",
          },
          method: "GET",
          body: "Hello world from hee hee hahahahahahahahaha",
          url: "/users",
        },

        output: {
          status: "IDLE",
          duration: 0,
        },
      },
    },

    {
      id: "2",
      type: "DATABASE",
      position: {
        x: 150,
        y: 300,
      },
      data: {
        label: "/users",
        icon: Database,

        input: {
          database: "MongoDB",
        },

        output: {
          status: "IDLE",
          duration: 0,
        },
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
      return {
        ...state,
        tool: action.payload,
      };

    case "CREATE_NODE":
      return {
        ...state,
        nodes: [
          ...state.nodes,
          {
            id: nanoid(),
            ...action.payload,
          },
        ],
      };

    case "CREATE_EDGE": {
      const edge: Edge = {
        id: nanoid(),
        type: "SHARP",
        ...action.payload,
      };

      return {
        ...state,
        edges: addEdge(edge, state.edges),
      };
    }

    case "CHANGE_NODE": {
      const nodes = applyNodeChanges<NodeData>(action.payload, state.nodes);

      return {
        ...state,
        nodes,
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
  nodes: NodeData[];
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
      payload: CreateNodeProps<NodeData>;
    }
  | {
      type: "CREATE_EDGE";
      payload: Connection;
    }
  | {
      type: "CHANGE_NODE";
      payload: NodeChange<NodeData>[];
    }
  | {
      type: "CHANGE_EDGE";
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
