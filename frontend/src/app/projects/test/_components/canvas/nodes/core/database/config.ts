import { Node } from "@xyflow/react";

import z from "zod";

import { Base } from "@/app/projects/test/_components/canvas/nodes/base/config";
import { withConfigMeta, withOutputMeta } from "@/app/projects/test/_components/canvas/utils";

const config = z.object({
  database: withConfigMeta(z.enum(["MongoDB", "PostgreSQL", "MySQL"]).default("PostgreSQL"), {
    widget: "SELECT",
  }),
});

const output = z.object({
  body: withOutputMeta(z.unknown().default(null), { widget: "JSON" }),
});

export const DATABASE_SCHEMAS = {
  CONFIG: config,
  OUTPUT: output,
} as const;

export type DatabaseData = Base<z.infer<typeof config>, z.infer<typeof output>>;

export type Database = Node<DatabaseData, "DATABASE">;
