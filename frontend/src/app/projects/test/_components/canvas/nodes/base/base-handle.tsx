import { Handle, Position, useNodeConnections } from "@xyflow/react";

import { cn } from "@/lib/utils/cn";

type HandleType = "source" | "target";

type BaseHandleProps = {
  positions: Partial<Record<"top" | "right" | "bottom" | "left", HandleType[]>>;
  connectionCount?: number;
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

function SingleHandle({
  side,
  type,
  maxConnections = 1,
}: {
  side: "top" | "right" | "bottom" | "left";
  type: HandleType;
  maxConnections?: number;
}) {
  const handleId = `${side}-${type}`;
  const handleConfig = config[side];

  const connections = useNodeConnections({
    handleType: type,
    handleId,
  });

  return (
    <Handle
      id={handleId}
      type={type}
      position={handleConfig.position}
      isConnectable={connections.length < maxConnections}
      style={{
        clipPath: handleConfig.clipPath,
      }}
      className={cn(
        "size-6 transform-none rounded-none border-none",
        handleConfig.className,
        {
          "opacity-0": type === "target",
          "bg-accent-ink": type === "source",
        },
      )}
    />
  );
}

export function BaseHandle({
  positions,
  connectionCount = 1,
}: BaseHandleProps) {
  return (
    <div className="absolute inset-1">
      {Object.entries(positions).flatMap(([side, types]) => {
        if (!types) return [];

        return types.map((type) => (
          <SingleHandle
            key={`${side}-${type}`}
            side={side as keyof typeof config}
            type={type}
            maxConnections={connectionCount}
          />
        ));
      })}
    </div>
  );
}