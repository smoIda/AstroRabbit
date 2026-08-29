"use client";

import { useRef } from "react";

import { usePathname } from "next/navigation";

import { Star } from "lucide-react";

import { Button } from "@/components/ui/primitives/button";

import { useGithub } from "@/hooks/use-github";

export function Menu() {
  const scope = useRef<HTMLElement | null>(null);
  const github = useGithub();
  const path = usePathname();

  if (!path.startsWith("/projects"))
    return (
      <header ref={scope} id="header" className="absolute top-8 right-8 z-50">
        <Button
          href="https://github.com/1bnuuy/AstroRabbit"
          target="_blank"
          rel="noopener noreferrer"
          className="gap-x-2 px-2 py-1"
        >
          <span className="text-base font-medium">{github.data ?? 0}</span>

          <Star size={20} className="fill-ink text-ink" />
        </Button>
      </header>
    );
}
