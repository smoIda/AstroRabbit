import { useEffect, useState } from "react";

import { Ban, Check, Copy, Sparkles } from "lucide-react";

import { Widget } from "@/app/projects/test/_components/layout/properties/inputs/config";
import { WidgetType } from "@/app/projects/test/_components/layout/properties/misc";

import { Button } from "@/components/ui/primitives/button";

type PRETTIFY_STATUS = "IDLE" | "FINISHED" | "ERROR";

const PRETTIFY_ICONS: Record<PRETTIFY_STATUS, React.ReactNode> = {
  IDLE: <Sparkles size={16} />,
  FINISHED: <Check size={16} className="text-emerald-600" />,
  ERROR: <Ban size={16} className="text-red-600" />,
};

export function JsonInput({ value, onChange }: Widget["JSON"]) {
  const [text, setText] = useState(value);
  const [copied, setCopied] = useState(false);
  const [prettified, setPrettified] = useState<PRETTIFY_STATUS>("IDLE");

  const onFormat = () => {
    try {
      const parsed = JSON.parse(value);

      setText(JSON.stringify(parsed, null, 2));
      onChange(JSON.stringify(parsed, null, 2));

      setPrettified("FINISHED");
      setTimeout(() => setPrettified("IDLE"), 2000);
    } catch {
      console.log("Invalid JSON format - Cannot prettify");

      setPrettified("ERROR");
      setTimeout(() => setPrettified("IDLE"), 2000);
    }
  };

  const onCopy = () => {
    navigator.clipboard.writeText(value);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => setText(value), [value]);

  return (
    <div className="group bg-ink-soft/5 outline-ink relative focus-within:outline">
      <Button
        variant="no-brackets"
        size="icon"
        aria-label="Prettify JSON"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onFormat}
        className="bg-ink/5 hover:text-accent-ink group-focus-within:border-ink absolute top-0 right-0 border-l border-transparent p-1"
        title="Prettify JSON"
      >
        {PRETTIFY_ICONS[prettified]}
      </Button>

      <Button
        variant="no-brackets"
        size="icon"
        aria-label="Copy JSON"
        onMouseDown={(e) => e.preventDefault()}
        onClick={onCopy}
        className="bg-ink/5 hover:text-accent-ink group-focus-within:border-ink absolute top-6 right-0 border border-t-0 border-r-0 border-transparent p-1"
        title="Copy Code"
      >
        {copied ? <Check size={16} className="text-emerald-600" /> : <Copy size={16} />}
      </Button>

      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="JSON..."
        spellCheck={false}
        className="custom-scroll field-sizing-content size-full max-h-80 min-h-20 resize-none overflow-y-auto p-2 pr-6 outline-none"
      />

      <WidgetType type="JSON" />
    </div>
  );
}
