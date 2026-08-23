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
import { handleConfig } from "@/app/projects/test/_components/canvas/nodes/base/config";

export function Canvas() {
  const { getNode } = useReactFlow();
  const { state, action } = useEditor();

  const onNodesChange = (changes: NodeChange<CanvasNode>[]) =>
    action.changeNode(changes);

  const onNodesDelete = (nodes: CanvasNode[]) =>
    nodes.forEach((node) => action.deleteNode(node.id));

  const onConnect = (connection: Connection) => action.createEdge(connection);

  const onEdgesChange = (changes: EdgeChange<CanvasEdge>[]) =>
    action.changeEdge(changes);

  const onEdgesDelete = (edge: CanvasEdge[]) =>
    edge.forEach((edge) => action.deleteEdge(edge.id));

  const isValidConnection = useCallback(
    (edgeOrConnection: Connection | Edge) => {
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
    },
    [state.nodes, state.edges, getNode],
  );

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
    </ReactFlow>
  );
}
