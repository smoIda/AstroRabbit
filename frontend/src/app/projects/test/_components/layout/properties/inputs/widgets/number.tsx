import { useEffect, useState } from "react";

import {
  fieldClasses,
  Widget,
} from "@/app/projects/test/_components/layout/properties/inputs/config";
import { WidgetType } from "@/app/projects/test/_components/layout/properties/misc";

import { cn } from "@/lib/utils/cn";

export function NumberInput({ value, onChange }: Widget["NUMBER"]) {
  const [number, setNumber] = useState(String(value));

  useEffect(() => setNumber(String(value)), [value]);

  return (
    <div className="group relative flex items-center justify-center">
      <input
        placeholder="Value"
        type="number"
        inputMode="decimal"
        value={number}
        onChange={(e) => {
          setNumber(e.target.value);

          if (e.target.value !== "" && Number.isFinite(Number(e.target.value)))
            onChange(Number(e.target.value));
        }}
        className={cn(
          fieldClasses,
          "[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
        )}
      />

      <WidgetType type="NUMBER" />
    </div>
  );
}
