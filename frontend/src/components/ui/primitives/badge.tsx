import { cn } from "@/lib/utils/cn";
import { cva, type VariantProps } from "@/lib/utils/cva";

const styles = cva(
  "border font-medium uppercase inline-flex items-center tracking-wider justify-center text-nowrap shrink-0",
  {
    variants: {
      size: {
        sm: "px-1 py-0.75 text-[8px]/[8px]",
        md: "px-1.5 py-0.75 text-[10px]/[10px]",
        lg: "px-2 py-0.75 text-[12px]/[12px]",
      },

      color: {
        black: "border-ink text-ink bg-ink/10",
        white: "border-white-ink text-white-ink bg-white-ink/10",
        accent: "border-accent-ink text-accent-ink bg-accent-ink/10",
        info: "border-info-ink text-info-ink bg-info-ink/10",
        success: "border-success-ink text-success-ink bg-success-ink/10",
        destructive: "border-destructive-ink text-destructive-ink bg-destructive-ink/10",
        warning: "border-warning-ink text-warning-ink bg-warning-ink/10",
      },
    },

    defaultVariants: {
      color: "black",
      size: "sm",
    },
  },
);

type Badge = React.ComponentPropsWithoutRef<"span"> &
  VariantProps<typeof styles> & {
    children: React.ReactNode;
  };

export function Badge({ children, color = "black", size, style, className, ...props }: Badge) {
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
