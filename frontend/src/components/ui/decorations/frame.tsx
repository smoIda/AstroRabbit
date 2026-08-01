import { cn } from "@/lib/utils/cn";
import { cva } from "@/lib/utils/cva";

type FrameProps = React.ComponentPropsWithoutRef<"div"> & {
  size?: number;
  width?: number;
  color?: {
    black: "bg-ink";
    "black-soft": "bg-ink-soft";
    white: "bg-white-ink";
    "white-soft": "bg-white-ink-soft";
    accent: "bg-accent-ink";
    "accent-soft": "bg-accent-ink-soft";
  };
};

const styles = cva("relative", {
  variants: {
    size: number,
  },
});

export function Frame(props: FrameProps) {
  const { children, size = 12, width = 1, ...elProps } = props;

  return (
    <div className={cn()} {...elProps}>
      <svg
        className="pointer-events-none absolute inset-0"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          d={`
        M ${size} 0
        L 100 0
        L 100 ${100 - size}
        L ${100 - size} 100
        L 0 100
        L 0 ${size}
        L ${size} 0
      `}
          className="stroke-ink fill-none"
          strokeWidth={width}
        />
      </svg>

      {props.children}
    </div>
  );
}
