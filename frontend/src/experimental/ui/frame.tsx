import { cn } from "@/lib/utils/cn";
import { cva, VariantProps } from "@/lib/utils/cva";

const styles = cva("relative", {
  variants: {
    strokeColor: {
      black: "stroke-ink",
      "black-soft": "stroke-ink-soft",
      white: "stroke-white-ink",
      "white-soft": "stroke-white-ink-soft",
      accent: "stroke-accent-ink",
      "accent-soft": "stroke-accent-ink-soft",
    },

    fillColor: {
      black: "fill-ink",
      "black-soft": "fill-ink-soft",
      white: "fill-white-ink",
      "white-soft": "fill-white-ink-soft",
      accent: "fill-accent-ink",
      "accent-soft": "fill-accent-ink-soft",
    }
  },

  defaultVariants: {
    strokeColor: "black",
    fillColor: "white"
  },
});

type FrameProps = React.ComponentPropsWithoutRef<"div"> &
  VariantProps<typeof styles> & {
    chamferSize?: number;
    strokeWidth?: number;
  };

export function Frame(props: FrameProps) {
  const {
    children,
    chamferSize = 10,
    strokeWidth = 4,
    strokeColor,
    fillColor,
    className,
    ...elProps
  } = props;

  return (
    <div className={cn(styles({ className }))} {...elProps}>
      <svg
        className="pointer-events-none inset-0 absolute size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d={`
        M ${chamferSize} 0
        L 100 0
        L 100 ${100 - chamferSize}
        L ${100 - chamferSize} 100
        L 0 100
        L 0 ${chamferSize}
        Z
      `}
          vectorEffect="non-scaling-stroke"
          className={styles({ strokeColor, fillColor })}
          strokeWidth={strokeWidth}
        />
      </svg>

      {props.children}
    </div>
  );
}
