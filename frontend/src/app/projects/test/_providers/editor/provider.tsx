"use client";

import { createContext, useMemo, useReducer } from "react";

import { Connection, EdgeChange, NodeChange } from "@xyflow/react";

import { LucideIcon } from "lucide-react";

import { EdgeStatus } from "@/app/projects/test/_components/canvas/edges/config";
import { CanvasEdge } from "@/app/projects/test/_providers/editor/config";
import {
  ActionEditor,
  CanvasNode,
  InitialEditor,
  NodeData,
} from "@/app/projects/test/_providers/editor/config";
import { ToolboxItem } from "@/app/projects/test/_components/layout/toolbox";
import { actionEditor, initialEditor } from "@/app/projects/test/_providers/editor/reducer";
import { NodeStatus } from "@/app/projects/test/_components/canvas/nodes/base/config";

export type EditorStateContextValue = {
  state: InitialEditor;
  query: ReturnType<typeof editorQueries>;
};

export type EditorActionContextValue = {
  action: ReturnType<typeof editorActions>;
};

export const EditorStateContext = createContext<EditorStateContextValue | undefined>(undefined);
export const EditorActionContext = createContext<EditorActionContextValue | undefined>(undefined);

function editorActions(dispatch: React.Dispatch<ActionEditor>) {
  return {
    selectTool: (toolId: ToolboxItem["id"]) => dispatch({ type: "SELECT_TOOL", payload: toolId }),

    patchBadge: (nodeId: string, method: "CREATE" | "DELETE", badge: string) =>
      dispatch({ type: "PATCH_BADGE", payload: { nodeId, method, badge } }),

    createNode: (type: CanvasNode["type"]) => dispatch({ type: "CREATE_NODE", payload: type }),

    changeNode: (changes: NodeChange<CanvasNode>[]) =>
      dispatch({ type: "CHANGE_NODE", payload: changes }),

    patchNodeBranding: (nodeId: string, label: string, icon: LucideIcon) =>
      dispatch({ type: "PATCH_NODE_BRANDING", payload: { id: nodeId, label, icon } }),

    patchNodeConfig: (nodeId: string, key: string, value: unknown) =>
      dispatch({ type: "PATCH_NODE_CONFIG", payload: { id: nodeId, key, value } }),

    patchNodeExecution: (
      nodeId: string,
      status: NodeStatus,
      duration: number = 0,
      output?: NodeData["output"],
    ) =>
      dispatch({
        type: "PATCH_NODE_EXECUTION",
        payload: { id: nodeId, runtime: { status, duration }, output },
      }),

    deleteNode: (nodeId: string) => dispatch({ type: "DELETE_NODE", payload: nodeId }),

    createEdge: (connection: Connection) => dispatch({ type: "CREATE_EDGE", payload: connection }),

    changeEdge: (changes: EdgeChange<CanvasEdge>[]) =>
      dispatch({ type: "CHANGE_EDGE", payload: changes }),

    patchEdgeExecution: (edgeId: string, status: EdgeStatus) =>
      dispatch({ type: "PATCH_EDGE_EXECUTION", payload: { id: edgeId, status } }),

    deleteEdge: (edgeId: string) => dispatch({ type: "DELETE_EDGE", payload: edgeId }),
  };
}

function editorQueries(nodes: CanvasNode[]) {
  const selectedNodes = nodes.filter((node) => node.selected);

  return {
    activeNode: selectedNodes.length === 1 ? selectedNodes[0] : undefined,
    selectionCount: selectedNodes.length,
  };
}

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(actionEditor, initialEditor);

  const action = useMemo(() => editorActions(dispatch), [dispatch]);
  const query = useMemo(() => editorQueries(state.nodes), [state.nodes]);

  const actionValue = useMemo<EditorActionContextValue>(() => ({ action }), [action]);
  const stateValue = useMemo<EditorStateContextValue>(() => ({ state, query }), [state, query]);

  return (
    <EditorActionContext.Provider value={actionValue}>
      <EditorStateContext.Provider value={stateValue}>{children}</EditorStateContext.Provider>
    </EditorActionContext.Provider>
  );
}
