"use client";

import { useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";

import { themes } from "@/components/providers/theme-provider";
import { Button } from "@/components/ui/buttons/button";

import { useTheme } from "@/hooks/use-theme";
import { useGithub } from "@/hooks/use-github";

import { useGSAP, gsap } from "@/lib/anims/plugins";

export function Menu() {
  const scope = useRef<HTMLElement | null>(null);
  const { theme, setTheme } = useTheme();
  const { contextSafe } = useGSAP({ scope });
  const { data: star } = useGithub();

  const starFormat = new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 2,
  });

  const onMouseEnter = contextSafe((e: HTMLElement | HTMLAnchorElement) => {
    const value = 1;

    gsap.to(e.querySelector(".bracket"), {
      top: value,
      right: value,
      bottom: value,
      left: value,
      ease: "back.out(2)",
      duration: 0.2,
      overwrite: "auto",
    });
  });

  const onMouseLeave = contextSafe((e: HTMLElement | HTMLAnchorElement) => {
    gsap.to(e.querySelector(".bracket"), {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ease: "expo.out",
      duration: 0.2,
      overwrite: "auto",
    });
  });

  const onMouseClick = contextSafe((e: HTMLElement | HTMLAnchorElement) => {
    gsap.fromTo(
      e.querySelector(".bracket"),
      { rotation: 0 },
      {
        rotation: "+=90",
        ease: "power4.out",
        duration: 0.4,
        overwrite: "auto",
      },
    );
  });

  return (
    <header
      ref={scope}
      id="header"
      className="pointer-events-none absolute inset-4 z-50 transition-colors *:pointer-events-auto"
    >
      <div className="absolute top-4 right-4 flex items-center justify-center gap-x-4">
        <Button
          onMouseEnter={(e) => onMouseEnter(e.currentTarget)}
          onTouchStart={(e) => onMouseEnter(e.currentTarget)}
          onMouseLeave={(e) => onMouseLeave(e.currentTarget)}
          onTouchEnd={(e) => onMouseLeave(e.currentTarget)}
          href="https://github.com/1bnuuy"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FontAwesomeIcon icon={faGithub} className="text-xl" />
          <span>{starFormat.format(star || 0)}</span>
        </Button>

        <Button
          size="icon"
          onClick={(e) => {
            onMouseClick(e.currentTarget);
            setTheme(theme === "DARK" ? "LIGHT" : "DARK");
          }}
        >
          <FontAwesomeIcon icon={themes[theme].icon} />
        </Button>
      </div>
    </header>
  );
}
