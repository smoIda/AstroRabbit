"use client";

import { useCallback } from "react";

import {
  Background,
  BackgroundVariant,
  Connection,
  ConnectionMode,
  Edge,
  EdgeChange,
  getOutgoers,
  Node,
  NodeChange,
  ReactFlow,
  SelectionMode,
  useReactFlow,
} from "@xyflow/react";

import {
  CanvasNode,
  nodeTypes,
} from "@/app/projects/test/_providers/editor/config";
import { useEditor } from "@/app/projects/test/_hooks/use-editor";
import {
  CanvasEdge,
  edgeTypes,
} from "@/app/projects/test/_components/canvas/edges/config";
import { CustomConnectionLine } from "@/app/projects/test/_components/canvas/edges/connection-line";
import "@/app/projects/test/_components/canvas/config.css";
import { useExecutor } from "@/app/projects/test/_hooks/use-executor";
import { handleConfig } from "@/app/projects/test/_components/canvas/nodes/base/config";

export function Canvas() {
  const { state, dispatch } = useEditor();
  const { state: abc } = useExecutor();

  const { getNode } = useReactFlow();

  const onNodesChange = useCallback(
    (changes: NodeChange<CanvasNode>[]) => {
      dispatch({
        type: "CHANGE_NODE",
        payload: changes,
      });
    },
    [dispatch],
  );

  const onNodesDelete = useCallback(
    (nodes: CanvasNode[]) => {
      nodes.forEach((node) => {
        dispatch({ type: "DELETE_NODE", payload: node.id });
      });
    },
    [dispatch],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange<CanvasEdge>[]) => {
      dispatch({
        type: "CHANGE_EDGE",
        payload: changes,
      });
    },
    [dispatch],
  );

  const onEdgesDelete = useCallback(
    (edge: CanvasEdge[]) => {
      edge.forEach((edge) => {
        dispatch({ type: "DELETE_EDGE", payload: edge.id });
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

  const isValidConnection = (edgeOrConnection: Connection | Edge) => {
    const { source, target, targetHandle } = edgeOrConnection;

    if (source === target) return false;

    // Hinders multiple edges between 2 nodes
    const hasNodePairDuplicate = state.edges.some(
      (e) => e.source === source && e.target === target,
    );
    if (hasNodePairDuplicate) return false;

    // Handle's isConnectable only controls direct UI interaction, it doesn't account for graph state or connection limits.
    if (targetHandle) {
      const targetConnections = state.edges.filter(
        (e) => e.target === target && e.targetHandle === targetHandle,
      );

      if (targetConnections.length >= handleConfig.MAX_CONNECTIONS)
        return false;
    }

    const sourceNode = getNode(source);
    const targetNode = getNode(target);

    if (!targetNode || !sourceNode) return false;

    // Hinders Node A -> Node B -> Node C -> Node A
    const edges = state.edges;
    const nodes = state.nodes;

    const hasCycle = (node: Node, visited = new Set<string>()): boolean => {
      if (visited.has(node.id)) return false;
      visited.add(node.id);

      if (node.id === source) return true;

      const outgoers = getOutgoers(node, nodes, edges);
      return outgoers.some((outgoer) => hasCycle(outgoer, visited));
    };

    return !hasCycle(targetNode);
  };

  return (
    <ReactFlow
      tabIndex={0}

      nodes={state.nodes}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onNodesDelete={onNodesDelete}

      edges={state.edges}
      edgeTypes={edgeTypes}
      onEdgesChange={onEdgesChange}
      onEdgesDelete={onEdgesDelete}

      connectionLineComponent={CustomConnectionLine}

      onConnect={onConnect}
      isValidConnection={isValidConnection}

      deleteKeyCode={["Backspace", "Delete"]}

      panOnScroll
      selectionOnDrag
      panOnDrag={false}

      selectionMode={SelectionMode.Partial}
      connectionMode={ConnectionMode.Strict}

      fitView
      proOptions={{ hideAttribution: true }}
    >
      <Background
        color="#5f5f6440"
        variant={BackgroundVariant.Cross}
        gap={40}
      />

      <span className="absolute top-10 left-10 text-2xl text-red-500">
        {abc.error}
      </span>
    </ReactFlow>
  );
}
