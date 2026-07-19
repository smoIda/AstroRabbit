import { cn } from "@/lib/utils/cn";

type BracketProps = {
  position?: keyof typeof positions;
  color?: keyof typeof colors;
  size?: keyof typeof sizes;
};

type BracketGroupProps = Omit<BracketProps, "position">;

const positions = {
  "top-left": "rotate-0 top-0 left-0",
  "top-right": "rotate-90 top-0 right-0",
  "bottom-right": "rotate-180 bottom-0 right-0",
  "bottom-left": "rotate-270 bottom-0 left-0",
} as const;

const colors = {
  black: "bg-ink",
  "black-soft": "bg-ink-soft",
  white: "bg-white-ink",
  "white-soft": "bg-white-ink-soft",
  accent: "bg-accent-ink",
  "accent-soft": "bg-accent-ink-soft",
} as const;

const sizes = {
  sm: "size-3",
  md: "size-4",
  lg: "size-5",
  xl: "size-15",
} as const;

export function Bracket({
  position = "top-left",
  color = "black",
  size = "sm",
}: BracketProps) {
  return (
    <span
      aria-hidden="true"
      style={{
        clipPath: "polygon(100% 0%, 20% 20%, 0% 100%, 0% 0%)",
      }}
      className={cn(
        "pointer-events-none absolute select-none",
        positions[position],
        colors[color],
        sizes[size],
      )}
    />
  );
}

export function BracketGroup({
  color = "black",
  size = "sm",
}: BracketGroupProps) {
  return (
    <>
      <Bracket position="top-left" color={color} size={size} />
      <Bracket position="top-right" color={color} size={size} />
      <Bracket position="bottom-left" color={color} size={size} />
      <Bracket position="bottom-right" color={color} size={size} />
    </>
  );
}
