import { Info } from "lucide-react";

import { ConfigFieldMeta } from "@/app/projects/test/_components/canvas/utils";

type Title = {
  label: string;
  info?: string;
};

export function Title({ label, info }: Title) {
  return (
    <div title={info} className="flex items-center justify-between">
      <span className="text-ink text-xs font-semibold">{label}</span>

      {info && <Info size={16} className="text-ink" />}
    </div>
  );
}

const DATA_TYPE: Record<ConfigFieldMeta["widget"], string> = {
  SELECT: "enum",
  RECORD: "object",
  TEXT: "string",
  NUMBER: "number",
  JSON: "json",
};

export function WidgetType({ type }: { type: ConfigFieldMeta["widget"] }) {
  return <span className="absolute -top-5 right-0 text-xs">{DATA_TYPE[type]}</span>;
}
