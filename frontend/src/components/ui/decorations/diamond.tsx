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
        white: "bg-white-ink",
        accent: "bg-accent-ink",
        info: "bg-info-ink",
        success: "bg-success-ink",
        destructive: "bg-destructive-ink",
        warning: "bg-warning-ink",
      },

      borderColor: {
        black: "border-ink",
        white: "border-white-ink",
        accent: "border-accent-ink",
        info: "border-info-ink",
        success: "border-success-ink",
        destructive: "border-destructive-ink",
        warning: "border-warning-ink",
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

type Diamond = Omit<React.ComponentPropsWithoutRef<"span">, "children" | "color"> &
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
      className={cn(styles({ variant, backgroundColor, borderColor, size, className }))}
      {...props}
    />
  );
}
