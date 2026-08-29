import z from "zod";

import { SETTINGS } from "@/app/projects/test/_components/canvas/config";
import { CanvasNode, NodeData } from "@/app/projects/test/_providers/editor/config";

export type ConfigFieldMeta = {
  widget: "SELECT" | "RECORD" | "TEXT" | "NUMBER" | "JSON";
  hiddenOnNode?: boolean
};

export const nodeConfigRegistry = z.registry<ConfigFieldMeta>();

export function withMeta<T extends z.ZodType>(schema: T, meta: ConfigFieldMeta) {
  nodeConfigRegistry.add(schema, meta);

  return schema;
}

export function generateHandle(type: CanvasNode["type"]) {
  const sources = Array<"source">(SETTINGS[type].maxOutgoingEdges).fill("source");
  const targets = Array<"target">(SETTINGS[type].maxIncomingEdges).fill("target");

  return [...sources, ...targets];
}

export function resolveConfigSchema(
  entry: z.ZodObject | Record<string, z.ZodObject> | undefined,
  config: NodeData["config"],
): z.ZodObject | undefined {
  if (!entry) return undefined;

  if (entry instanceof z.ZodObject) return entry;

  if ("provider" in config) return entry[String(config.provider)];

  return undefined;
}
