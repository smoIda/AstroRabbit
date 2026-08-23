import { nanoid } from "nanoid";

import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";

import { CanvasEdge } from "@/app/projects/test/_components/canvas/edges/config";
import {
  ActionEditor,
  CanvasNode,
  InitialEditor,
} from "@/app/projects/test/_providers/editor/config";
import {
  createNode,
  setBadge,
  updateData,
} from "@/app/projects/test/_providers/editor/utils";

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

    case "SET_BADGE":
      return {
        ...state,
        nodes: state.nodes.map((node) =>
          node.id === action.payload.nodeId
            ? setBadge(node, action.payload.method, action.payload.badge)
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
            ...createNode(action.payload),
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
            ? updateData(node, action.payload.data)
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
