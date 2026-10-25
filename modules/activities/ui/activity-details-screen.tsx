"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { useWorkspace } from "@/modules/portal/ui/workspace-provider";
import { getViewPath, type RoleSlug } from "@/modules/portal/navigation";
import { creditSummary } from "../scheduling";
import { formatActivityDate, nextActivityDate, recurrenceLabel, terminationLabel } from "../presentation";
import { ActivityMapPicker } from "./activity-map-picker";

const INITIAL_VISIBLE_JOURNEYS = 6;

export function ActivityDetailsScreen({ role, activityId, referenceTime }: { role: RoleSlug; activityId: string; referenceTime: string }) {
  const workspace = useWorkspace();
  const router = useRouter();
  const activity = workspace.activities.find((item) => item.id === activityId);
  const [showAllDates, setShowAllDates] = useState(false);
  const listHref = getViewPath(role, "activities");
  if (!activity) return <Empty className="border">
    <EmptyHeader><EmptyTitle>Actividad no disponible</EmptyTitle><EmptyDescription>Esta actividad no existe en la sesión actual. Al recargar se reinician los datos de ejemplo.</EmptyDescription></EmptyHeader>
    <EmptyContent><ButtonLink href={listHref} variant="outline">Volver a actividades</ButtonLink></EmptyContent>
  </Empty>;

  const { schedule, credit } = activity;
  const unbounded = schedule?.repeat !== "once" && schedule?.endMode === "never";
  const nextDate = schedule ? nextActivityDate(schedule, referenceTime) : null;
  const dates = schedule?.dates ?? [];
  const visibleDates = showAllDates && !unbounded ? dates : dates.slice(0, INITIAL_VISIBLE_JOURNEYS);

  return <div className="flex flex-col gap-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <ButtonLink href={listHref} variant="ghost" size="sm"><ArrowLeft data-icon="inline-start" />Volver a actividades</ButtonLink>
      {role !== "estudiante" && <Button onClick={() => { workspace.selectActivity(activity); router.push(getViewPath(role, "attendance")); }}>Registrar asistencia</Button>}
    </div>
    <section className="flex flex-col gap-3" aria-labelledby="activity-detail-title">
      <div className="flex flex-wrap gap-2"><Badge variant="outline">{activity.area}</Badge><Badge variant="secondary">{credit ? `${credit.hours} h ${credit.rule === "per-attendance" ? "/ asistencia" : "en total"}` : activity.hours}</Badge></div>
      <h2 id="activity-detail-title" className="break-words text-2xl font-semibold tracking-tight">{activity.title}</h2>
      <p className="whitespace-pre-wrap break-words text-sm leading-relaxed text-muted-foreground">{activity.description || "Esta actividad todavía no tiene descripción."}</p>
    </section>
    <div className="grid items-start gap-4 lg:grid-cols-2">
      <div className="flex min-w-0 flex-col gap-4">
        <Card>
          <CardHeader><CardTitle><h3 className="flex items-center gap-2"><CalendarDays className="size-4" aria-hidden="true" />Programación</h3></CardTitle><CardDescription>{schedule ? nextDate ? `Próxima jornada: ${formatActivityDate(nextDate)}` : "No quedan jornadas pendientes en esta programación." : activity.date}</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-4">
            {schedule ? <>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                <dt className="text-muted-foreground">Desde</dt><dd>{schedule.startDate}</dd>
                <dt className="text-muted-foreground">Repite</dt><dd className="min-w-0 break-words">{recurrenceLabel(schedule)}</dd>
                <dt className="text-muted-foreground">Termina</dt><dd>{terminationLabel(schedule)}</dd>
                <dt className="text-muted-foreground">Horario</dt><dd>{activity.time} · Lima</dd>
              </dl>
              <div className="flex flex-col gap-2">
                <h4 className="text-sm font-medium">{unbounded ? "Primeras jornadas · muestra inicial" : `Jornadas (${dates.length})`}</h4>
                <ol id="activity-journeys" className="flex max-h-72 flex-col gap-2 overflow-y-auto rounded-lg border p-3" aria-label="Fechas de las jornadas" tabIndex={0}>
                  {visibleDates.map((date, index) => <li key={date} className="flex flex-wrap items-baseline justify-between gap-1 text-sm"><span>{index + 1}. {formatActivityDate(date)}</span><span className="text-xs text-muted-foreground">{activity.time}</span></li>)}
                </ol>
                {unbounded ? <p className="text-xs text-muted-foreground">La serie continúa sin fecha de fin. Estas fechas son una muestra, no el total.</p> : dates.length > INITIAL_VISIBLE_JOURNEYS && <Button variant="ghost" size="sm" aria-expanded={showAllDates} aria-controls="activity-journeys" onClick={() => setShowAllDates((current) => !current)}>{showAllDates ? "Mostrar menos" : `Ver las ${dates.length} jornadas`}</Button>}
              </div>
            </> : <p className="text-sm text-muted-foreground">{activity.time} · La programación detallada aún no está configurada.</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle><h3 className="flex items-center gap-2"><Clock3 className="size-4" aria-hidden="true" />Condición de horas</h3></CardTitle><CardDescription>Qué asistencia necesitas para obtener las horas.</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-2">
            <p className="text-sm font-medium">{credit && schedule ? creditSummary(credit, dates.length, unbounded) : "La regla de horas todavía no está configurada."}</p>
            <p className="text-xs text-muted-foreground">Configuración visual. Todavía no acredita horas reales.</p>
          </CardContent>
        </Card>
      </div>
      <Card className="min-w-0">
        <CardHeader><CardTitle><h3 className="flex items-center gap-2"><MapPin className="size-4" aria-hidden="true" />Punto de encuentro</h3></CardTitle><CardDescription>{activity.place}</CardDescription></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ActivityMapPicker key={`${activity.lat}-${activity.lng}`} value={{ lat: activity.lat, lng: activity.lng }} radiusMeters={activity.radiusMeters} readOnly />
          <dl className="grid grid-cols-2 gap-2 text-xs"><dt className="text-muted-foreground">Coordenadas</dt><dd className="text-right tabular-nums">{activity.lat.toFixed(5)}, {activity.lng.toFixed(5)}</dd></dl>
          <p className="text-xs text-muted-foreground">El área indica el punto de encuentro; no valida asistencia por GPS.</p>
        </CardContent>
      </Card>
    </div>
  </div>;
}
