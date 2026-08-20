import {
  ConnectionLineComponentProps,
  getSmoothStepPath,
  Position,
} from "@xyflow/react";

export function CustomConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
}: ConnectionLineComponentProps) {
  const OFFSET = 8;

  switch (fromPosition) {
    case Position.Left:
      fromX -= OFFSET;
      toX += OFFSET;
      break;

    case Position.Right:
      fromX += OFFSET;
      toX -= OFFSET;
      break;
  }

  const [edgePath] = getSmoothStepPath({
    sourceX: fromX,
    sourceY: fromY,
    sourcePosition: fromPosition,
    targetX: toX,
    targetY: toY,
    targetPosition: toPosition,
    borderRadius: 0,
    offset: 20,
  });

  return (
    <g>
      <path
        fill="none"
        stroke="#a1a1aa"
        strokeWidth={2}
        className="animated"
        d={edgePath}
      />
    </g>
  );
}
