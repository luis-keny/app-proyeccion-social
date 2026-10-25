import { addDays, format, isValid, parse, parseISO, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";

export const MAX_ACTIVITY_DAYS = 366;
export const DAYS_PER_WEEK = 7;
export const DEFAULT_ACTIVITY_HOURS = 2;
export const DATE_INPUT_FORMAT = "dd/MM/yyyy";
export const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;
export const WEEKDAYS = [
  { value: 1, label: "L", name: "Lunes" }, { value: 2, label: "M", name: "Martes" },
  { value: 3, label: "X", name: "Miércoles" }, { value: 4, label: "J", name: "Jueves" },
  { value: 5, label: "V", name: "Viernes" }, { value: 6, label: "S", name: "Sábado" },
  { value: 0, label: "D", name: "Domingo" },
] as const;
export type RepeatMode = "once" | "daily" | "weekly" | "custom";
export type CreditRule = "all" | "minimum" | "per-attendance";
export type ActivitySchedule = {
  dates: string[]; repeat: RepeatMode; startTime: string; endTime: string;
  startDate: string; frequency: "daily" | "weekly"; interval: string; weekdays: number[];
  endMode: "date" | "count" | "never"; endDate: string; occurrences: string;
};
export type ActivityCredit = { rule: CreditRule; hours: number; minimumDays: number };

export function parseActivityDate(value: string): Date | null {
  const date = parse(value, DATE_INPUT_FORMAT, new Date(0));
  return isValid(date) && format(date, DATE_INPUT_FORMAT) === value ? date : null;
}

export function initialSchedule(previous?: ActivitySchedule): ActivitySchedule {
  return {
    dates: [], repeat: "once", startTime: "08:00", endTime: "10:00", startDate: "",
    frequency: "weekly", interval: "1", weekdays: [], endMode: "count", endDate: "", occurrences: "5",
    ...previous,
  };
}

export function buildSchedule(value: ActivitySchedule): { dates: string[]; error?: string; unbounded: boolean } {
  const unbounded = value.repeat !== "once" && value.endMode === "never";
  const fail = (error: string) => ({ dates: [], error, unbounded });
  const start = parseActivityDate(value.startDate);
  if (!start) return fail("Escribe una fecha válida: DD/MM/AAAA.");
  if (value.repeat === "once") return { dates: [format(start, "yyyy-MM-dd")], unbounded: false };
  const interval = value.repeat === "custom" ? Number(value.interval) : 1;
  if (!Number.isInteger(interval) || interval < 1 || interval > MAX_ACTIVITY_DAYS) return fail(`El intervalo debe estar entre 1 y ${MAX_ACTIVITY_DAYS}.`);
  const frequency = value.repeat === "custom" ? value.frequency : value.repeat;
  const weekdays = value.repeat === "custom" ? value.weekdays : [start.getDay()];
  if (frequency === "weekly" && !weekdays.length) return fail("Elige al menos un día de la semana.");
  const count = value.endMode === "count" ? Number(value.occurrences) : MAX_ACTIVITY_DAYS;
  if (!Number.isInteger(count) || count < 1 || count > MAX_ACTIVITY_DAYS) return fail(`La cantidad debe estar entre 1 y ${MAX_ACTIVITY_DAYS} jornadas.`);
  const end = value.endMode === "date" ? parseActivityDate(value.endDate) : null;
  if (value.endMode === "date" && (!end || end < start)) return fail("La fecha final debe ser igual o posterior al inicio.");
  const dates: string[] = [];
  const firstWeek = startOfWeek(start, { weekStartsOn: 1 });
  // Jump directly to matching days; never scan an endless series day by day.
  const weekOffsets = [...new Set(weekdays)].map((day) => (day + DAYS_PER_WEEK - 1) % DAYS_PER_WEEK).sort((a, b) => a - b);
  outer: for (let cycle = 0; cycle <= MAX_ACTIVITY_DAYS; cycle++) {
    const candidates = frequency === "daily" ? [addDays(start, cycle * interval)] : weekOffsets.map((offset) => addDays(firstWeek, cycle * interval * DAYS_PER_WEEK + offset));
    for (const day of candidates) {
      if (day < start) continue;
      if (end && day > end) break outer;
      if (dates.length === MAX_ACTIVITY_DAYS) {
        if (end) return fail(`Acorta el rango a un máximo de ${MAX_ACTIVITY_DAYS} jornadas.`);
        break outer;
      }
      dates.push(format(day, "yyyy-MM-dd"));
      if (value.endMode === "count" && dates.length === count) break outer;
    }
  }
  return dates.length ? { dates, unbounded } : fail("No hay jornadas en ese rango. Revisa los días o la fecha final.");
}

export function creditSummary(credit: ActivityCredit, days: number, unbounded = false): string {
  if (credit.rule === "per-attendance") return unbounded ? `${credit.hours} h por asistencia · sin fecha de fin.` : `${credit.hours} h por asistencia · hasta ${credit.hours * days} h.`;
  if (credit.rule === "minimum") return `${credit.hours} h al asistir a ${credit.minimumDays}${unbounded ? " jornadas" : ` de ${days} jornadas`}.`;
  return `${credit.hours} h al asistir a todas las jornadas (${days}).`;
}

export function scheduleLabel(schedule: ActivitySchedule): string {
  const first = schedule.dates[0];
  if (!first) return "Sin fechas";
  const label = format(parseISO(first), "d MMM yyyy", { locale: es });
  if (schedule.repeat !== "once" && schedule.endMode === "never") return `Desde ${label} · sin fecha de fin`;
  return schedule.dates.length === 1 ? label : `${label} – ${format(parseISO(schedule.dates.at(-1)!), "d MMM yyyy", { locale: es })} · ${schedule.dates.length} jornadas`;
}
