import { Edge } from "@xyflow/react";

import { EditorNodeProps } from "@/app/projects/test/_components/canvas/config";

export function getOutgoingEdges(
  nodeId: string,
  edges: Edge[],
) {
  return edges.filter(
    (edge) => edge.source === nodeId,
  );
}

export function getIncomingEdges(
  nodeId: string,
  edges: Edge[],
) {
  return edges.filter(
    (edge) => edge.target === nodeId,
  );
}

export function findRootNodes(
  nodes: EditorNodeProps[],
  edges: Edge[],
) {
  return nodes.filter(
    (node) =>
      getIncomingEdges(node.id, edges).length === 0,
  );
}