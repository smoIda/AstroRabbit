import { Info } from "lucide-react";

import { ConfigFieldMeta, OutputFieldMeta } from "@/app/projects/test/_components/canvas/config";

type Title = {
  label: string;
  hasData?: boolean;
  info?: string;
};

export function Title({ label, hasData, info }: Title) {
  return (
    <div className="text-ink flex items-center justify-between">
      <span className="text-xs font-semibold">{label}</span>

      {!hasData && info && (
        <div className="text-ink-soft flex items-center justify-center gap-x-2">
          <span className="text-xs">{info}</span>

          <Info size={12} />
        </div>
      )}
    </div>
  );
}

const DATA_TYPE: Record<ConfigFieldMeta["widget"] | OutputFieldMeta["widget"], string> = {
  SELECT: "enum",
  TABLE: "table",
  RECORD: "object",
  TEXT: "string",
  NUMBER: "number",
  JSON: "json",
  BOOLEAN: "boolean",
  NONE: "",
};

export function WidgetType({
  type,
}: {
  type: ConfigFieldMeta["widget"] | OutputFieldMeta["widget"];
}) {
  return <span className="text-ink-soft absolute -top-6 right-0 text-xs">{DATA_TYPE[type]}</span>;
}
