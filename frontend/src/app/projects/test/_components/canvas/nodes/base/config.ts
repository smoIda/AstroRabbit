import { LucideIcon } from "lucide-react";

import { NodeProps } from "@xyflow/react";

import { CanvasNode } from "@/app/projects/test/_providers/editor/config";

export type NodeStatus =
  "IDLE" | "RUNNING" | "SUCCESS" | "SKIPPED" | "ERROR";

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
  children: React.ReactNode;
  configIcons: Record<string, LucideIcon>;
};
