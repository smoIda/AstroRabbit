import { useEffect, useRef, useState } from "react";

import { CheckCheck, ChevronDown } from "lucide-react";

import { ConfigWidget } from "@/app/projects/test/_components/layout/properties/inputs/config";
import { WidgetType } from "@/app/projects/test/_components/layout/properties/misc";

import { Button } from "@/components/ui/primitives/button";

import { cn } from "@/lib/utils/cn";
import { formatText } from "@/lib/utils/formatText";

export function SelectInput({ value, options, onChange }: ConfigWidget["SELECT"]) {
  const [isOpen, setIsOpen] = useState(false);
  const [chosen, setChosen] = useState(value);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onBlur = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setIsOpen(false);
    };

    document.addEventListener("mousedown", onBlur);

    return () => document.removeEventListener("mousedown", onBlur);
  }, []);

  useEffect(() => setChosen(value), [value]);

  return (
    <div ref={dropdownRef} className="relative">
      <Button
        onClick={() => setIsOpen((prev) => !prev)}
        size="md"
        className="bg-ink-soft/5 text-ink w-full justify-between py-2 hover:outline focus:outline"
      >
        <span>{formatText(chosen)}</span>

        <ChevronDown size={16} className={cn("transition-[rotate]", isOpen && "rotate-180")} />
      </Button>

      {isOpen && (
        <ul className="absolute z-10 mt-px max-h-60 w-full overflow-auto bg-white shadow-lg outline focus:outline-none">
          {options.map((option) => (
            <li
              tabIndex={0}
              key={option}
              onClick={() => {
                setChosen(option);
                onChange(option);
                setIsOpen(false);
              }}
              className="hover:bg-ink-soft/5 flex cursor-pointer items-center justify-between p-2"
            >
              <span className={option === chosen ? "text-accent-ink font-bold" : "text-ink"}>
                {formatText(option)}
              </span>

              {option === chosen && <CheckCheck size={16} className="text-accent-ink" />}
            </li>
          ))}
        </ul>
      )}

      <WidgetType type="SELECT" />
    </div>
  );
}
