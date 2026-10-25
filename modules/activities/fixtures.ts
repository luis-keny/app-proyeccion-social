import { Activity, FileText, HeartHandshake } from "lucide-react";
import type { SocialActivity } from "./model";
import { buildSchedule, initialSchedule, scheduleLabel, type ActivityCredit, type ActivitySchedule } from "./scheduling";

const EXAMPLE_RADIUS_METERS = 50;
function exampleActivity(base: Pick<SocialActivity, "id" | "title" | "description" | "area" | "place" | "icon" | "lat" | "lng">, programming: Partial<ActivitySchedule>, credit: ActivityCredit): SocialActivity {
  const draft = { ...initialSchedule(), ...programming };
  const schedule = { ...draft, dates: buildSchedule(draft).dates };
  const total = credit.rule === "per-attendance" ? credit.hours * schedule.dates.length : credit.hours;
  return { ...base, radiusMeters: EXAMPLE_RADIUS_METERS, schedule, credit, date: scheduleLabel(schedule), time: `${schedule.startTime} – ${schedule.endTime}`, hours: `${total} h` };
}

export const INITIAL_ACTIVITIES: SocialActivity[] = [
  exampleActivity({ id: "activity-food", title: "Manos que alimentan", description: "Colaboraremos con el equipo del comedor en la preparación y entrega de alimentos. Lleva ropa cómoda y una botella de agua. El punto de encuentro está señalado en el mapa.", area: "Comunidad · Servicio", place: "Comedor San José", icon: HeartHandshake, lat: -12.0464, lng: -77.0428 }, { startDate: "31/10/2026", repeat: "weekly", occurrences: "3", startTime: "08:00", endTime: "12:00" }, { rule: "all", hours: 4, minimumDays: 3 }),
  exampleActivity({ id: "activity-reading", title: "Lectura para todos", description: "Acompañaremos a niños y niñas en sesiones de lectura y actividades de comprensión. No necesitas experiencia previa: el equipo compartirá los materiales y organizará los grupos al iniciar cada jornada.", area: "Educación · Voluntariado", place: "Biblioteca Central", icon: FileText, lat: -12.0561, lng: -77.0845 }, { startDate: "26/10/2026", repeat: "custom", frequency: "weekly", weekdays: [1, 3], occurrences: "5", startTime: "15:30", endTime: "17:30" }, { rule: "minimum", hours: 2, minimumDays: 3 }),
  exampleActivity({ id: "activity-health", title: "Jornada de salud", description: "Apoyaremos en la orientación de visitantes y la organización de los espacios de la jornada de salud. El equipo coordinador asignará las tareas en el punto de encuentro.", area: "Bienestar · Comunidad", place: "Clínica Universitaria", icon: Activity, lat: -12.0797, lng: -77.0357 }, { startDate: "31/10/2026", repeat: "once", startTime: "09:00", endTime: "12:00" }, { rule: "per-attendance", hours: 3, minimumDays: 1 }),
];
