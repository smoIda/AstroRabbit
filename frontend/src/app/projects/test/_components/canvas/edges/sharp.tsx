import { BaseEdge, EdgeProps, getSmoothStepPath } from "@xyflow/react";

import { useEditorState } from "@/app/projects/test/_hooks/use-editor";

import { cn } from "@/lib/utils/cn";

function randomOffset(id: string, min = 32, max = 64) {
  let hash = 0;

  for (let i = 0; i < id.length; i += 4) hash = id.charCodeAt(i) + ((hash << 5) - hash);

  const positiveHash = Math.abs(hash);

  return min + (positiveHash % (max - min + 1));
}

export function Sharp({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
}: EdgeProps) {
  const [edgePath] = getSmoothStepPath({
    sourceX: sourceX - 20,
    sourceY,
    sourcePosition,
    targetX: targetX + 20,
    targetY,
    targetPosition,
    borderRadius: 0,
    offset: randomOffset(id),
  });

  const { state: editorState } = useEditorState();

  const status = editorState.edges.find((edge) => edge.id === id)?.data?.status;

  const startMarkerId = `start-${id}`;
  const endMarkerId = `end-${id}`;

  const colorClass = cn(
    "stroke-ink fill-none stroke-2 transition-colors duration-200",
    status === "RUNNING" && "stroke-amber-400 [stroke-dasharray:8] animate-edge-running",
    status === "FINISHED" && "stroke-emerald-500",
    status === "SKIPPED" && "stroke-ink-soft/10",
  );

  const markerStrokeClass = cn(
    "stroke-ink fill-none",
    status === "RUNNING" && "stroke-amber-400",
    status === "FINISHED" && "stroke-emerald-500",
    status === "SKIPPED" && "stroke-ink-soft/10",
  );

  return (
    <>
      <svg className="absolute overflow-visible">
        <defs>
          <marker
            id={startMarkerId}
            viewBox="0 0 10 10"
            refX="5"
            refY="5"
            markerWidth="6"
            markerHeight="10"
            orient="auto-start-reverse"
          >
            <line
              x1="5"
              y1="1"
              x2="5"
              y2="9"
              className={markerStrokeClass}
              strokeWidth="2"
              strokeLinecap="square"
            />
          </marker>

          <marker
            id={endMarkerId}
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path
              d="M 1 2 L 6 5 L 1 8"
              className={markerStrokeClass}
              strokeWidth="2"
              strokeLinecap="square"
            />
          </marker>
        </defs>
      </svg>

      <BaseEdge
        id={id}
        path={edgePath}
        markerStart={`url(#${startMarkerId})`}
        markerEnd={`url(#${endMarkerId})`}
        className={colorClass}
      />
    </>
  );
}
