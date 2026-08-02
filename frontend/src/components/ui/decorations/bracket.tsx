"use client";

import { cn } from "@/lib/utils/cn";
import { cva, type VariantProps } from "@/lib/utils/cva";

const styles = cva("pointer-events-none absolute select-none", {
  variants: {
    position: {
      "top-left": "rotate-0 top-0 left-0",
      "top-right": "rotate-90 top-0 right-0",
      "bottom-right": "rotate-180 bottom-0 right-0",
      "bottom-left": "rotate-270 bottom-0 left-0",
    },

    color: {
      black: "bg-ink",
      "black-soft": "bg-ink-soft",
      white: "bg-white-ink",
      "white-soft": "bg-white-ink-soft",
      accent: "bg-accent-ink",
      "accent-soft": "bg-accent-ink-soft",
    },

    size: { sm: "size-3", md: "size-3.5", lg: "size-4" },
  },

  defaultVariants: {
    position: "top-left",
    color: "black",
    size: "sm",
  },
});

type BracketProps = Omit<React.HTMLAttributes<HTMLElement>, "children"> &
  VariantProps<typeof styles>;

type BracketGroupProps = Omit<BracketProps, "position">;

export function Bracket({
  position,
  color,
  size,
  className,
  ...props
}: BracketProps) {
  return (
    <span
      style={{
        clipPath: "polygon(100% 0%, 20% 20%, 0% 100%, 0% 0%)",
      }}
      className={cn(styles({ position, color, size, className }))}
      {...props}
    />
  );
}

export function BracketGroup({
  color,
  size,
  className,
  ...props
}: BracketGroupProps) {
  return (
    <div className={cn("relative size-full", className)} {...props}>
      <Bracket position="top-left" color={color} size={size} />
      <Bracket position="top-right" color={color} size={size} />
      <Bracket position="bottom-left" color={color} size={size} />
      <Bracket position="bottom-right" color={color} size={size} />
    </div>
  );
}
