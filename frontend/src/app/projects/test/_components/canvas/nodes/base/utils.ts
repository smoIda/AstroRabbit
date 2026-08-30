import { nodeConfigRegistry, resolveConfigSchema } from "@/app/projects/test/_components/canvas/utils";
import { CanvasNode, NodeData } from "@/app/projects/test/_providers/editor/config";
import { CONFIG_SCHEMA_TYPES } from "@/app/projects/test/_components/canvas/config";

export function formatDuration(duration: number) {
  if (!Number.isFinite(duration) || duration <= 0) return "--";

  if (duration < 1) return `${Math.round(duration * 1000)}\u00A0ms`;

  return `${duration.toFixed(2)}\u00A0s`;
}

export function getVisibleConfigs(type: CanvasNode["type"], config: NodeData["config"]) {
  const entry = CONFIG_SCHEMA_TYPES[type];
  const schema = resolveConfigSchema(entry, config);
  const shape = schema?.shape

  return Object.entries(config).filter(([key]) => {
    if (!shape) return true;

    const fieldSchema = shape[key];

    if (!fieldSchema) return true;

    const meta = nodeConfigRegistry.get(fieldSchema);

    return !meta?.hiddenOnNode;
  });
}
