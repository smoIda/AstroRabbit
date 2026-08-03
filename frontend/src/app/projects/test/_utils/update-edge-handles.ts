import { Edge } from "@xyflow/react";

import { EditorNodeProps } from "@/app/projects/test/_components/canvas/config";
import { getConnectionHandles } from "./get-connection-handles";

export function updateEdgeHandles(
  nodes: EditorNodeProps[],
  edges: Edge[],
): Edge[] {
  return edges.map((edge) => {
    const source = nodes.find((node) => node.id === edge.source);

    const target = nodes.find((node) => node.id === edge.target);

    if (!source || !target) {
      return edge;
    }

    const handles = getConnectionHandles(source, target);

    return {
      ...edge,
      sourceHandle: handles.sourceHandle,
      targetHandle: handles.targetHandle,
    };
  });
}
