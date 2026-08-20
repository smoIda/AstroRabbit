import { cn } from "@/lib/utils/cn";
import { cva, type VariantProps } from "@/lib/utils/cva";

const styles = cva(
  "pointer-events-none shrink-0 rotate-45 select-none",

  {
    variants: {
      variant: {
        hollow: "border-2 bg-transparent!",
        filled: "border-2",
        solid: "border-0",
        dashed: "border-2 border-dashed bg-transparent!",
      },

      backgroundColor: {
        black: "bg-ink",
        "black-soft": "bg-ink-soft",
        white: "bg-white-ink",
        "white-soft": "bg-white-ink-soft",
        accent: "bg-accent-ink",
        "accent-soft": "bg-accent-ink-soft",
      },

      borderColor: {
        black: "border-ink",
        "black-soft": "border-ink-soft",
        white: "border-white-ink",
        "white-soft": "border-white-ink-soft",
        accent: "border-accent-ink",
        "accent-soft": "border-accent-ink-soft",
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
      backgroundColor: "white",
      borderColor: "black",
      size: "sm",
    },
  },
);

type Diamond = Omit<
  React.ComponentPropsWithoutRef<"span">,
  "children" | "color"
> &
  VariantProps<typeof styles>;

export function Diamond({
  variant,
  backgroundColor,
  borderColor,
  size,
  className,
  ...props
}: Diamond) {
  return (
    <span
      className={cn(
        styles({ variant, backgroundColor, borderColor, size, className }),
      )}
      {...props}
    />
  );
}
