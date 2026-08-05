import { Edge } from "@xyflow/react";

import { EditorNodeProps } from "@/app/projects/test/_components/canvas/config";
import { ExecutionResultProps } from "@/app/projects/test/_engine/config";
import { findRootNodes, getOutgoingEdges } from "@/app/projects/test/_engine/graph";
import { executeNode } from "@/app/projects/test/_engine/node-executor";

async function executeFromNode(
  node: EditorNodeProps,
  input: unknown,
  nodes: EditorNodeProps[],
  edges: Edge[],
  execution: ExecutionResultProps,
) {
  const startedAt = Date.now();

  execution.nodes[node.id] = {
    status: "running",
    input,
    startedAt,
  };

  try {
    const result = await executeNode(
      node,
      input,
    );

    const finishedAt = Date.now();

    execution.nodes[node.id] = {
      status: "success",
      input,
      output: result.output,
      startedAt,
      finishedAt,
      duration: finishedAt - startedAt,
    };

    const outgoingEdges = getOutgoingEdges(
      node.id,
      edges,
    );

    for (const edge of outgoingEdges) {
      const nextNode = nodes.find(
        (node) => node.id === edge.target,
      );

      if (!nextNode) {
        continue;
      }

      await executeFromNode(
        nextNode,
        result.output,
        nodes,
        edges,
        execution,
      );
    }
  } catch (error) {
    const finishedAt = Date.now();

    execution.nodes[node.id] = {
      status: "error",
      input,
      startedAt,
      finishedAt,
      duration: finishedAt - startedAt,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error",
    };

    throw error;
  }
}

export async function executeProgram(
  nodes: EditorNodeProps[],
  edges: Edge[],
): Promise<ExecutionResultProps> {
  const execution: ExecutionResultProps = {
    status: "running",
    nodes: {},
  };

  const roots = findRootNodes(nodes, edges);

  for (const node of roots) {
    await executeFromNode(
      node,
      undefined,
      nodes,
      edges,
      execution,
    );
  }

  execution.status = "success";

  return execution;
}