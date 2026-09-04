import { useEffect, useState } from "react";

type NodeLabel = {
  label: string;
  isRenaming: boolean;
  onRenamingChange: (value: boolean) => void;
  onChange: (value: string) => void;
};

export function NodeLabel({ label, isRenaming, onRenamingChange, onChange }: NodeLabel) {
  const [draft, setDraft] = useState(label);

  useEffect(() => setDraft(label), [label]);

  const onStart = (e: React.MouseEvent) => {
    e.stopPropagation();

    setDraft(label);
    onRenamingChange(true);
  };

  const onCommit = () => {
    if (draft.trim().length === 0) setDraft(label);
    else if (draft.trim() !== label) onChange(draft.trim());

    onRenamingChange(false);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation();

    if (e.key === "Enter") onCommit();

    if (e.key === "Escape") {
      setDraft(label);
      onRenamingChange(false);
    }
  };

  return isRenaming ? (
    <input
      type="text"
      value={draft}
      maxLength={50}
      placeholder="Node name"
      autoFocus
      onChange={(e) => setDraft(e.target.value)}
      onBlur={onCommit}
      onKeyDown={onKeyDown}
      className="text-ink nopan nodrag mb-1 w-full border-b text-lg font-semibold outline-none"
    />
  ) : (
    <span
      title={label}
      onDoubleClick={(e) => onStart(e)}
      className="text-ink truncate text-lg font-semibold"
    >
      {label}
    </span>
  );
}
