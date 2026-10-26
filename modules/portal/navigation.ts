import { Compass, FileSpreadsheet, Gauge, LayoutDashboard, QrCode, ShieldCheck, type LucideIcon } from "lucide-react";

export const ROLE_LABELS = { estudiante: "Estudiante", asistente: "Asistente", administrador: "Administrador" } as const;
export type RoleSlug = keyof typeof ROLE_LABELS;
export type Role = (typeof ROLE_LABELS)[RoleSlug];
export type WorkspaceView = "overview" | "reports" | "progress" | "activities" | "qr" | "attendance";
type ViewDefinition = { id: WorkspaceView; segment: string; label: string; title: string; description: string; icon: LucideIcon; roles: readonly RoleSlug[] };
export const navigation: readonly ViewDefinition[] = [
  { id: "overview", segment: "resumen", label: "Resumen general", title: "Resumen de proyección social", description: "Consulta los indicadores y el avance de los estudiantes por ciclo académico.", icon: LayoutDashboard, roles: ["administrador"] },
  { id: "reports", segment: "reportes", label: "Reporte de alumnos", title: "Reporte de alumnos", description: "Consulta las horas por ciclo y el total acumulado. Selecciona un nombre para ver su detalle.", icon: FileSpreadsheet, roles: ["administrador"] },
  { id: "progress", segment: "progreso", label: "Mi progreso", title: "Mis horas de proyección social", description: "Revisa tus horas y encuentra tu próxima actividad.", icon: Gauge, roles: ["estudiante", "asistente"] },
  { id: "activities", segment: "actividades", label: "Actividades", title: "Actividades de proyección social", description: "Encuentra dónde compartir tus talentos.", icon: Compass, roles: ["estudiante", "asistente", "administrador"] },
  { id: "qr", segment: "mi-qr", label: "Mi QR", title: "Mi código QR", description: "Muestra tu código al asistente para registrar tu participación.", icon: QrCode, roles: ["estudiante", "asistente"] },
  { id: "attendance", segment: "asistencia", label: "Registrar asistencia", title: "Registro de asistencia", description: "Selecciona una actividad y revisa el flujo de identificación del estudiante.", icon: ShieldCheck, roles: ["asistente", "administrador"] },
];
export function isRoleSlug(value: string): value is RoleSlug { return Object.hasOwn(ROLE_LABELS, value); }
export function getViewPath(role: RoleSlug, view: WorkspaceView) {
  const definition = navigation.find((item) => item.id === view)!;
  return `/workspace/${role}/${definition.segment}`;
}
export function getInitialPath(role: RoleSlug) { return getViewPath(role, role === "administrador" ? "overview" : "progress"); }
export function getActivityPath(role: RoleSlug, activityId: string) {
  return `${getViewPath(role, "activities")}/${encodeURIComponent(activityId)}`;
}
