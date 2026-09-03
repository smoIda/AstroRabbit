import {
  nodeConfigRegistry,
  resolveConfigSchema,
} from "@/app/projects/test/_components/canvas/utils";
import { CanvasNode, NodeData } from "@/app/projects/test/_providers/editor/config";
import { CONFIG_SCHEMA_TYPES, SETTINGS } from "@/app/projects/test/_components/canvas/config";

export function formatDuration(duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) return "--";

  if (duration < 1) return `${Math.round(duration * 1000)}\u00A0ms`;

  return `${duration.toFixed(2)}\u00A0s`;
}

export function getVisibleConfigs(type: CanvasNode["type"], config: NodeData["config"]) {
  const schema = resolveConfigSchema(CONFIG_SCHEMA_TYPES[type], config);
  const shape = schema?.shape;

  if (!shape) return [];

  return Object.keys(shape)
    .filter((k) => {
      const fieldSchema = shape[k];

      if (!fieldSchema) return false;

      const meta = nodeConfigRegistry.get(fieldSchema);

      return !meta?.hiddenOnNode && !meta?.hiddenWhen(config);
    })
    .map((k) => [k, (config as Record<string, unknown>)[k]] as const);
}

export function generateHandle(type: CanvasNode["type"]) {
  const sources = Array<"source">(SETTINGS[type].maxOutgoingEdges).fill("source");
  const targets = Array<"target">(SETTINGS[type].maxIncomingEdges).fill("target");

  return [...sources, ...targets];
}
