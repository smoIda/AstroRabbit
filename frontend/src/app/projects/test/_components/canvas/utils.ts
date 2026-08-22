import { SETTINGS } from "@/app/projects/test/_components/canvas/config";
import { CanvasNode } from "@/app/projects/test/_providers/editor/config";

export function generateHandle(type: CanvasNode["type"]) {
  const sources = Array<"source">(SETTINGS[type].maxOutgoingEdges).fill(
    "source",
  );
  const targets = Array<"target">(SETTINGS[type].maxIncomingEdges).fill(
    "target",
  );

  return [...sources, ...targets];
}
