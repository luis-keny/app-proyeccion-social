"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarClock } from "lucide-react";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LabeledSelect } from "@/components/ui/labeled-select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { buildSchedule, parseActivityDate, WEEKDAYS, type ActivitySchedule, type RepeatMode } from "../scheduling";
import { ActivityTimeInput } from "./activity-time-input";

const REPEAT_OPTIONS = [
  { value: "once", label: "Día único" }, { value: "daily", label: "Todos los días" },
  { value: "weekly", label: "Cada semana" }, { value: "custom", label: "Personalizado" },
] as const;
const END_OPTIONS = [{ value: "date", label: "En una fecha" }, { value: "count", label: "Después de…" }, { value: "never", label: "Sin fecha de fin" }] as const;
const FREQUENCY_OPTIONS = [{ value: "daily", label: "días" }, { value: "weekly", label: "semanas" }] as const;

function dateMask(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join("/");
}

export function ActivityScheduleFields({ value, onChange }: { value: ActivitySchedule; onChange: (value: ActivitySchedule) => void }) {
  const result = buildSchedule(value);
  const start = parseActivityDate(value.startDate);
  function setRepeat(repeat: RepeatMode) {
    onChange({ ...value, repeat, weekdays: value.weekdays.length ? value.weekdays : start ? [start.getDay()] : [] });
  }
  return <FieldSet className="activity-form-section">
    <FieldLegend className="activity-section-title"><CalendarClock aria-hidden="true" />Programación</FieldLegend>
    <FieldGroup className="gap-4">
      <FieldGroup className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel htmlFor="activity-date">{value.repeat === "once" ? "Fecha" : "Desde"}</FieldLabel>
          <Input id="activity-date" inputMode="numeric" placeholder="DD/MM/AAAA" maxLength={10} value={value.startDate} onChange={(event) => onChange({ ...value, startDate: dateMask(event.target.value) })} />
        </Field>
        <Field>
          <FieldLabel>Repetir</FieldLabel>
          <LabeledSelect label="Repetir" value={value.repeat} options={REPEAT_OPTIONS} onValueChange={setRepeat} className="w-full" />
        </Field>
      </FieldGroup>
      {value.repeat === "custom" && <FieldSet className="rounded-lg border bg-background p-3">
        <FieldLegend variant="label">Repetición personalizada</FieldLegend>
        <FieldGroup className="gap-3">
          <Field>
            <FieldLabel htmlFor="activity-interval">Cada</FieldLabel>
            <div className="flex gap-2">
              <Input id="activity-interval" className="w-20" inputMode="numeric" value={value.interval} onChange={(event) => onChange({ ...value, interval: event.target.value })} />
              <LabeledSelect label="Unidad de repetición" value={value.frequency} options={FREQUENCY_OPTIONS} onValueChange={(frequency) => onChange({ ...value, frequency })} />
            </div>
          </Field>
          {value.frequency === "weekly" && <Field>
            <FieldLabel>Días</FieldLabel>
            <ToggleGroup multiple variant="outline" spacing={1} aria-label="Días de la semana" value={value.weekdays.map(String)} onValueChange={(days) => onChange({ ...value, weekdays: days.map(Number) })}>
              {WEEKDAYS.map((day) => <ToggleGroupItem key={day.value} value={String(day.value)} aria-label={day.name} className="size-8 p-0">{day.label}</ToggleGroupItem>)}
            </ToggleGroup>
          </Field>}
        </FieldGroup>
      </FieldSet>}
      {value.repeat !== "once" && <FieldGroup className="grid grid-cols-2 gap-3">
        <Field>
          <FieldLabel>Termina</FieldLabel>
          <LabeledSelect label="Termina" value={value.endMode} options={END_OPTIONS} onValueChange={(endMode) => onChange({ ...value, endMode })} className="w-full" />
        </Field>
        {value.endMode === "date" && <Field>
          <FieldLabel htmlFor="activity-until">Hasta</FieldLabel>
          <Input id="activity-until" inputMode="numeric" maxLength={10} placeholder="DD/MM/AAAA" value={value.endDate} onChange={(event) => onChange({ ...value, endDate: dateMask(event.target.value) })} />
        </Field>}
        {value.endMode === "count" && <Field>
          <FieldLabel htmlFor="activity-days">Jornadas</FieldLabel>
          <Input id="activity-days" inputMode="numeric" value={value.occurrences} onChange={(event) => onChange({ ...value, occurrences: event.target.value })} />
        </Field>}
      </FieldGroup>}
      <FieldGroup className="grid grid-cols-2 gap-3">
        <Field><FieldLabel htmlFor="activity-start-time">Inicio</FieldLabel><ActivityTimeInput id="activity-start-time" value={value.startTime} onChange={(startTime) => onChange({ ...value, startTime })} /></Field>
        <Field><FieldLabel htmlFor="activity-end-time">Fin</FieldLabel><ActivityTimeInput id="activity-end-time" value={value.endTime} onChange={(endTime) => onChange({ ...value, endTime })} /></Field>
      </FieldGroup>
      <FieldDescription aria-live="polite">{result.error ? "Fechas: DD/MM/AAAA · Hora de Lima" : result.unbounded ? "Se repite sin fecha de fin · Hora de Lima" : `${result.dates.length} ${result.dates.length === 1 ? "jornada" : "jornadas"}${value.repeat === "weekly" && start ? ` · cada ${format(start, "EEEE", { locale: es })}` : ""} · Hora de Lima`}</FieldDescription>
    </FieldGroup>
  </FieldSet>;
}
