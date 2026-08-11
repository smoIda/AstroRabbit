import { Edge } from "@xyflow/react";

import { NodeData } from "@/app/projects/test/_components/canvas/nodes/config";

import { API_URL } from "@/hooks/config";

export type ExecutionRequest = {
  nodes: NodeData[];
  edges: Edge[];
  startAt: string;
};

export type ExecutionResponse = {
  executionId: string;
};

export type CancellationRequest = {
  executionId: string;
};

export type CancellationResponse = {
  executionId: string;
};

export async function executeProgram(
  request: ExecutionRequest,
): Promise<ExecutionResponse> {
  const res = await fetch(`${API_URL}/executor`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) throw new Error("Failed to execute program");

  return res.json();
}

export async function cancelProgram(
  request: CancellationRequest,
): Promise<CancellationResponse> {
  const res = await fetch(`${API_URL}/executor/${request.executionId}/cancel`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    // don't need a JSON body here because executionId is part of the URL.
  });

  if (!res.ok) throw new Error("Failed to cancel program");

  return res.json();
}
