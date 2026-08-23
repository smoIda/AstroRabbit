"use client";

import { createContext, useMemo, useReducer } from "react";

import { Connection, EdgeChange, NodeChange } from "@xyflow/react";

import { CanvasEdge, EdgeStatus } from "@/app/projects/test/_components/canvas/edges/config";
import {
  ActionEditor,
  CanvasNode,
  DeepPartial,
  InitialEditor,
  NodeData,
} from "@/app/projects/test/_providers/editor/config";
import { ToolboxItem } from "@/app/projects/test/_components/layout/toolbox";
import { NodeStatus } from "@/app/projects/test/_components/canvas/nodes/base/config";
import { actionEditor, initialEditor } from "@/app/projects/test/_providers/editor/reducer";

export type EditorContextValue = {
  state: InitialEditor;
  action: ReturnType<typeof EditorDispatch>;
};

export const EditorContext = createContext<EditorContextValue | undefined>(undefined);

function EditorDispatch(dispatch: React.Dispatch<ActionEditor>) {
  return {
    selectTool: (toolId: ToolboxItem["id"]) => dispatch({ type: "SELECT_TOOL", payload: toolId }),

    setBadge: (nodeId: string, method: "CREATE" | "DELETE", badge: string) =>
      dispatch({
        type: "SET_BADGE",
        payload: { nodeId, method, badge },
      }),

    createNode: (type: CanvasNode["type"]) => dispatch({ type: "CREATE_NODE", payload: type }),

    changeNode: (changes: NodeChange<CanvasNode>[]) =>
      dispatch({
        type: "CHANGE_NODE",
        payload: changes,
      }),

    setNode: (
      nodeId: string,
      status: NodeStatus,
      duration?: number,
      output?: DeepPartial<NodeData["output"]>,
    ) =>
      dispatch({
        type: "SET_NODE",
        payload: {
          id: nodeId,
          data: {
            runtime: { status, duration: duration ?? 0 },

            output,
          },
        },
      }),

    deleteNode: (nodeId: string) => dispatch({ type: "DELETE_NODE", payload: nodeId }),

    createEdge: (connection: Connection) => dispatch({ type: "CREATE_EDGE", payload: connection }),

    changeEdge: (changes: EdgeChange<CanvasEdge>[]) =>
      dispatch({ type: "CHANGE_EDGE", payload: changes }),

    setEdge: (edgeId: string, status: EdgeStatus) =>
      dispatch({ type: "SET_EDGE", payload: { id: edgeId, status } }),

    deleteEdge: (edgeId: string) => dispatch({ type: "DELETE_EDGE", payload: edgeId }),
  };
}

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(actionEditor, initialEditor);

  const action = useMemo(() => EditorDispatch(dispatch), [dispatch]);

  const values = useMemo(
    () => ({
      state,
      action,
    }),
    [state, action],
  );

  return <EditorContext.Provider value={values}>{children}</EditorContext.Provider>;
}
