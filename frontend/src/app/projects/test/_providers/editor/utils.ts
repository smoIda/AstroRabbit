import {
  CanvasNode,
  DeepPartial,
} from "@/app/projects/test/_providers/editor/config";

export function modifyNodeData<T extends CanvasNode>(
  node: T,
  data: DeepPartial<T["data"]>,
): T {
  return {
    ...node,
    data: {
      ...node.data,
      ...data,
    },
  };
}

export function modifyNodeBadge<T extends CanvasNode>(
  method: "CREATE" | "DELETE",
  node: T,
  badge: string,
): T {
  switch (method) {
    case "CREATE":
      return {
        ...node,
        data: {
          ...node.data,
          badge: Array.from(
            new Set(
              [...node.data.badge.map((b) => b.trim()), badge.trim()].filter(
                Boolean,
              ),
            ),
          ),
        },
      };

    case "DELETE":
      return {
        ...node,
        data: {
          ...node.data,
          badge: node.data.badge.filter((b) => b !== badge),
        },
      };

    default:
      return node;
  }
}
