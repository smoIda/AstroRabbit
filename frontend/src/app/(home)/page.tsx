"use client";

import { useEffect, useRef } from "react";

import Parallax from "parallax-js";

import { Headline } from "@/components/ui/headline";
import Link from "next/link";
import { Section } from "@/components/layout/section";
import { Button } from "@/components/ui/buttons/button";

export default function Home() {
  const scope = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!scope.current) return;

    const p = new Parallax(scope.current);

    return () => p.destroy();
  }, []);

  return (
    <Section ref={scope}>
      <div data-depth="0.15" className="size-full overflow-hidden p-4">
        <div className="flex size-full flex-col items-center justify-center gap-y-4">
          <Headline>UNTITLED UI LIBRARY</Headline>

          <p>
            Browse production-ready components, install them with a single
            command, and contribute your own. Every component is versioned,
            maintained, and built for real projects.
          </p>

          <div className="flex items-center justify-center gap-x-4">
            <Link href="/docs">Installation</Link>
            <Link href="/docs">Browse Components</Link>
          </div>

          <Button type="submit">abc</Button>
          <Button variant="default">this is a native button</Button>
          <Button variant="no-brackets" size="sm" href="http://">
            this is an anchor
          </Button>
          <Button variant="no-brackets" size="lg" href="/docs">
            this is a Link
          </Button>
        </div>
      </div>
    </Section>
  );
}
