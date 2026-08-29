import { useState } from "react";

import { nanoid } from "nanoid";

import { Plus, Trash2 } from "lucide-react";

import {
  inputClasses,
  Widget,
} from "@/app/projects/test/_components/layout/properties/inputs/config";
import { Button } from "@/components/ui/primitives/button";

type Row = {
  id: string;
  key: string;
  value: string;
};

export function RecordInput({ value, onChange }: Widget["RECORD"]) {
  const [rows, setRow] = useState<Row[]>(() =>
    Object.entries(value).map(([k, v]) => ({
      id: nanoid(),
      key: k,
      value: v,
    })),
  );

  const onCommit = (updatedRows: Row[]) => {
    setRow(updatedRows);

    const record = updatedRows.reduce<Record<string, string>>((acc, row) => {
      if (row.key.trim() !== "") acc[row.key] = row.value;

      return acc;
    }, {});

    onChange(record);
  };

  const onRowChange = (id: string, field: "key" | "value", value: string) => {
    const updated = rows.map((r) => (r.id === id ? { ...r, [field]: value } : r));

    onCommit(updated);
  };

  const onAddRow = () => onCommit([...rows, { id: nanoid(), key: "", value: "" }]);

  const onDeleteRow = (id: string) => onCommit(rows.filter((r) => r.id !== id));

  return (
    <>
      {rows.map((r) => {
        return (
          <div key={r.id} className="group flex items-center justify-center gap-x-2">
            <input
              placeholder="Key"
              value={r.key}
              onChange={(e) => onRowChange(r.id, "key", e.target.value)}
              className={inputClasses}
            />

            <input
              placeholder="Value"
              value={r.value}
              onChange={(e) => onRowChange(r.id, "value", e.target.value)}
              className={inputClasses}
            />

            <Button
              onClick={(e) => {
                e.stopPropagation();

                onDeleteRow(r.id);
              }}
              className="text-ink-soft hover:text-accent-ink bg-ink-soft/20 hover:bg-accent-ink/10 hidden cursor-pointer p-2 group-hover:block"
              size="icon"
              title="Delete row"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        );
      })}

      <Button
        onClick={() => onAddRow()}
        variant="no-brackets"
        size="md"
        className="border-ink/20 text-ink/40 hover:border-accent-ink hover:text-accent-ink flex w-full cursor-pointer items-center justify-center border border-dashed py-1 transition-all"
      >
        <Plus className="size-4" />
      </Button>
    </>
  );
}
