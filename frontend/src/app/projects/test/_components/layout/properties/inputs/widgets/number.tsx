import {
  inputClasses,
  Widget,
} from "@/app/projects/test/_components/layout/properties/inputs/config";

export function NumberInput({ value, onChange }: Widget["NUMBER"]) {
  return (
    <div className="group flex items-center justify-center">
      <input
        placeholder="Value"
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClasses}
      />
    </div>
  );
}
