"use client";

import { usePathname } from "next/navigation";

import { links } from "@/components/config";
import { Frame } from "@/components/ui/decorations/frame";
import { Button } from "@/components/ui/primitives/button";

const ROUTE_CONFIG = [
  {
    prefix: "/projects/",
    parentHref: "/projects",
  },
] as const;

type MainFrameProps = React.ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode;
  excludePath?: string;
  label?: string;
};

export function MainFrame({ children, className, excludePath, label }: MainFrameProps) {
  const path = usePathname();

  const isMatched = ROUTE_CONFIG.find((route) => path.startsWith(route.prefix));
  const targetHref = isMatched ? isMatched.parentHref : "/";

  const defaultLabel = links.find(
    (link) => link.path === path || path.startsWith(`${link.path}/`),
  )?.id;

  const isExcluded = excludePath && path.startsWith(excludePath);

  if (isExcluded) return <>{children}</>;

  const displayLabel = isMatched ? (label ?? defaultLabel) : defaultLabel;

  return (
    <Frame
      inset={16}
      color="black"
      variant="brackets"
      labelPosition="BOTTOM"
      className={className}
      label={
        <Button
          data-button="route"
          href={targetHref}
          className="font-headline pointer-events-auto shrink-0 cursor-pointer px-4 text-ink text-2xl tracking-[0.04em]! uppercase transition-[padding] hover:px-2 active:px-2"
        >
          {displayLabel}
        </Button>
      }
    >
      {children}
    </Frame>
  );
}
