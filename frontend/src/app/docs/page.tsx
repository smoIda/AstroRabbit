"use client";

import { Section } from "@/components/layout/section";
import { SectionHeading } from "@/components/ui/primitives/section-heading";

import { useParallax } from "@/hooks/use-parallax";

export default function Documents() {
  const scope = useParallax();

  return (
    <Section ref={scope} previousRoute="/">
      <div data-depth="0.12">
        <SectionHeading srOnly="Documents" />
      </div>
    </Section>
  );
}
