import { Title } from "@/app/projects/test/_components/layout/properties/misc";
import { randomBadgeColor } from "@/app/projects/test/_components/layout/properties/config";
import { NodeData } from "@/app/projects/test/_providers/editor/config";

import { Badge } from "@/components/ui/primitives/badge";

import { cn } from "@/lib/utils/cn";
import { formatText } from "@/lib/utils/formatText";

type PropertiesOutputs = {
  output: NodeData["output"];
};

export function PropertiesOutputs({ output }: PropertiesOutputs) {
  return (
    <div className="space-y-2">
      <Title label="OUTPUTS" info="output" />

      {Object.entries(output).map(([key, value]) => {
        const displayValue = typeof value === "string" ? value : JSON.stringify(value, null, 2);

        return (
          <div key={key} className="relative space-y-2">
            <Badge className={cn("border-0", randomBadgeColor(key))} size="md">
              {formatText(key)}
            </Badge>

            <pre className="bg-ink-soft/5 custom-scroll text-ink outline-ink flex min-w-20 flex-1 items-center justify-between overflow-x-auto p-2 focus:outline-1">
              {displayValue}
            </pre>
          </div>
        );
      })}
    </div>
  );
}
