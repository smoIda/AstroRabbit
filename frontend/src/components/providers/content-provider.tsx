"use client";

import { useEffect, useState } from "react";

import { TransitionRouter } from "next-transition-router";
import { usePathname } from "next/navigation";

import { links } from "@/components/config";
import { Bracket } from "@/components/ui/decorations/bracket";
import { Button } from "@/components/ui/primitives/button";
import { Diamond } from "@/components/ui/decorations/diamond";
import { PageEntrance } from "@/components/transitions/page-entrance";

import { useParallax } from "@/hooks/use-parallax";

import { gsap } from "@/lib/anims/plugins";

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const path = usePathname();
  const scope = useParallax(mounted)

  const [isFirstTime] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("IS_FIRST_TIME");

      return stored === null;
    }

    return true;
  });

  useEffect(() => {
    setMounted(true);

    setTimeout(() => sessionStorage.setItem("IS_FIRST_TIME", "false"), 0);
  }, []);

  if (!mounted) return null;

  return (
    <TransitionRouter
      auto
      leave={(next) => {
        const tween = gsap.to("#main > *:last-child", {
          y: -30,
          opacity: 0,
          scale: 0.9,
          duration: 0.2,
          ease: "power3.out",
          overwrite: "auto",
          onComplete: next,
        });

        return () => tween.kill();
      }}
      enter={(next) => {
        const tween = gsap.fromTo(
          "#main > *:last-child",
          { y: 30, opacity: 0, scale: 1.1 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.4,
            ease: "power3.out",
            overwrite: "auto",
            onComplete: next,
          },
        );

        return () => tween.kill();
      }}
    >
      <main id="main" className="relative h-dvh w-screen overflow-hidden">
        <div
          id="main-border"
          className="pointer-events-none absolute inset-4 z-50 border-2 border-b-0 select-none"
        >
          <Bracket color="accent" className="top-1 left-1 size-15" />
          <Bracket
            color="accent"
            className="right-1 bottom-1 size-15"
            position="bottom-right"
          />

          <div className="*:not-[.font-headline,.diamond]:bg-ink absolute -bottom-0.5 -left-0.5 z-60 flex h-0.5 w-[calc(100%+4px)] items-center justify-between">
            <span className="h-0.5 w-full" />
            <Diamond />

            <Button
              variant="no-brackets"
              href={path.startsWith("/projects/") ? "/projects" : "/"}
              className="font-headline pointer-events-auto shrink-0 cursor-pointer px-4 text-2xl tracking-[0.04em]! transition-[padding] hover:px-2 active:px-2"
            >
              {path.startsWith("/projects/") ? (
                <span>PROJECT NAME</span>
              ) : (
                links.find((link) => link.path === path)?.id
              )}
            </Button>

            <Diamond />
            <span className="h-0.5 w-full" />
          </div>
        </div>

        {/* parallax.js targets their data-depth elements with left: 0px;
top: 0px, so wrapping the square in another div fixes top/left/bottom/right not workign */}

        <div
          ref={scope}
          className="pointer-events-none absolute z-60 size-full"
        >
          <div
            data-depth="0.08"
            className="*:border-ink-soft/20! relative size-full *:absolute"
          >
            <Diamond className="top-0 left-2/3 size-35 -translate-1/2" />
            <Diamond className="top-0 left-2/3 size-30 -translate-1/2" />

            <Diamond className="top-3/4 -right-5 size-40 translate-x-1/2 -translate-y-1/2" />
            <Diamond className="top-3/4 -right-5 size-40 translate-x-1/2 -translate-y-1/2 rotate-0" />

            <Diamond className="bottom-5/6 left-0 h-4 w-80 -translate-x-1/2 translate-y-1/2 rotate-0" />

            <Diamond className="bottom-5 left-0 size-50 -translate-x-1/2 translate-y-1/2 rotate-10" />
          </div>
        </div>

        <PageEntrance isFirstTime={isFirstTime} />

        {children}
      </main>
    </TransitionRouter>
  );
}
