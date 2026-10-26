"use client";

import { AlertTriangle, ArrowUpRight, CheckCircle2, Flag, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatActivityDate, nextActivityDate } from "@/modules/activities/presentation";
import { creditSummary } from "@/modules/activities/scheduling";
import { getActivityPath, getViewPath } from "@/modules/portal/navigation";
import { useWorkspace } from "@/modules/portal/ui/workspace-provider";
import { academicProgress, CURRENT_REPORT_PERIOD } from "../participants";
import { useReports } from "./reports-provider";
import { AcademicStatusChart, ParticipationChart, SchoolProgressChart } from "./overview-charts";

const UPCOMING_PREVIEW_COUNT = 3;

export function AdminOverview({ referenceTime }: { referenceTime: string }) {
  const { participants } = useReports();
  const { activities } = useWorkspace();
  const students = participants.filter((person) => person.participantType === "student");
  const tracked = students.map((student) => ({ student, progress: academicProgress(student)! }));
  const observed = tracked.filter((item) => item.progress.observed);
  const completed = tracked.filter((item) => item.progress.completed);
  const finalCyclePending = tracked.filter(({ student, progress }) => student.currentCycle === student.careerCycles && !progress.completed);
  const active = students.filter((student) => student.activities.some((activity) => activity.cycle === CURRENT_REPORT_PERIOD && activity.status === "Validado"));
  const inactiveObserved = observed.filter(({ student }) => !student.activities.some((activity) => activity.cycle === CURRENT_REPORT_PERIOD && activity.status === "Validado"));
  const percentage = (count: number) => students.length ? `${Math.round(count / students.length * 100)}%` : "Sin estudiantes";
  const schools = [...new Set(students.map((student) => student.faculty))].map((name) => {
    const members = tracked.filter(({ student }) => student.faculty === name);
    const delayed = members.filter(({ progress }) => progress.observed);
    return { name, count: members.length, observed: delayed.length, rate: delayed.length / members.length, gap: delayed.length ? delayed.reduce((sum, item) => sum + item.progress.gap, 0) / delayed.length : 0 };
  }).sort((a, b) => b.rate - a.rate || a.name.localeCompare(b.name));
  const upcoming = activities.flatMap((activity) => {
    if (!activity.schedule) return [];
    const date = nextActivityDate(activity.schedule, referenceTime);
    return date ? [{ activity, date }] : [];
  }).sort((a, b) => a.date.localeCompare(b.date) || a.activity.schedule!.startTime.localeCompare(b.activity.schedule!.startTime)).slice(0, UPCOMING_PREVIEW_COUNT);
  const indicators = [
    { label: "Estudiantes al día", value: students.length - observed.length, detail: `${percentage(students.length - observed.length)} · Alcanzan el avance esperado`, icon: CheckCircle2 },
    { label: "Alumnos observados", value: observed.length, detail: `${percentage(observed.length)} · Por debajo de lo esperado`, icon: AlertTriangle },
    { label: "Meta total cumplida", value: completed.length, detail: `${percentage(completed.length)} · Incluidos entre los estudiantes al día`, icon: Flag },
    { label: "Último ciclo con horas pendientes", value: finalCyclePending.length, detail: "Necesitan completar su meta antes del egreso", icon: GraduationCap },
  ];
  return <section className="flex flex-col gap-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted-foreground">Datos de ejemplo · {students.length} estudiantes evaluados. Los beneficiarios no se incluyen en el avance académico.</p>
      <ButtonLink href={getViewPath("administrador", "reports")} variant="outline">Ver reporte de alumnos <ArrowUpRight /></ButtonLink>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{indicators.map((item) => <Card key={item.label}>
      <CardHeader><CardDescription className="flex items-center justify-between gap-2">{item.label}<item.icon className="size-4 text-primary" /></CardDescription><CardTitle className="text-3xl">{item.value}</CardTitle></CardHeader>
      <CardContent><p className="text-xs text-muted-foreground">{item.detail}</p></CardContent>
    </Card>)}</div>
    <div className="grid items-start gap-6 xl:grid-cols-[1.4fr_1fr]">
      <SchoolProgressChart schools={schools} />
      <AcademicStatusChart total={students.length} completed={completed.length} observed={observed.length} />
    </div>
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <ParticipationChart total={students.length} active={active.length} period={CURRENT_REPORT_PERIOD} />
      <Card><CardHeader><CardTitle>Atención prioritaria</CardTitle><CardDescription>Referencias para organizar el seguimiento.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3"><div><p className="font-medium">Último ciclo con meta pendiente</p><p className="text-xs text-muted-foreground">Prioriza completar el requisito de egreso.</p></div><Badge variant="secondary">{finalCyclePending.length}</Badge></div>
        <div className="flex items-start justify-between gap-3"><div><p className="font-medium">Observados sin participación</p><p className="text-xs text-muted-foreground">Sin asistencia validada en {CURRENT_REPORT_PERIOD}.</p></div><Badge variant="secondary">{inactiveObserved.length}</Badge></div>
        <p className="text-xs text-muted-foreground">Un estudiante puede pertenecer a ambos grupos de atención.</p>
      </CardContent></Card>
    </div>
    <div className="grid items-start gap-6 lg:grid-cols-2">
      <Card><CardHeader><CardTitle>Próximas oportunidades</CardTitle><CardDescription>Jornadas según la programación de ejemplo. No representan horas garantizadas.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4">
        {upcoming.map(({ activity, date }) => <div key={activity.id} className="flex flex-wrap items-start justify-between gap-2 border-b pb-3 last:border-0 last:pb-0"><div className="min-w-0"><p className="font-medium">{activity.title}</p><p className="text-xs text-muted-foreground">{formatActivityDate(date)} · {activity.schedule!.startTime}</p><p className="text-xs text-muted-foreground">{activity.credit ? creditSummary(activity.credit, activity.schedule!.dates.length, activity.schedule!.endMode === "never" && activity.schedule!.repeat !== "once") : activity.hours}</p></div><ButtonLink href={getActivityPath("administrador", activity.id)} size="sm" variant="outline">Ver detalles</ButtonLink></div>)}
        {!upcoming.length && <p className="text-sm text-muted-foreground">No hay próximas jornadas con programación. Revisa las actividades para ofrecer nuevas oportunidades.</p>}
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Objetivos de seguimiento</CardTitle><CardDescription>Propuesta de gestión, sin porcentajes institucionales fijados.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3 text-sm">
        <p>Aumentar los estudiantes al día y reducir las horas que les faltan a los observados.</p><p>Reducir los casos de último ciclo con meta pendiente.</p><p>Acercar oportunidades a los observados sin participación.</p>
        <p className="text-xs text-muted-foreground">Esperado = meta asignada ÷ ciclos de la carrera × ciclo actual. Se aplica incluso si ingresó después del primer ciclo.</p>
      </CardContent></Card>
    </div>
  </section>;
}
