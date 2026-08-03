import { Handle, Position } from "@xyflow/react";

import { cn } from "@/lib/utils/cn";

type HandleType = "source" | "target";

type BaseHandle = {
  positions: Partial<Record<"top" | "right" | "bottom" | "left", HandleType[]>>;
};

const config = {
  top: {
    position: Position.Top,
    clipPath: "polygon(100% 50%, 50% 20%, 0% 50%, 50% 0%)",
    className: "top-0 left-1/2 -translate-x-1/2",
  },
  right: {
    position: Position.Right,
    clipPath: "polygon(50% 100%, 80% 50%, 50% 0%, 100% 50%)",
    className: "top-1/2 right-0 -translate-y-1/2",
  },
  bottom: {
    position: Position.Bottom,
    clipPath: "polygon(0% 50%, 50% 80%, 100% 50%, 50% 100%)",
    className: "bottom-0 left-1/2 -translate-x-1/2",
  },
  left: {
    position: Position.Left,
    clipPath: "polygon(50% 100%, 20% 50%, 50% 0%, 0% 50%)",
    className: "top-1/2 left-0 -translate-y-1/2",
  },
} satisfies Record<
  "top" | "right" | "bottom" | "left",
  {
    position: Position;
    clipPath: string;
    className: string;
  }
>;

export function BaseHandle({ positions }: BaseHandle) {
  return (
    <>
      {Object.entries(positions).flatMap(([side, types]) => {
        if (!types) return [];

        const handle = config[side as keyof typeof config];

        return types.map((type) => (
          <Handle
            key={`${side}-${type}`}
            id={`${side}-${type}`}
            type={type}
            position={handle.position}
            style={{
              clipPath: handle.clipPath,
            }}
            className={cn(
              "size-6 transform-none rounded-none border-none",
              handle.className,
              {
                "opacity-0": type === "target",
                "bg-accent-ink": type === "source",
              },
            )}
          />
        ));
      })}
    </>
  );
}
