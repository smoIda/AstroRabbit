import { EdgeTypes, Edge } from "@xyflow/react";

import { Sharp } from "@/app/projects/test/_components/canvas/edges/sharp";

export const edgeTypes: EdgeTypes = {
  SHARP: Sharp,
};

export type EdgeStatus = "IDLE" | "RUNNING" | "FINISHED" | "SKIPPED";

export type CanvasEdge = Edge<{ status: EdgeStatus }>;
