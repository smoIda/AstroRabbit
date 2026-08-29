import { Node } from "@xyflow/react";

import z from "zod";

import { Base } from "@/app/projects/test/_components/canvas/nodes/base/config";
import { withMeta } from "@/app/projects/test/_components/canvas/utils";

const config = z.object({
  database: withMeta(z.enum(["MongoDB", "PostgreSQL", "MySQL"]), { widget: "SELECT" }),
});

const output = z.object({
  body: z.unknown(),
});

export const DATABASE_SCHEMAS = {
  CONFIG: config,
  OUTPUT: output,
} as const;

export type DatabaseData = Base<z.infer<typeof config>, z.infer<typeof output>>;

export type Database = Node<DatabaseData, "DATABASE">;
