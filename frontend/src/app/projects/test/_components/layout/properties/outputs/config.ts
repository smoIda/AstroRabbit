import { JsonOutput } from "@/app/projects/test/_components/layout/properties/widgets/json";
import { NumberOutput } from "@/app/projects/test/_components/layout/properties/widgets/number";
import { RecordOutput } from "@/app/projects/test/_components/layout/properties/widgets/record";
import { TextOutput } from "@/app/projects/test/_components/layout/properties/widgets/text";

export type OutputWidget = {
  TABLE: { value: Record<string, unknown> };
  RECORD: { value: Record<string, unknown> };
  TEXT: { value: string };
  NUMBER: { value: number };
  JSON: { value: string };
};

export const OUTPUT_WIDGET_TYPES: {
  [K in keyof OutputWidget]: React.ComponentType<OutputWidget[K]>;
} = {
  TABLE: RecordOutput,
  RECORD: RecordOutput,
  TEXT: TextOutput,
  NUMBER: NumberOutput,
  JSON: JsonOutput,
};
