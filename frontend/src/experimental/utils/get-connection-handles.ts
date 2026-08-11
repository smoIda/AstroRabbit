import { Node } from "@xyflow/react";

type HandleDirection = "top" | "right" | "bottom" | "left";

type ConnectionHandles = {
  sourceHandle: `${HandleDirection}-source`;
  targetHandle: `${HandleDirection}-target`;
};

export function getConnectionHandles(
  source: Node & { data?: any },
  target: Node & { data?: any },
): ConnectionHandles | null {
  if (
    source.measured?.width == null ||
    source.measured?.height == null ||
    target.measured?.width == null ||
    target.measured?.height == null
  ) {
    return null;
  }

  const dx = target.position.x - source.position.x;
  const dy = target.position.y - source.position.y;

  if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
    return null;
  }

  let preferred: ConnectionHandles;

  if (Math.abs(dx) > Math.abs(dy)) {
    preferred =
      dx > 0
        ? { sourceHandle: "right-source", targetHandle: "left-target" }
        : { sourceHandle: "left-source", targetHandle: "right-target" };
  } else {
    preferred =
      dy > 0
        ? { sourceHandle: "bottom-source", targetHandle: "top-target" }
        : { sourceHandle: "top-source", targetHandle: "bottom-target" };
  }

  return preferred;
}
