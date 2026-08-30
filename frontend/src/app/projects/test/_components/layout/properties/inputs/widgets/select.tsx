import { useEffect, useRef, useState } from "react";

import { Check, ChevronDown } from "lucide-react";

import { Widget } from "@/app/projects/test/_components/layout/properties/inputs/config";
import { WidgetType } from "@/app/projects/test/_components/layout/properties/misc";

import { Button } from "@/components/ui/primitives/button";

import { cn } from "@/lib/utils/cn";

export function SelectInput({ options, onChange }: Widget["SELECT"]) {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      <Button
        variant="no-brackets"
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-ink-soft/5 w-full justify-between py-2 focus:border"
      >
        <span>{options}</span>

        <ChevronDown size={16} className={cn("transition-[rotate]", isOpen && "rotate-180")} />
      </Button>

      {isOpen && (
        <ul className="absolute z-50 mt-1 max-h-60 w-full overflow-auto border border-neutral-200 bg-white shadow-lg focus:outline-none">
          {options.map((option) => (
            <li
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className="flex cursor-pointer items-center justify-between px-3 py-2 hover:bg-neutral-100"
            >
              <span>{option}</span>
              {option && <Check size={16} className="text-black" />}
            </li>
          ))}
        </ul>
      )}

      <WidgetType type="SELECT" />
    </div>
  );
}
