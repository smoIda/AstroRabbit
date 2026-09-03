import { useCallback, useEffect, useRef } from "react";

import {
  CONFIG_SCHEMA_TYPES,
  ConfigFieldMeta,
} from "@/app/projects/test/_components/canvas/config";
import {
  nodeConfigRegistry,
  resolveConfigSchema,
} from "@/app/projects/test/_components/canvas/utils";
import { randomBadgeColor } from "@/app/projects/test/_components/layout/properties/config";
import { CONFIG_WIDGET_TYPES } from "@/app/projects/test/_components/layout/properties/inputs/config";
import { Title } from "@/app/projects/test/_components/layout/properties/misc";
import { CanvasNode, NodeData } from "@/app/projects/test/_providers/editor/config";
import {
  toArray,
  toJSON,
  toNumber,
  toObject,
  toString,
} from "@/app/projects/test/_components/layout/properties/utils";

import { Badge } from "@/components/ui/primitives/badge";
import { Diamond } from "@/components/ui/decorations/diamond";

import { cn } from "@/lib/utils/cn";
import { formatText } from "@/lib/utils/formatText";

type PropertiesInputs = {
  nodeId: string;
  nodeType: CanvasNode["type"];
  config: NodeData["config"];
  onPatch: (nodeId: string, k: string, v: unknown) => void;
};

type Widget = {
  meta: ConfigFieldMeta;
  value: unknown;
  onChange: (v: unknown) => void;
};

function Widget({ meta, value, onChange }: Widget) {
  switch (meta.widget) {
    case "SELECT":
      return (
        <CONFIG_WIDGET_TYPES.SELECT
          value={toString(value)}
          options={meta.options}
          onChange={onChange}
        />
      );

    case "MULTI_SELECT":
      return (
        <CONFIG_WIDGET_TYPES.MULTI_SELECT
          value={toArray(value)}
          options={meta.options}
          onChange={onChange}
        />
      );

    case "RECORD":
      return <CONFIG_WIDGET_TYPES.RECORD value={toObject(value)} onChange={onChange} />;

    case "TEXT":
      return <CONFIG_WIDGET_TYPES.TEXT value={toString(value)} onChange={onChange} />;

    case "NUMBER":
      return <CONFIG_WIDGET_TYPES.NUMBER value={toNumber(value)} onChange={onChange} />;

    case "JSON":
      return <CONFIG_WIDGET_TYPES.JSON value={toJSON(value)} onChange={onChange} />;
  }
}

export function PropertiesInputs({ nodeId, nodeType, config, onPatch }: PropertiesInputs) {
  const schema = resolveConfigSchema(CONFIG_SCHEMA_TYPES[nodeType], config);

  if (!schema) return null;

  const delayRef = useRef<NodeJS.Timeout | null>(null);

  const onChange = useCallback(
    (key: string, value: unknown) => {
      if (delayRef.current) clearTimeout(delayRef.current);

      delayRef.current = setTimeout(() => onPatch(nodeId, key, value), 500);
    },
    [nodeId, onPatch],
  );

  useEffect(() => {
    return () => {
      if (delayRef.current) clearTimeout(delayRef.current);
    };
  }, []);

  return (
    <div className="space-y-2">
      <Title label="INPUTS" hasData={true} />

      <div className="relative space-y-2">
        {Object.entries(schema.shape).map(([key, fieldSchema]) => {
          const meta = nodeConfigRegistry.get(fieldSchema);

          if (!meta) return null;

          if (meta.hiddenWhen(config)) return null;

          return (
            <div key={key} className="relative space-y-2 pl-4">
              <Diamond borderColor="black-soft" className="absolute top-1.25 left-0 opacity-40" />

              <Badge className={cn("border-0", randomBadgeColor(key))} size="md">
                {formatText(key)}
              </Badge>

              <Widget
                meta={meta}
                value={(config as Record<string, unknown>)[key]}
                onChange={(v) => onChange(key, v)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
