import { EditorNodeProps } from "@/app/projects/test/_components/canvas/config";

export type NodeExecutorResultProps = {
  output: unknown;
};

export type NodeExecutorProps = (
  node: EditorNodeProps,
  input: unknown,
) => Promise<NodeExecutorResultProps>;

export type ExecutionStatusProps =
  | "idle"
  | "running"
  | "success"
  | "error";

export type NodeExecutionProps = {
  status: ExecutionStatusProps;
  input?: unknown;
  output?: unknown;
  error?: string;

  startedAt?: number;
  finishedAt?: number;
  duration?: number;
};

export type ExecutionResultProps = {
  status: ExecutionStatusProps;
  nodes: Record<string, NodeExecutionProps>;
};