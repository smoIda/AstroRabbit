import { SelectInput } from "@/app/projects/test/_components/layout/properties/inputs/widgets/select";
import { RecordInput } from "@/app/projects/test/_components/layout/properties/inputs/widgets/record";
import { TextInput } from "@/app/projects/test/_components/layout/properties/inputs/widgets/text";
import { NumberInput } from "@/app/projects/test/_components/layout/properties/inputs/widgets/number";
import { JsonInput } from "@/app/projects/test/_components/layout/properties/inputs/widgets/json";

export const fieldClasses =
  "bg-ink-soft/5 text-ink outline-ink flex min-w-20 flex-1 items-center justify-between p-2 focus:outline";

export type Widget = {
  SELECT: {
    options: string[];
    onChange: (v: unknown) => void;
  };

  RECORD: {
    value: string;
    onChange: (v: Record<string, string>) => void;
  };

  TEXT: {
    value: string;
    onChange: (v: string) => void;
  };

  NUMBER: {
    value: number;
    onChange: (v: number) => void;
  };

  JSON: {
    value: string;
    onChange: (v: string) => void;
  };
};

export const WIDGET_TYPES: { [K in keyof Widget]: React.ComponentType<Widget[K]> } = {
  SELECT: SelectInput,
  RECORD: RecordInput,
  TEXT: TextInput,
  NUMBER: NumberInput,
  JSON: JsonInput,
};


