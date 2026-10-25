import { addDays, differenceInCalendarDays, format, parseISO, startOfWeek } from "date-fns";
import { es } from "date-fns/locale";
import { DAYS_PER_WEEK, parseActivityDate, WEEKDAYS, type ActivitySchedule } from "./scheduling";

export function formatActivityDate(value: string): string {
  return format(parseISO(value), "EEE, d MMM yyyy", { locale: es });
}

export function recurrenceLabel(schedule: ActivitySchedule): string {
  if (schedule.repeat === "once") return "Día único";
  if (schedule.repeat === "daily") return "Todos los días";
  const start = parseActivityDate(schedule.startDate);
  if (schedule.repeat === "weekly") return start ? `Cada ${format(start, "EEEE", { locale: es })}` : "Cada semana";
  const interval = Number(schedule.interval);
  if (schedule.frequency === "daily") return interval === 1 ? "Todos los días" : `Cada ${interval} días`;
  const days = WEEKDAYS.filter((day) => schedule.weekdays.includes(day.value)).map((day) => day.name.toLowerCase());
  return `${interval === 1 ? "Cada semana" : `Cada ${interval} semanas`} · ${days.join(", ")}`;
}

export function terminationLabel(schedule: ActivitySchedule): string {
  if (schedule.repeat === "once") return "Una jornada";
  if (schedule.endMode === "never") return "Sin fecha de fin";
  if (schedule.endMode === "date") return `Hasta el ${schedule.endDate} · ${schedule.dates.length} jornadas`;
  return `${schedule.dates.length} jornadas · termina el ${format(parseISO(schedule.dates.at(-1)!), "d MMM yyyy", { locale: es })}`;
}

export function nextActivityDate(schedule: ActivitySchedule, referenceTime: string): string | null {
  const parts = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Lima", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(new Date(referenceTime));
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)!.value;
  const today = `${part("year")}-${part("month")}-${part("day")}`;
  const time = `${part("hour")}:${part("minute")}`;
  const available = (date: string) => date > today || (date === today && schedule.endTime > time);
  if (schedule.repeat === "once" || schedule.endMode !== "never") return schedule.dates.find(available) ?? null;
  const start = parseActivityDate(schedule.startDate);
  if (!start) return null;
  const initial = start > parseISO(today) ? start : parseISO(today);
  const interval = schedule.repeat === "custom" ? Number(schedule.interval) : 1;
  const frequency = schedule.repeat === "custom" ? schedule.frequency : schedule.repeat;
  const weekdays = schedule.repeat === "custom" ? schedule.weekdays : [start.getDay()];
  const firstWeek = startOfWeek(start, { weekStartsOn: 1 });
  const maxSearchDays = interval * DAYS_PER_WEEK;
  for (let offset = 0; offset <= maxSearchDays; offset++) {
    const candidate = addDays(initial, offset);
    const days = differenceInCalendarDays(candidate, start);
    const week = Math.floor(differenceInCalendarDays(candidate, firstWeek) / DAYS_PER_WEEK);
    const matches = frequency === "daily" ? days % interval === 0 : week % interval === 0 && weekdays.includes(candidate.getDay());
    const date = format(candidate, "yyyy-MM-dd");
    if (matches && available(date)) return date;
  }
  return null;
}
