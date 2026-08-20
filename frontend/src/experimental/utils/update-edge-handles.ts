import { Edge } from "@xyflow/react";
import { EditorNodeProps } from "@/app/projects/test/_components/canvas/nodes/config";
import { getConnectionHandles } from "@/experimental/utils/get-connection-handles";

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

    if (!handles) {
      return edge;
    }

    return {
      ...edge,
      sourceHandle: handles.sourceHandle ?? edge.sourceHandle,
      targetHandle: handles.targetHandle ?? edge.targetHandle,
    };
  });
}
