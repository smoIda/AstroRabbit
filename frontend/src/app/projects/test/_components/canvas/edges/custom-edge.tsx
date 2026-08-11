import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react";

import { useEditor } from "@/app/projects/test/_hooks/use-editor";
import { useExecutor } from "@/app/projects/test/_hooks/use-executor";
import { cn } from "@/lib/utils/cn";

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  markerEnd,
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

  const { state } = useEditor();
  const { edgeStatus } = useExecutor();

  return (
    <BaseEdge
      className={cn(
        "stroke-ink-soft",
        edgeStatus[id] === "RUNNING" && "stroke-green-300",
        edgeStatus[id] === "FINISHED" && "stroke-accent-ink",
      )}
      id={id}
      path={edgePath}
      markerEnd={markerEnd}
    />
  );
}
