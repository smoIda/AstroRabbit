import { NodeData } from "@/app/projects/test/_providers/editor/config";

export type ExecutionStatus = "IDLE" | "RUNNING" | "SUCCESS" | "ABORTED" | "ERROR";

export type ExecutionEvent =
  | { type: "EXECUTION_STARTED" }
  | { type: "EXECUTION_SUCCESS" }
  | { type: "EXECUTION_ABORTED" }
  | { type: "EXECUTION_ERROR"; output: string }
  | { type: "NODE_STARTED"; nodeId: string }
  | { type: "NODE_SUCCESS"; nodeId: string; duration: number; output: NodeData["output"] }
  | { type: "NODE_SKIPPED"; nodeId: string; duration: number }
  | { type: "NODE_ERROR"; nodeId: string; duration: number; output: NodeData["output"] }
  | { type: "EDGE_STARTED"; edgeId: string }
  | { type: "EDGE_FINISHED"; edgeId: string }
  | { type: "EDGE_SKIPPED"; edgeId: string };

export type InitialExecutor = {
  id: string | null;
  status: ExecutionStatus;
  error: string | null;
};

export type ActionExecutor =
  | { type: "RESET" }
  | { type: "SET_ID"; payload: string }
  | { type: "PATCH_EXECUTOR"; payload: { status: ExecutionStatus; error?: string } };
