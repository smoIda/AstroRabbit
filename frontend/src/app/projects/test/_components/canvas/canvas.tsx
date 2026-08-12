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
  NodeData,
  nodeTypes,
} from "@/app/projects/test/_components/canvas/nodes/config";
import { useEditor } from "@/app/projects/test/_hooks/use-editor";
import { edgeTypes } from "@/app/projects/test/_components/canvas/edges/config";
import { CustomConnectionLine } from "@/app/projects/test/_components/canvas/edges/connection-line";

import "@/app/projects/test/_components/canvas/config.css";

export function Canvas() {
  const { state, dispatch } = useEditor();

  const onNodesChange = useCallback(
    (changes: NodeChange<NodeData>[]) => {
      dispatch({
        type: "CHANGE_NODE",
        payload: changes,
      });
    },
    [dispatch],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      dispatch({
        type: "CHANGE_EDGE",
        payload: changes,
      });
    },
    [dispatch],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      dispatch({
        type: "CREATE_EDGE",
        payload: connection,
      });
    },
    [dispatch],
  );

  return (
    <div className="size-full p-0">
      <ReactFlow
        nodes={state.nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}

        edges={state.edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}

        onConnect={onConnect}
        connectionLineComponent={CustomConnectionLine}

        panOnScroll
        selectionOnDrag
        panOnDrag={false}

        selectionMode={SelectionMode.Partial}
        connectionMode={ConnectionMode.Strict}

        minZoom={1}
        maxZoom={1}

        fitView
        proOptions={{ hideAttribution: true }}
      />
    </div>
  );
}
