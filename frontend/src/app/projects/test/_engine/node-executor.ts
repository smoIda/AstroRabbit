import { NodeExecutorProps } from "@/app/projects/test/_engine/config";

export const executeRequest: NodeExecutorProps = async (node, input) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    output: {
      status: 200,
      data: {
        message: "Hello from request",
      },
    },
  };
};

export const executeDatabase: NodeExecutorProps = async (node, input) => {
  await new Promise((resolve) => setTimeout(resolve, 800));

  return {
    output: {
      rows: [
        { id: 1, name: "Alice" },
        { id: 2, name: "Bob" },
      ],
    },
  };
};

export const executeNode: NodeExecutorProps = async (node, input) => {
  switch (node.type) {
    case "REQUEST":
      return executeRequest(node, input);

    case "DATABASE":
      return executeDatabase(node, input);

    default:
      throw new Error("Unsupported node type");
  }
};
