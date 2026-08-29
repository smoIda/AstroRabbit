import { Node } from "@xyflow/react";

import z from "zod";

import { Base } from "@/app/projects/test/_components/canvas/nodes/base/config";
import { withMeta } from "@/app/projects/test/_components/canvas/utils";

const HTTP_METHOD = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

const mockConfig = z.object({
  provider: z.literal("MOCK_API"),

  headers: z.record(z.string(), z.string()),
  method: z.enum(HTTP_METHOD),
  body: z.json(),
  latency: z.number().min(0).max(10).default(0),
  statusCode: z.number().min(100).max(599).default(200),
  failureRate: z.number().min(0).max(100).default(0),
});

const mockOutput = z.object({
  statusCode: z.number().min(100).max(599),
  headers: z.record(z.string(), z.string()),
  body: z.unknown(),
});

export type HttpMockData = Base<z.infer<typeof mockConfig>, z.infer<typeof mockOutput>>;

const customConfig = z.object({
  provider: withMeta(z.literal("CUSTOM_API"), { widget: "SELECT", hiddenOnNode: true }),

  headers: withMeta(z.record(z.string(), z.string()), { widget: "RECORD" }),
  method: withMeta(z.enum(HTTP_METHOD), { widget: "SELECT" }),
  body: withMeta(z.json(), { widget: "JSON" }),
  url: withMeta(z.url(), { widget: "TEXT" }),
});

const customOutput = z.object({
  statusCode: z.number().min(100).max(599),
  headers: z.record(z.string(), z.string()),
  body: z.unknown(),
});

export type HttpCustomData = Base<z.infer<typeof customConfig>, z.infer<typeof customOutput>>;

const httpConfig = z.discriminatedUnion("provider", [mockConfig, customConfig]);

export const HTTP_REQUEST_SCHEMAS = {
  MOCK_API: {
    CONFIG: mockConfig,
    OUTPUT: mockOutput,
  },

  CUSTOM_API: {
    CONFIG: customConfig,
    OUTPUT: customOutput,
  },
} as const;

export type HttpRequestData = HttpMockData | HttpCustomData;

export type HttpRequest = Node<HttpRequestData, "HTTP_REQUEST">;
