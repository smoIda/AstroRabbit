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
  },

  defaultVariants: {
    strokeColor: "black",
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
    strokeWidth = 1,
    strokeColor,
    className,
    ...elProps
  } = props;

  return (
    <div className={cn(styles({ className }))} {...elProps}>
      <svg
        className="pointer-events-none absolute size-full"
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
          className={`fill-none ${styles({ strokeColor })}`}
          strokeWidth={strokeWidth}
        />
      </svg>

      {props.children}
    </div>
  );
}
