"use client";

import { createContext, useMemo, useReducer } from "react";

import { nanoid } from "nanoid";

import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";

import { CanvasEdge } from "@/app/projects/test/_components/canvas/edges/config";
import {
  modifyNodeBadge,
  modifyNodeData,
} from "@/app/projects/test/_providers/editor/utils";
import {
  ActionEditor,
  CanvasNode,
  EditorContextValue,
  InitialEditor,
} from "@/app/projects/test/_providers/editor/config";

export const EditorContext = createContext<EditorContextValue | undefined>(
  undefined,
);

export const initialEditor: InitialEditor = {
  tool: "SELECT",
  nodes: [],
  edges: [],
};

export const actionEditor = (
  state: InitialEditor,
  action: ActionEditor,
): InitialEditor => {
  switch (action.type) {
    case "SELECT_TOOL":
      return {
        ...state,
        tool: action.payload,
      };

    case "MODIFY_BADGE":
      return {
        ...state,
        nodes: state.nodes.map((node) =>
          node.id === action.payload.nodeId
            ? modifyNodeBadge(action.payload.method, node, action.payload.badge)
            : node,
        ),
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

    case "CHANGE_NODE": {
      return {
        ...state,
        nodes: applyNodeChanges<CanvasNode>(action.payload, state.nodes),
      };
    }

    case "SET_NODE":
      return {
        ...state,
        nodes: state.nodes.map((node) =>
          node.id === action.payload.id
            ? modifyNodeData(node, action.payload.data)
            : node,
        ),
      };

    case "DELETE_NODE":
      return {
        ...state,
        nodes: state.nodes.filter((node) => node.id !== action.payload),
      };

    case "CREATE_EDGE": {
      const edge: CanvasEdge = {
        id: nanoid(),
        type: "SHARP",
        ...action.payload,
      };

      return {
        ...state,
        edges: addEdge(edge, state.edges),
      };
    }

    case "CHANGE_EDGE":
      return {
        ...state,
        edges: applyEdgeChanges<CanvasEdge>(action.payload, state.edges),
      };

    case "SET_EDGE":
      return {
        ...state,
        edges: state.edges.map((edge) =>
          edge.id === action.payload.id
            ? {
                ...edge,
                data: {
                  ...edge.data,
                  status: action.payload.status,
                },
              }
            : edge,
        ),
      };

    case "DELETE_EDGE":
      return {
        ...state,
        edges: state.edges.filter((edge) => edge.id !== action.payload),
      };

    default:
      return state;
  }
};

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(actionEditor, initialEditor);

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
