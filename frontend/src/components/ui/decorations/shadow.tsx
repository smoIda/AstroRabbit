import { cn } from "@/lib/utils/cn";
import { cva, type VariantProps } from "@/lib/utils/cva";

const styles = cva("absolute top-1/2 left-1/2 -translate-1/2 -z-50 size-full", {
  variants: {
    color: {
      black: "bg-ink",
      "black-soft": "bg-ink-soft",
      white: "bg-white-ink",
      "white-soft": "bg-white-ink-soft",
      accent: "bg-accent-ink",
      "accent-soft": "bg-accent-ink-soft",
    },
  },

  defaultVariants: {
    color: "white-soft",
  },
});

type ShadowProps = Omit<React.ComponentPropsWithoutRef<"span">, "children"> &
  VariantProps<typeof styles> & {
    spread?: number;
    opacity?: number;
  };

export function Shadow(props: ShadowProps) {
  const {
    color,
    spread = 16,
    opacity = 60,
    style,
    className,
    ...shadowProps
  } = props;

  return (
    <div
      style={
        {
          width: `calc(100% + ${spread}px)`,
          height: `calc(100% + ${spread}px)`,
          opacity: opacity / 100,
        } as React.CSSProperties
      }
      className={cn(styles({ color, className }))}
      {...shadowProps}
    />
  );
}
