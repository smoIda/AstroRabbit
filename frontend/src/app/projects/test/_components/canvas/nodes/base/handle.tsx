import { Handle, HandleType, useNodeConnections } from "@xyflow/react";

import { Plus } from "lucide-react";

import {
  handleConfig,
  type BaseHandle,
} from "@/app/projects/test/_components/canvas/nodes/base/config";

import { BracketGroup } from "@/components/ui/decorations/bracket";

import { cn } from "@/lib/utils/cn";

export function BaseHandle({
  handles,
  maxConnections = handleConfig.MAX_CONNECTIONS,
  className,
}: BaseHandle) {
  const sources = handles.filter((h) => h === "source");
  const targets = handles.filter((h) => h === "target");

  const render = (type: HandleType, handles: HandleType[]) => {
    return (
      <div className={cn(handleConfig[type].className, className)}>
        {handles.map((handle, index) => {
          const handleId = `${handle}-${index}`;

          const connections = useNodeConnections({
            handleType: handleConfig[handle].type,
            handleId,
          });

          return (
            <Handle
              key={handleId}
              id={handleId}
              type={type}
              position={handleConfig[handle].position}
              isConnectable={connections.length < maxConnections}
              className={cn(
                "group/node relative size-5 transform-none rounded-none border-none bg-transparent",
              )}
            >
              {connections.length === 0 && (
                <>
                  <BracketGroup
                    size="xs"
                    className="group-hover/node:inset-px group-active/node:inset-0.5"
                  />

                  <Plus className="text-ink absolute top-1/2 left-1/2 size-3/4 -translate-1/2" />
                </>
              )}
            </Handle>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <div className="nopan nodrag absolute inset-0 -z-10">
        {sources.length > 0 && render("source", sources)}
        {targets.length > 0 && render("target", targets)}
      </div>
    </>
  );
}
