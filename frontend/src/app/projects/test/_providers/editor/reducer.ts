import { nanoid } from "nanoid";

import { addEdge, applyEdgeChanges, applyNodeChanges } from "@xyflow/react";

import { CanvasEdge } from "@/app/projects/test/_providers/editor/config";
import {
  ActionEditor,
  CanvasNode,
  InitialEditor,
} from "@/app/projects/test/_providers/editor/config";
import {
  createNode,
  patchBadge,
  patchEdge,
  patchNode,
} from "@/app/projects/test/_providers/editor/utils";

export const initialEditor: InitialEditor = {
  tool: "SELECT",
  nodes: [],
  edges: [],
};

export const actionEditor = (state: InitialEditor, action: ActionEditor): InitialEditor => {
  switch (action.type) {
    case "SELECT_TOOL":
      return {
        ...state,
        tool: action.payload,
      };

    case "PATCH_BADGE":
      return {
        ...state,
        nodes: state.nodes.map((node) =>
          node.id === action.payload.nodeId
            ? patchBadge(node, action.payload.method, action.payload.badge)
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

    case "PATCH_NODE_BRANDING":
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.id !== action.payload.id) return node;

          return patchNode(node, { label: action.payload.label, icon: action.payload.icon });
        }),
      };

    case "PATCH_NODE_CONFIG":
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.id !== action.payload.id || !Object.hasOwn(node.data.config, action.payload.key))
            return node;

          return patchNode(node, {
            config: {
              ...node.data.config,
              [action.payload.key]: action.payload.value,
            },
          });
        }),
      };

    case "PATCH_NODE_EXECUTION":
      return {
        ...state,
        nodes: state.nodes.map((node) => {
          if (node.id !== action.payload.id) return node;
          if (action.payload.output !== undefined)
            return patchNode(node, {
              runtime: action.payload.runtime,
              output: action.payload.output,
            });

          return patchNode(node, { runtime: action.payload.runtime });
        }),
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

    case "PATCH_EDGE_EXECUTION":
      return {
        ...state,
        edges: state.edges.map((edge) =>
          edge.id === action.payload.id ? patchEdge(edge, { status: action.payload.status }) : edge,
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
