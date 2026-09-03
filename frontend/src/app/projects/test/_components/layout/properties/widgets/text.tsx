import { useEffect, useState } from "react";

import { ConfigWidget } from "@/app/projects/test/_components/layout/properties/inputs/config";
import { OutputWidget } from "@/app/projects/test/_components/layout/properties/outputs/config";
import { WidgetType } from "@/app/projects/test/_components/layout/properties/misc";

export function TextInput({ value, onChange }: ConfigWidget["TEXT"]) {
  const [text, setText] = useState(value);

  useEffect(() => setText(value), [value]);

  return (
    <div className="group relative flex items-center justify-center">
      <input
        placeholder="Value"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value);
        }}
        className="bg-ink-soft/5 hover:outline text-ink w-full p-2 focus:outline"
      />

      <WidgetType type="TEXT" />
    </div>
  );
}

export function TextOutput({ value }: OutputWidget["TEXT"]) {
  return (
    <div className="bg-ink-soft/5 relative">
      <input className="text-ink p-2 outline-none" value={value} readOnly />

      <WidgetType type="TEXT" />
    </div>
  );
}
