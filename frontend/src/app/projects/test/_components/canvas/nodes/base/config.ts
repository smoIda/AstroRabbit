import { LucideIcon } from "lucide-react";

import { NodeProps, Position } from "@xyflow/react";

import { CanvasNode } from "@/app/projects/test/_providers/editor/config";

export type HandleType = "source" | "target";

export type BaseHandle = {
  handles: HandleType[];
  maxConnections?: number;
  className?: string;
};

export const handleConfig = {
  target: {
    type: "target",
    position: Position.Left,
    className: "absolute -left-8 top-auto bottom-0 flex flex-col gap-y-1",
  },

  source: {
    type: "source",
    position: Position.Right,
    className: "absolute -right-8 top-0 flex flex-col gap-y-1",
  },

  MAX_CONNECTIONS: 2,
} as const;

export type NodeStatus = "IDLE" | "RUNNING" | "SUCCESS" | "SKIPPED" | "ERROR";

export type Base = {
  label: string;
  icon: LucideIcon;
  badge: string[];

  runtime: {
    status: NodeStatus;
    duration: number;
  };
};

export type BaseNode = NodeProps<CanvasNode> & {
  children?: React.ReactNode;
  className?: string;
  configIcons: Record<string, LucideIcon>;
  handles: HandleType[];
};
