import { EdgeStatus } from "@/app/projects/test/_components/canvas/edges/config";
import { NodeStatus } from "@/app/projects/test/_components/canvas/nodes/base/config";
import {
  ActionEditor,
  DeepPartial,
  NodeData,
} from "@/app/projects/test/_providers/editor/config";
import {
  ActionExecutor,
  ExecutionStatus,
} from "@/app/projects/test/_providers/executor/config";

export function updateExecutor(
  status: ExecutionStatus,
  error?: string,
): ActionExecutor {
  return {
    type: "SET_EXECUTOR",
    payload: { status, error },
  };
}

export function updateNode(
  id: string,
  status: NodeStatus,
  duration?: number,
  output?: DeepPartial<NodeData["output"]>,
): ActionEditor {
  return {
    type: "SET_NODE",
    payload: {
      id,
      data: {
        runtime: {
          status,
          duration: duration ?? 0,
        },

        output,
      },
    },
  };
}

export function updateEdge(id: string, status: EdgeStatus): ActionEditor {
  return {
    type: "SET_EDGE",
    payload: {
      id,
      status,
    },
  };
}
