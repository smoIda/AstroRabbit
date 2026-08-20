"use client";

import { useEffect, useRef } from "react";

import { useTransitionRouter } from "next-transition-router";

import { Link } from "@/components/config";

import { cn } from "@/lib/utils/cn";

type Section = {
  children: React.ReactNode;
  ref?: React.RefObject<HTMLElement | null>;
  className?: string;
  nextRoute?: Link["path"];
  previousRoute?: Link["path"];
};

export function Section({
  children,
  ref,
  className,
  nextRoute,
  previousRoute,
  ...props
}: Section) {
  const router = useTransitionRouter();
  const scope = useRef<HTMLDivElement>(null);
  const activeDirection = useRef<"down" | "up" | null>(null);
  const navigationTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!nextRoute && !previousRoute) return;

    let touchStartY = 0;

    const cancelNavigation = () => {
      if (!activeDirection.current) return;

      activeDirection.current = null;

      if (navigationTimer.current) clearTimeout(navigationTimer.current);
    };

    const triggerNavigation = (direction: "down" | "up") => {
      if (activeDirection.current) return;

      const isAtBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 10;
      const isAtTop = window.scrollY <= 10;

      const targetRoute =
        direction === "down" && isAtBottom
          ? nextRoute
          : direction === "up" && isAtTop
            ? previousRoute
            : null;

      if (!targetRoute) return;

      activeDirection.current = direction;

      router.push(targetRoute);
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        if (activeDirection.current === "up") cancelNavigation();
        else triggerNavigation("down");
      } else if (e.deltaY < 0) {
        if (activeDirection.current === "down") cancelNavigation();
        else triggerNavigation("up");
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touchEndY = e.touches[0].clientY;
      const deltaY = touchStartY - touchEndY;

      if (deltaY > 50) {
        if (activeDirection.current === "up") cancelNavigation();
        else triggerNavigation("down");
      } else if (deltaY < -50) {
        if (activeDirection.current === "down") cancelNavigation();
        else triggerNavigation("up");
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    return () => {
      if (navigationTimer.current) clearTimeout(navigationTimer.current);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [nextRoute, previousRoute, router]);

  return (
    <section
      ref={ref}
      className={cn(
        "pointer-events-auto! relative size-full px-8 py-18",
        className,
      )}
      {...props}
    >
      <div ref={scope} data-depth="0.12" className="size-full">
        {children}
      </div>
    </section>
  );
}
