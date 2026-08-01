"use client";

import { cn } from "@/lib/utils/cn";
import { cva, type VariantProps } from "@/lib/utils/cva";

const styles = cva(
  "pointer-events-none shrink-0 rotate-45 select-none",

  {
    variants: {
      variant: {
        hollow: "border-2 bg-transparent!",
        filled: "border-0",
        dashed: "border-2 border-dashed bg-transparent!",
        outline: "border-2",
      },

      color: {
        black: "border-ink bg-ink",
        "black-soft": "border-ink-soft bg-ink-soft",
        white: "border-white-ink bg-white-ink",
        "white-soft": "border-white-ink-soft bg-white-ink-soft",
        accent: "border-accent-ink bg-accent-ink",
        "accent-soft": "border-accent-ink-soft bg-accent-ink-soft",
      },

      size: {
        sm: "size-2",
        md: "size-3",
        lg: "size-4",
        xl: "size-6",
      },
    },

    defaultVariants: {
      variant: "hollow",
      color: "black",
      size: "sm",
    },
  },
);

type DiamondProps = React.ComponentPropsWithoutRef<"span"> &
  VariantProps<typeof styles>;

export function Diamond({
  variant,
  color,
  size,
  className,
  ...props
}: DiamondProps) {
  return (
    <span
      className={cn(styles({ variant, color, size, className }))}
      {...props}
    />
  );
}
