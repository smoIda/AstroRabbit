"use client";

import { useEffect, useState } from "react";

import { TransitionRouter } from "next-transition-router";
import { usePathname } from "next/navigation";

import { MainFrame } from "@/components/layout/main-frame";
import { PageEntrance } from "@/components/transitions/page-entrance";

import { useParallax } from "@/hooks/use-parallax";

import { gsap } from "@/lib/anims/plugins";

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  const [mounted, setMounted] = useState(false);
  const [isFirstTime] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("IS_FIRST_TIME");

      return stored === null;
    }

    return true;
  });

  const scope = useParallax(mounted);

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
        <MainFrame excludePath="/projects/">
          {!path.startsWith("/projects/") && (
            <div ref={scope} className="pointer-events-none absolute inset-0">
              <div
                data-depth="0.08"
                id="main-background"
                className="absolute size-full scale-105"
              />
            </div>
          )}

          <div
            style={{
              boxShadow: "inset 0 0 40px 20px rgb(194, 194, 194, 0.4)",
            }}
            className="pointer-events-none fixed inset-0"
          />

          <PageEntrance isFirstTime={isFirstTime} />

          {children}
        </MainFrame>
      </main>
    </TransitionRouter>
  );
}
