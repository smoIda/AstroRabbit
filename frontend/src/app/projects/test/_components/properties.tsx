"use client";

import { BaseNodeData } from "@/app/projects/test/_components/canvas/config";

import { Shadow } from "@/components/ui/decorations/shadow";

type PropertiesProps = {
  id: string;
  data: BaseNodeData;
  x: number;
  y: number;
};

export default function Properties(props: PropertiesProps) {
  return (
    <aside className="z-60 h-80 w-80">
      <div className="relative flex size-full flex-col gap-y-4 p-4">
        <div>
          <p className="text-sm font-bold">PROPERTIES</p>
          <p className="text-ink-soft text-xs">{props.data.type}</p>
        </div>

        <div>
          <label className="text-ink-soft text-xs">ID</label>
          <p className="text-sm">{props.id}</p>
        </div>

        <div>
          <label className="text-ink-soft text-xs">Position</label>
          <p className="text-sm">
            X: {Math.round(props.x)} Y: {Math.round(props.y)}
          </p>
        </div>

        <Shadow />
      </div>
    </aside>
  );
}
