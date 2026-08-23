import { NODE_DEFAULTS } from "@/app/projects/test/_components/canvas/config";
import {
  CanvasNode,
  DeepPartial,
} from "@/app/projects/test/_providers/editor/config";

type CreateNode<T> = T extends CanvasNode ? Omit<T, "id"> : never;

export function createNode<T extends CanvasNode>(
  type: T["type"],
): CreateNode<T> {
  return {
    type,
    position: { x: Math.random(), y: Math.random() },
    data: NODE_DEFAULTS[type],
  } as CreateNode<T>;
}

export function setBadge<T extends CanvasNode>(
  node: T,
  method: "CREATE" | "DELETE",
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

export function updateData<T extends CanvasNode>(
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
