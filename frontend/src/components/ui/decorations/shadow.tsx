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
    scale?: number;
    opacity?: number;
  };

export function Shadow(props: ShadowProps) {
  const {
    color,
    scale = 1.05,
    opacity = 0.4,
    style,
    className,
    ...shadowProps
  } = props;

  return (
    <div
      style={
        {
          ...style,
          "--shadow-scale": scale,
          "--shadow-opacity": opacity,
        } as React.CSSProperties
      }
      className={cn(
        styles({ color, className }),
        "scale-(--shadow-scale) opacity-(--shadow-opacity)",
      )}
      {...shadowProps}
    />
  );
}
