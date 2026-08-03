import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react";

export function SharpEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
  style,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 0,
    offset: 20,
  });

  return <BaseEdge id={id} path={edgePath} markerEnd={markerEnd} style={style} />;
}