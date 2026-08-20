import { Node } from "@xyflow/react";

import { Base } from "@/app/projects/test/_components/canvas/nodes/base/config";

export type DatabaseData = Base & {
  config: {
    database: "MongoDB" | "PostgreSQL" | "MySQL";
  };

  output: {
    body: unknown;
  };
};

export type Database = Node<DatabaseData, "DATABASE">;
