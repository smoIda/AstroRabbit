import { CanvasEdge, CanvasNode } from "@/app/projects/test/_providers/editor/config";

import { API_URL } from "@/hooks/config";

export type ExecutionRequest = {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  startAt: string;
};

export async function executeProgram(request: ExecutionRequest): Promise<string> {
  const res = await fetch(`${API_URL}/executor`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) throw new Error("Failed to execute program");

  const data = await res.json();

  return data.executionId;
}

export async function abortProgram(executionId: string): Promise<string> {
  const res = await fetch(`${API_URL}/executor/${executionId}/abort`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
  });

  if (!res.ok) throw new Error("Failed to abort program");

  return res.json();
}

export async function skipNode({
  executionId,
  nodeId,
}: {
  executionId: string;
  nodeId: string;
}): Promise<string> {
  const res = await fetch(`${API_URL}/executor/${executionId}/nodes/${nodeId}/skip`, {
    method: "POST",
    headers: { "Content-type": "application/json" },
  });

  if (!res.ok) throw new Error(`Failed to skip node id: ${nodeId} at execution id: ${executionId}`);

  return res.json();
}
