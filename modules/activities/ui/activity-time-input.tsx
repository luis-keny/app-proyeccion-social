"use client";

import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList, ComboboxTrigger } from "@/components/ui/combobox";
import { InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";

const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;
const SUGGESTION_STEP_MINUTES = 15;
const TIME_OPTIONS = Array.from({ length: HOURS_PER_DAY * MINUTES_PER_HOUR / SUGGESTION_STEP_MINUTES }, (_, index) => {
  const minutes = index * SUGGESTION_STEP_MINUTES;
  return `${String(Math.floor(minutes / MINUTES_PER_HOUR)).padStart(2, "0")}:${String(minutes % MINUTES_PER_HOUR).padStart(2, "0")}`;
});

function normalizeTime(value: string) {
  const match = value.trim().match(/^(\d{1,2})(?::?(\d{2}))?$/);
  if (!match || Number(match[1]) >= HOURS_PER_DAY || Number(match[2] ?? 0) >= MINUTES_PER_HOUR) return value;
  return `${match[1].padStart(2, "0")}:${match[2] ?? "00"}`;
}

export function ActivityTimeInput({ id, value, onChange }: { id: string; value: string; onChange: (value: string) => void }) {
  return <Combobox items={TIME_OPTIONS} value={value} inputValue={value} onInputValueChange={onChange} onValueChange={(next) => { if (next) onChange(next); }}>
    <ComboboxInput id={id} placeholder="HH:mm" showTrigger={false} onBlur={() => onChange(normalizeTime(value))}>
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" variant="ghost" render={<ComboboxTrigger aria-label={id === "activity-start-time" ? "Sugerir hora de inicio" : "Sugerir hora de fin"} />} />
      </InputGroupAddon>
    </ComboboxInput>
    <ComboboxContent>
      <ComboboxEmpty>Escribe una hora en formato HH:mm.</ComboboxEmpty>
      <ComboboxList>{(time: string) => <ComboboxItem key={time} value={time}>{time}</ComboboxItem>}</ComboboxList>
    </ComboboxContent>
  </Combobox>;
}
