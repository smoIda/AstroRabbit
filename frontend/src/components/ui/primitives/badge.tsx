import { cn } from "@/lib/utils/cn";
import { cva, type VariantProps } from "@/lib/utils/cva";

const styles = cva(
  "border font-medium uppercase inline-flex items-center justify-center text-nowrap shrink-0",
  {
    variants: {
      size: {
        sm: "px-1 py-0.75 text-[8px]/[8px]",
        md: "px-1.5 py-0.75 text-[10px]/[10px]",
        lg: "px-2 py-0.75 text-[12px]/[12px]",
      },

      color: {
        black: "border-ink text-ink bg-ink/5",
        "black-soft": "border-ink-soft text-ink-soft bg-ink-soft/5",
        white: "border-white-ink text-white-ink bg-white-ink/5",
        "white-soft":
          "border-white-ink-soft text-white-ink-soft bg-white-ink-soft/5",
        accent: "border-accent-ink text-accent-ink bg-accent-ink/5",
        "accent-soft":
          "border-accent-ink-soft text-accent-ink-soft bg-accent-ink-soft/5",
      },
    },

    defaultVariants: {
      size: "sm",
    },
  },
);

type Badge = React.ComponentPropsWithoutRef<"span"> &
  VariantProps<typeof styles>;

export function Badge({
  children,
  color = "black",
  size,
  style,
  className,
  ...props
}: Badge) {
  return (
    <span
      className={cn(
        styles({
          color,
          size,
          className,
        }),
      )}
      {...props}
    >
      {children}
    </span>
  );
}
