"use client";

import { useRef } from "react";

import { Button } from "@/components/ui/buttons/button";
import { Section } from "@/components/layout/section";

type ButtonType = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "no-brackets";
  size?: "sm" | "md" | "lg" | "icon";
};

const buttons: ButtonType[] = [
  {
    variant: "default",
    size: "sm",
  },

  {
    variant: "default",
    size: "md",
  },

  {
    variant: "default",
    size: "lg",
  },

  {
    variant: "default",
    size: "icon",
  },
];

export default function Workspace() {
  const scope = useRef<HTMLElement | null>(null);

  return (
    <Section ref={scope}>
      <div className="absolute top-1/2 left-1/2 flex -translate-1/2 items-center justify-center gap-x-4 gap-y-4">
        {buttons.map((btn) => {
          return (
            <div
              key={btn.size}
              className="flex flex-col items-center justify-center gap-y-4"
            >
              <Button size={btn.size} variant={btn.variant}>
                {btn.size === "icon" ? (
                  <div className="size-4 bg-red-500" />
                ) : (
                  "abczyx"
                )}
              </Button>

              <span>
                {btn.variant}-{btn.size}
              </span>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
