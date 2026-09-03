import { useEffect, useState } from "react";

import { ConfigWidget } from "@/app/projects/test/_components/layout/properties/inputs/config";
import { OutputWidget } from "@/app/projects/test/_components/layout/properties/outputs/config";
import { WidgetType } from "@/app/projects/test/_components/layout/properties/misc";

import { cn } from "@/lib/utils/cn";

export function NumberInput({ value, onChange }: ConfigWidget["NUMBER"]) {
  const [number, setNumber] = useState(String(value));

  useEffect(() => {
    if (Number(number) === value) return;

    setNumber(String(value));
  }, [value]);

  return (
    <div className="group relative flex items-center justify-center">
      <input
        placeholder="Value"
        type="number"
        inputMode="decimal"
        value={number}
        onChange={(e) => {
          const val = e.target.value;

          setNumber(val);

          if (val === "") return;
          if (Number.isFinite(Number(val))) onChange(Number(val));
        }}
        className={cn(
          "bg-ink-soft/5 text-ink min-w-20 flex-1 p-2",
          "hover:outline focus:outline",
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        )}
      />

      <WidgetType type="NUMBER" />
    </div>
  );
}

export function NumberOutput({ value }: OutputWidget["NUMBER"]) {
  return (
    <div className="bg-ink-soft/5 relative">
      <input
        tabIndex={-1}
        className="text-ink p-2 outline-none select-all"
        value={value}
        readOnly
      />

      <WidgetType type="TEXT" />
    </div>
  );
}
