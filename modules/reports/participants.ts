import { ALL_CYCLES, type StudentReportItem } from "./fixtures";

export type GoalRule = { year: number; hours: number };
export const INITIAL_GOAL_RULES: GoalRule[] = [
  { year: 2023, hours: 50 }, { year: 2026, hours: 120 },
];
export function applicableGoalRule(year: number, rules: GoalRule[]) {
  return rules.reduce<GoalRule | undefined>((selected, rule) => rule.year <= year && (!selected || rule.year > selected.year) ? rule : selected, undefined);
}
export const DNI_LENGTH = 8;
export const ADMISSION_YEAR_DIGITS = 4;
export const DEFAULT_CAREER_CYCLES = 10;
export const CURRENT_REPORT_PERIOD = "2026-II";
export const PARTICIPANT_COLUMNS = ["tipo", "nombre", "dni", "codigo", "escuela", "anio_ingreso", "ciclo_actual", "ciclos_carrera"] as const;
export type ParticipantInput = Record<(typeof PARTICIPANT_COLUMNS)[number], string>;
export const EMPTY_PARTICIPANT: ParticipantInput = {
  tipo: "estudiante", nombre: "", dni: "", codigo: "", escuela: "",
  anio_ingreso: "", ciclo_actual: "", ciclos_carrera: String(DEFAULT_CAREER_CYCLES),
};
export type ParticipantIssue = { field: keyof ParticipantInput; message: string };
export type ParticipantReview = { input: ParticipantInput; issues: ParticipantIssue[]; goalHours: number | null; row: number };

export function totalHours(person: StudentReportItem) {
  return ALL_CYCLES.reduce((sum, cycle) => sum + person.cycles[cycle].hours, 0);
}

export function academicProgress(person: StudentReportItem) {
  if (person.participantType !== "student") return null;
  const expected = person.assignedGoalHours / person.careerCycles * person.currentCycle;
  const hours = totalHours(person);
  return { expected, gap: Math.max(0, expected - hours), observed: hours < expected, completed: hours >= person.assignedGoalHours };
}

export function participantStatus(person: StudentReportItem) {
  const progress = academicProgress(person);
  if (!progress) return "No aplica";
  return progress.completed ? "Meta cumplida" : progress.observed ? "Observado" : "Al día";
}

export function reviewParticipants(inputs: ParticipantInput[], existing: StudentReportItem[], rules: GoalRule[]): ParticipantReview[] {
  const knownDnis = new Set(existing.map((person) => person.dni));
  const knownCodes = new Set(existing.flatMap((person) => person.participantType === "student" ? [person.studentCode.toLowerCase()] : []));
  const dniCounts = new Map<string, number>();
  const codeCounts = new Map<string, number>();
  const normalized = inputs.map((raw) => Object.fromEntries(Object.entries(raw).map(([key, value]) => [key, value.trim()])) as ParticipantInput);
  for (const item of normalized) {
    dniCounts.set(item.dni, (dniCounts.get(item.dni) ?? 0) + 1);
    if (item.tipo === "estudiante" && item.codigo) {
      const key = item.codigo.toLowerCase();
      codeCounts.set(key, (codeCounts.get(key) ?? 0) + 1);
    }
  }
  return normalized.map((input, index) => {
    const issues: ParticipantIssue[] = [];
    const issue = (field: keyof ParticipantInput, message: string) => issues.push({ field, message });
    if (!["estudiante", "beneficiario"].includes(input.tipo)) issue("tipo", "Tipo: estudiante o beneficiario.");
    if (!input.nombre) issue("nombre", "Completa el nombre.");
    if (!new RegExp(`^\\d{${DNI_LENGTH}}$`).test(input.dni)) issue("dni", "El DNI debe tener 8 dígitos; conserva los ceros iniciales.");
    if (knownDnis.has(input.dni) || (dniCounts.get(input.dni) ?? 0) > 1) issue("dni", "DNI duplicado en el reporte o en el archivo.");
    let goalHours: number | null = null;
    if (input.tipo === "estudiante") {
      if (!input.codigo) issue("codigo", "Completa el código universitario.");
      else if (knownCodes.has(input.codigo.toLowerCase()) || (codeCounts.get(input.codigo.toLowerCase()) ?? 0) > 1) issue("codigo", "Código duplicado en el reporte o en el archivo.");
      if (!input.escuela) issue("escuela", "Completa la escuela.");
      if (!new RegExp(`^\\d{${ADMISSION_YEAR_DIGITS}}$`).test(input.anio_ingreso) || Number(input.anio_ingreso) === 0) issue("anio_ingreso", "Indica un año de ingreso de cuatro dígitos.");
      const rule = applicableGoalRule(Number(input.anio_ingreso), rules);
      if (!rule) issue("anio_ingreso", "No hay una meta vigente para este año de ingreso. Configura una desde ese año o uno anterior.");
      else goalHours = rule.hours;
      const current = Number(input.ciclo_actual), total = Number(input.ciclos_carrera);
      if (!Number.isSafeInteger(total) || total < 1) issue("ciclos_carrera", "Los ciclos de carrera deben ser un entero positivo.");
      if (!Number.isSafeInteger(current) || current < 1 || current > total) issue("ciclo_actual", "El ciclo actual debe estar entre 1 y los ciclos de la carrera.");
    } else if (input.tipo === "beneficiario") {
      if ([input.codigo, input.escuela, input.anio_ingreso, input.ciclo_actual, input.ciclos_carrera].some(Boolean)) issue("tipo", "Deja vacíos los campos académicos del beneficiario.");
    }
    return { input, issues, goalHours, row: index + 2 };
  });
}

export function createParticipant(review: ParticipantReview): StudentReportItem {
  if (review.issues.length) throw new Error("Revisa los datos antes de agregar.");
  const { input } = review;
  const base = {
    id: crypto.randomUUID(), name: input.nombre, dni: input.dni,
    initials: input.nombre.split(/\s+/).slice(0, 2).map((word) => word[0]).join("").toUpperCase(),
    email: "", activities: [],
    cycles: Object.fromEntries(ALL_CYCLES.map((cycle) => [cycle, {
      cycle, year: cycle.slice(0, 4), semester: cycle.endsWith("-I") ? "Ciclo I" : "Ciclo II",
      hours: 0, goalHours: 0, activitiesCount: 0, mainProject: "", lastDate: "", status: "En curso",
    }])) as StudentReportItem["cycles"],
  };
  if (input.tipo === "beneficiario") return {
    ...base, participantType: "beneficiary", studentCode: null,
    faculty: "Personas externas", currentSemesterLabel: "", assignedGoalHours: 0,
  };
  return {
    ...base, participantType: "student", studentCode: input.codigo, faculty: input.escuela,
    admissionYear: Number(input.anio_ingreso), currentCycle: Number(input.ciclo_actual), careerCycles: Number(input.ciclos_carrera),
    currentSemesterLabel: `${input.ciclo_actual}.º ciclo`, assignedGoalHours: review.goalHours!,
  };
}
