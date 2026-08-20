import { Node } from "@xyflow/react";

import { Base } from "@/app/projects/test/_components/canvas/nodes/base/config";

export type HttpMockData = Base & {
  provider: "MOCK_API";

  config: {
    headers: Record<string, string>;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body: string;
    latency: number;
    statusCode: number;
    failureRate: number;
  };

  output: {
    statusCode: number;
    headers: Record<string, string>;
    body: unknown;
  };
};

export type HttpCustomData = Base & {
  provider: "CUSTOM_API";

  config: {
    headers: Record<string, string>;
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body: string;
    url: string;
  };

  output: {
    statusCode: number;
    headers: Record<string, string>;
    body: unknown;
  };
};

export type HttpRequestData = HttpMockData | HttpCustomData;

export type HttpRequest =
  Node<HttpMockData, "HTTP_REQUEST"> | Node<HttpCustomData, "HTTP_REQUEST">;
