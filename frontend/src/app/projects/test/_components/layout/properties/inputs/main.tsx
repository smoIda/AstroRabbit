import { resolveConfigSchema } from "@/app/projects/test/_components/canvas/utils";
import { CONFIG_SCHEMA_TYPES } from "@/app/projects/test/_components/layout/properties/inputs/config";
import { Form } from "@/app/projects/test/_components/layout/properties/inputs/form";
import { Title } from "@/app/projects/test/_components/layout/properties/misc";
import { CanvasNode, NodeData } from "@/app/projects/test/_providers/editor/config";
import { EditorActionContextValue } from "@/app/projects/test/_providers/editor/provider";

type PropertiesInputs = {
  node: CanvasNode;
  config: NodeData["config"];
  action: EditorActionContextValue["action"];
};

export function PropertiesInputs({ node, config, action }: PropertiesInputs) {
  const entry = CONFIG_SCHEMA_TYPES[node.type];
  const schema = resolveConfigSchema(entry, config);

  if (!schema) return null;

  return (
    <div className="space-y-2">
      <Title label="INPUTS" info="input" />

      <Form schema={schema} nodeId={node.id} config={config} action={action} />
    </div>
  );
}
