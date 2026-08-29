"use client";

import { SectionHeading } from "@/components/ui/primitives/section-heading";
import { Section } from "@/components/layout/section";

import { useParallax } from "@/hooks/use-parallax";

export default function Home() {
  const scope = useParallax();

  return (
    <Section ref={scope} nextRoute="/docs">
      <div data-depth="0.12">
        <SectionHeading srOnly="Astro Rabbit" />

        <div className="w-full pt-10 text-center text-2xl">Scroll down</div>
      </div>
    </Section>
  );
}
