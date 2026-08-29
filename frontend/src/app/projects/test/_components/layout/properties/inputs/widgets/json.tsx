import { Widget } from "@/app/projects/test/_components/layout/properties/inputs/config";
import { Badge } from "@/components/ui/primitives/badge";
import { Button } from "@/components/ui/primitives/button";
import { Check, Copy, Sparkles } from "lucide-react";
import { useState } from "react";

export function JsonInput({ value, onChange }: Widget["JSON"]) {
  const [copied, setCopied] = useState(false);

  const onFormat = () => {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
    } catch {
      console.log("Invalid JSON format");
    }
  };

  const onCopy = () => {
    navigator.clipboard.writeText(value);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const lineCount = value ? value.split("\n").length : 1;

  return (
    <div className="group bg-ink-soft/5 border-ink relative focus-within:border">
      <Button
        variant="no-brackets"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();

          onFormat();
        }}
        className="hover:bg-ink-soft/5 absolute -top-8 right-8 p-1"
        title="Prettify JSON"
      >
        <Sparkles size={16} />
      </Button>

      <Button
        variant="no-brackets"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();

          onCopy();
        }}
        className="hover:bg-ink-soft/5 absolute -top-8 right-0 p-1"
        title="Copy Code"
      >
        {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
      </Button>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="JSON..."
        spellCheck={false}
        className="size-full max-h-80 min-h-40 resize-none overflow-y-auto p-2 outline-none"
      />
    </div>
  );
}
