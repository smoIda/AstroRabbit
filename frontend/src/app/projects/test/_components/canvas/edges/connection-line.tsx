import { ConnectionLineComponentProps, getSmoothStepPath } from "@xyflow/react";

export function CustomConnectionLine({
  fromX,
  fromY,
  toX,
  toY,
  fromPosition,
  toPosition,
}: ConnectionLineComponentProps) {
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
        strokeWidth={1.5}
        className="animated"
        d={edgePath}
      />
    </g>
  );
}
