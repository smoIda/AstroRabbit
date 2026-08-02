"use client";

import { useCallback } from "react";

import {
  Connection,
  ConnectionMode,
  Edge,
  EdgeChange,
  NodeChange,
  ReactFlow,
  SelectionMode,
} from "@xyflow/react";

import {
  edgeTypes,
  EditorNodeProps,
  nodeTypes,
} from "@/app/projects/test/_components/canvas/config";
import { useEditor } from "@/app/projects/test/_hooks/use-editor";
import "@/app/projects/test/_components/canvas/config.css";

export function Canvas() {
  const { state, dispatch } = useEditor();

  const onNodesChange = useCallback(
    (changes: NodeChange<EditorNodeProps>[]) =>
      dispatch({
        type: "CHANGE_NODE",
        payload: changes,
      }),
    [dispatch],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) =>
      dispatch({
        type: "CHANGE_EDGE",
        payload: changes,
      }),
    [dispatch],
  );

  const onConnect = useCallback(
    (connection: Connection) =>
      dispatch({
        type: "CREATE_EDGE",
        payload: connection,
      }),
    [dispatch],
  );

  return (
    <div className="absolute inset-0 p-0">
      <ReactFlow
        nodes={state.nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}

        edges={state.edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}

        onConnect={onConnect}

        panOnScroll
        selectionOnDrag
        panOnDrag={false}
        selectionMode={SelectionMode.Partial}
        connectionMode={ConnectionMode.Strict}

        fitView
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
}
