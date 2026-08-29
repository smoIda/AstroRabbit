import { Info } from "lucide-react";

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
