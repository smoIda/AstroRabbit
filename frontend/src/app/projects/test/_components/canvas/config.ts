import z from "zod";

import { Database, Globe } from "lucide-react";

import { CanvasNode } from "@/app/projects/test/_providers/editor/config";
import { DATABASE_SCHEMAS } from "@/app/projects/test/_components/canvas/nodes/core/database/config";
import { HTTP_REQUEST_SCHEMAS } from "@/app/projects/test/_components/canvas/nodes/core/http-request/config";

export const SETTINGS: Record<
  CanvasNode["type"],
  { maxInstances: number; maxIncomingEdges: number; maxOutgoingEdges: number }
> = {
  HTTP_REQUEST: {
    maxInstances: 1,
    maxIncomingEdges: 0,
    maxOutgoingEdges: 1,
  },

  DATABASE: {
    maxInstances: Infinity,
    maxIncomingEdges: 2,
    maxOutgoingEdges: 2,
  },
} as const;

export const NODE_DEFAULTS: {
  [K in CanvasNode["type"]]: Extract<CanvasNode, { type: K }>["data"];
} = {
  HTTP_REQUEST: {
    label: "HTTP Request Node",
    icon: Globe,
    badge: [],

    config: {
      provider: "CUSTOM_API",

      headers: {
        "Content-type": "application/json",
      },
      method: "GET",
      body: "Hello world",
      url: "https://httpbingo.org/get",
    },

    runtime: {
      status: "IDLE",
      duration: 0,
    },

    output: {
      statusCode: 0,
      headers: {},
      body: "Hello from X Y Z",
    },
  },

  DATABASE: {
    label: "/users",
    icon: Database,
    badge: [],

    config: {
      database: "MongoDB",
    },

    runtime: {
      status: "IDLE",
      duration: 0,
    },

    output: {
      body: "Yo",
    },
  },
};

export const CONFIG_SCHEMA_TYPES: Record<
  CanvasNode["type"],
  z.ZodObject | Record<string, z.ZodObject>
> = {
  HTTP_REQUEST: {
    MOCK_API: HTTP_REQUEST_SCHEMAS.MOCK_API.CONFIG,
    CUSTOM_API: HTTP_REQUEST_SCHEMAS.CUSTOM_API.CONFIG,
  },
  DATABASE: DATABASE_SCHEMAS.CONFIG,
};
