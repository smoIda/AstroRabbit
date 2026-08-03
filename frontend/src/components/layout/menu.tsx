"use client";

import { useRef } from "react";

import { Star } from "lucide-react";

import { Button } from "@/components/ui/primitives/button";

import { useGithub } from "@/hooks/use-github";
import { usePathname } from "next/navigation";

export function Menu() {
  const scope = useRef<HTMLElement | null>(null);
  const { data: star } = useGithub();
  const path = usePathname();

  if (!path.startsWith("/projects"))
    return (
      <header ref={scope} id="header" className="absolute top-8 right-8 z-50">
        <Button
          href="https://github.com/1bnuuy/AstroRabbit"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text-base font-medium">{star ?? 0}</span>

          <Star size={20} className="fill-ink stroke-ink" />
        </Button>
      </header>
    );
}
