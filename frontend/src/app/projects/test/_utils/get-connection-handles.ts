import { Node } from "@xyflow/react";

type HandleDirection = "top" | "right" | "bottom" | "left";

type ConnectionHandles = {
  sourceHandle: `${HandleDirection}-source`;
  targetHandle: `${HandleDirection}-target`;
};

export function getConnectionHandles(
  source: Node,
  target: Node,
): ConnectionHandles {
  const dx = target.position.x - source.position.x;
  const dy = target.position.y - source.position.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      return {
        sourceHandle: "right-source",
        targetHandle: "left-target",
      };
    }

    return {
      sourceHandle: "left-source",
      targetHandle: "right-target",
    };
  }

  if (dy > 0) {
    return {
      sourceHandle: "bottom-source",
      targetHandle: "top-target",
    };
  }

  return {
    sourceHandle: "top-source",
    targetHandle: "bottom-target",
  };
}