import z from "zod";

import { NodeData } from "@/app/projects/test/_providers/editor/config";
import { EditorActionContextValue } from "@/app/projects/test/_providers/editor/provider";
import { ConfigFieldMeta, nodeConfigRegistry } from "@/app/projects/test/_components/canvas/utils";
import { randomBadgeColor } from "@/app/projects/test/_components/layout/properties/config";
import { WIDGET_TYPES } from "@/app/projects/test/_components/layout/properties/inputs/config";

import { Badge } from "@/components/ui/primitives/badge";

import { formatText } from "@/lib/utils/formatText";
import { cn } from "@/lib/utils/cn";
import { useCallback, useRef } from "react";

type Form<T extends z.ZodRawShape> = {
  nodeId: string;
  schema: z.ZodObject<T>;
  config: NodeData["config"];
  action: EditorActionContextValue["action"];
};

type RenderWidget = {
  widget: ConfigFieldMeta["widget"];
  value: unknown;
  onChange: (v: unknown) => void;
};

function renderWidget({ widget, value, onChange }: RenderWidget) {
  switch (widget) {
    case "SELECT":
      return <WIDGET_TYPES.SELECT options={value as Array<string>} onChange={onChange} />;

    case "RECORD":
      return <WIDGET_TYPES.RECORD value={value as string} onChange={onChange} />;

    case "TEXT":
      return <WIDGET_TYPES.TEXT value={value as string} onChange={onChange} />;

    case "NUMBER":
      return <WIDGET_TYPES.NUMBER value={value as number} onChange={onChange} />;

    case "JSON":
      return <WIDGET_TYPES.JSON value={value as string} onChange={onChange} />;
  }
}

export function Form<T extends z.ZodRawShape>({ nodeId, config, schema, action }: Form<T>) {
  if (!schema.shape) return null;

  const delayRef = useRef<NodeJS.Timeout | null>(null);

  const onChange = useCallback(
    (key: string, value: unknown) => {
      if (delayRef.current) clearTimeout(delayRef.current);

      const delayMs = 500;

      delayRef.current = setTimeout(
        () =>
          action.patchNodeConfig(nodeId, {
            ...config,
            [key]: value,
          }),
        delayMs,
      );
    },
    [nodeId, config, action],
  );

  return (
    <div className="relative space-y-2">
      {Object.entries(schema.shape).map(([key, fieldSchema]) => {
        const widget = nodeConfigRegistry.get(fieldSchema)?.widget;

        if (!widget) return null;

        return (
          <div key={key} className="space-y-2">
            <Badge className={cn("border-0", randomBadgeColor(key))} size="md">
              {formatText(key)}
            </Badge>

            {renderWidget({
              widget,
              value: (config as Record<string, unknown>)[key],
              onChange: (v) => onChange(key, v),
            })}
          </div>
        );
      })}
    </div>
  );
}
