import { Handle, Position, useNodeConnections } from "@xyflow/react";

import { cn } from "@/lib/utils/cn";

type HandleSide = "left" | "right";

type BaseHandle = {
  sides: HandleSide[];
  maxConnections?: number;
};

const config = {
  left: {
    type: "target",
    position: Position.Left,
    className: "bottom-2 top-auto -left-2",
  },

  right: {
    type: "source",
    position: Position.Right,
    className: "top-2 -right-2",
  },
} as const;

function SingleHandle({
  side,
  maxConnections = 1,
}: {
  side: HandleSide;
  maxConnections?: number;
}) {
  const handleConfig = config[side];
  const handleId = `${side}-${handleConfig.type}`;

  const connections = useNodeConnections({
    handleType: handleConfig.type,
    handleId,
  });

  return (
    <Handle
      id={handleId}
      type={handleConfig.type}
      position={handleConfig.position}
      isConnectable={connections.length < maxConnections}
      className={cn(
        "size-3 transform-none rounded-none border-none bg-transparent ",
        handleConfig.className,
      )}
    />
  );
}

export function BaseHandle({ sides, maxConnections = 1 }: BaseHandle) {
  return (
    <div className="absolute inset-0 -z-10">
      {sides.map((side) => (
        <SingleHandle key={side} side={side} maxConnections={maxConnections} />
      ))}
    </div>
  );
}
