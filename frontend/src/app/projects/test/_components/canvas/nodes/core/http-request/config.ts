import { Node } from "@xyflow/react";

import z from "zod";

import { Base } from "@/app/projects/test/_components/canvas/nodes/base/config";
import { withMeta } from "@/app/projects/test/_components/canvas/utils";

const HTTP_METHOD = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"] as const;
const HEADERS = { KEY: { MAX: 256 }, VALUE: { MAX: 8192 } };
const URL = { MAX: 2048 };
const STATUS_CODE = { MIN: 100, MAX: 599, DEFAULT: 200 };
const LATENCY = { MIN: 0, MAX: 10, DEFAULT: 0 };
const FAILURE_RATE = { MIN: 0, MAX: 100, DEFAULT: 0 };

const mockConfig = z.strictObject({
  provider: z.literal("MOCK_API"),

  headers: withMeta(z.record(z.string().max(HEADERS.KEY.MAX), z.string().max(HEADERS.VALUE.MAX)), {
    widget: "RECORD",
  }),
  method: z.enum(HTTP_METHOD),
  body: z.json(),
  latency: z.number().min(LATENCY.MIN).max(LATENCY.MAX).default(LATENCY.DEFAULT),
  statusCode: z.int().min(STATUS_CODE.MIN).max(STATUS_CODE.MAX).default(STATUS_CODE.DEFAULT),
  failureRate: z.int().min(FAILURE_RATE.MIN).max(FAILURE_RATE.MAX).default(FAILURE_RATE.DEFAULT),
});

const mockOutput = z.strictObject({
  statusCode: z.int().min(STATUS_CODE.MIN).max(STATUS_CODE.MAX),
  headers: z.record(z.string().max(HEADERS.KEY.MAX), z.string().max(HEADERS.VALUE.MAX)),
  body: z.unknown(),
});

export type HttpMockData = Base<z.infer<typeof mockConfig>, z.infer<typeof mockOutput>>;

const customConfig = z.strictObject({
  provider: withMeta(z.literal("CUSTOM_API"), { widget: "SELECT", hiddenOnNode: true }),

  headers: withMeta(z.record(z.string().max(HEADERS.KEY.MAX), z.string().max(HEADERS.VALUE.MAX)), {
    widget: "RECORD",
  }),
  method: withMeta(z.enum(HTTP_METHOD), { widget: "SELECT" }),
  body: withMeta(z.json(), { widget: "JSON" }),
  url: withMeta(z.url().max(URL.MAX), { widget: "TEXT" }),
});

const customOutput = z.strictObject({
  statusCode: z.int().min(STATUS_CODE.MIN).max(STATUS_CODE.MAX),
  headers: z.record(z.string().max(HEADERS.KEY.MAX), z.string().max(HEADERS.VALUE.MAX)),
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
