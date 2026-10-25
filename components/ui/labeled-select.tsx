"use client";

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Option<T extends string> = { value: T; label: string };

export function LabeledSelect<T extends string>({ label, value, options, onValueChange, className }: {
  label: string;
  value: T;
  options: readonly Option<T>[];
  onValueChange: (value: T) => void;
  className?: string;
}) {
  return (
    <Select value={value} items={options} onValueChange={(next) => { if (next !== null) onValueChange(next); }}>
      <SelectTrigger aria-label={label} className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
