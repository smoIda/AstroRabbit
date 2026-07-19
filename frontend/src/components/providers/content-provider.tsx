"use client";

import { useEffect, useRef, useState } from "react";

import { TransitionRouter } from "next-transition-router";
import { usePathname } from "next/navigation";

import Parallax from "parallax-js";

import { Bracket } from "@/components/ui/decoration/bracket";

import { useTheme } from "@/hooks/use-theme";

import { gsap, useGSAP } from "@/lib/anims/plugins";

type LinkProps = {
  id: "ASTRO RABBIT" | "DOCS";
  path: "/" | "/docs";
};

const links: LinkProps[] = [
  {
    id: "ASTRO RABBIT",
    path: "/",
  },

  {
    id: "DOCS",
    path: "/docs",
  },
] as const;

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("IS_FIRST_TIME");

      return stored === null;
    }

    return true;
  });
  const bgRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useTheme();
  const path = usePathname();

  useGSAP(() => {
    if (!isFirstTime || !mounted) {
      gsap.set("#main-intro", { autoAlpha: 0 });

      return;
    }

    gsap
      .timeline({ defaults: { ease: "power4.inOut" } })
      .fromTo(
        "#main-intro-left",
        { xPercent: 0, yPercent: 0 },
        { xPercent: -4, yPercent: -2, duration: 0.5 },
      )
      .fromTo(
        "#main-intro-right",
        { xPercent: 0, yPercent: 0 },
        { xPercent: 4, yPercent: 2, duration: 0.5 },
        "<",
      )
      .to(
        "#main-intro-left",
        {
          xPercent: -140,
          yPercent: -70,
          duration: 1.4,
          ease: "expo.inOut",
        },
        ">0.2",
      )
      .to(
        "#main-intro-right",
        {
          xPercent: 140,
          yPercent: 70,
          duration: 1.4,
          ease: "expo.inOut",
        },
        "<",
      )
      .from(
        ".header-link, .header-menu-item",
        {
          autoAlpha: 0,
          y: 10,
          stagger: 0.06,
          duration: 0.6,
          ease: "power3.out",
        },
        ">-0.4",
      );
  }, [mounted]);

  useEffect(() => {
    if (!bgRef.current) return;

    const p = new Parallax(bgRef.current);

    return () => p.destroy();
  }, [mounted]);

  useEffect(() => {
    setMounted(true);

    setTimeout(() => sessionStorage.setItem("IS_FIRST_TIME", "false"), 0);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "IS_FIRST_TIME") setIsFirstTime(e.newValue === null);
    };

    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
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
      <main
        id="main"
        className={`relative h-dvh w-screen overflow-hidden ${theme === "DARK" && "dark"}`}
      >
        <div
          id="main-border"
          className="pointer-events-none absolute inset-4 z-50 border-2 border-b-0 select-none"
        >
          <div className="absolute inset-1">
            <Bracket color="accent" size="xl" />
            <Bracket color="accent" size="xl" position="bottom-right" />
          </div>

          <div className="*:not-[.font-headline,.diamond]:bg-ink absolute -bottom-0.5 -left-0.5 flex h-0.5 w-[calc(100%+4px)] items-center justify-between">
            <span className="h-0.5 w-full" />
            <span className="diamond size-2 shrink-0 rotate-45 border-2" />

            <span className="font-headline shrink-0 px-4 text-2xl tracking-[0.04em]!">
              {links.find((link) => link.path === path)?.id}
            </span>

            <span className="diamond size-2 shrink-0 rotate-45 border-2" />
            <span className="h-0.5 w-full" />
          </div>
        </div>

        <div ref={bgRef} className="pointer-events-none absolute inset-0">
          <div
            data-depth="0.12"
            id="main-background"
            className={`absolute size-full scale-105 ${theme === "DARK" && "dark"}`}
          />
        </div>

        <div
          id="main-intro"
          className="pointer-events-none fixed z-60 size-full"
        >
          <span
            id="main-intro-right"
            style={{
              clipPath: "polygon(100% 0%, 0% 100%, 100% 100%)",
            }}
            className="bg-ink pointer-events-auto absolute size-full"
          />

          <span
            id="main-intro-left"
            style={{
              clipPath: "polygon(100% 0%, 0% 100%, 0% 0%)",
            }}
            className="bg-ink pointer-events-auto absolute size-full"
          />
        </div>

        {children}
      </main>
    </TransitionRouter>
  );
}
