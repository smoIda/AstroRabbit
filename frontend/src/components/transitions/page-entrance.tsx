"use client";

import { gsap, useGSAP } from "@/lib/anims/plugins";

export function PageEntrance({ isFirstTime }: { isFirstTime: boolean }) {
  useGSAP(() => {
    if (!isFirstTime) {
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
      );
  }, []);

  return (
    <div id="main-intro" className="pointer-events-none fixed z-60 size-full">
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
  );
}
