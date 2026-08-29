import {
  inputClasses,
  Widget,
} from "@/app/projects/test/_components/layout/properties/inputs/config";

export function TextInput({ value, onChange }: Widget["TEXT"]) {
  return (
    <div className="group flex items-center justify-center">
      <input
        placeholder="Value"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClasses}
      />
    </div>
  );
}
