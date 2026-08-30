import { useEffect, useState } from "react";

import {
  fieldClasses,
  Widget,
} from "@/app/projects/test/_components/layout/properties/inputs/config";
import { WidgetType } from "@/app/projects/test/_components/layout/properties/misc";

export function TextInput({ value, onChange }: Widget["TEXT"]) {
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
        className={fieldClasses}
      />

      <WidgetType type="TEXT" />
    </div>
  );
}
