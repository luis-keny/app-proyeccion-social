"use client";

import { ArrowRight, CalendarDays, MapPin, Pencil, Repeat2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Role } from "@/modules/portal/navigation";
import type { SocialActivity } from "../model";
import { creditSummary } from "../scheduling";
import { formatActivityDate, nextActivityDate, recurrenceLabel } from "../presentation";

type Props = {
  activity: SocialActivity; role: Role; detailsHref: string; referenceTime: string;
  onEdit: (activity: SocialActivity) => void;
  onDelete: (activity: SocialActivity) => void;
  onBeginAttendance: (activity: SocialActivity) => void;
};

export function ActivityCard({ activity, role, detailsHref, referenceTime, onEdit, onDelete, onBeginAttendance }: Props) {
  const { title, area, place, icon: Icon, schedule, credit } = activity;
  const nextDate = schedule ? nextActivityDate(schedule, referenceTime) : null;
  const openEnded = schedule?.repeat !== "once" && schedule?.endMode === "never";
  const hoursLabel = credit ? `${credit.hours} h ${credit.rule === "per-attendance" ? "/ asistencia" : "en total"}` : activity.hours;
  return <Card className="h-full">
    <CardHeader>
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="rounded-lg bg-muted p-2"><Icon className="size-5" aria-hidden="true" /></span>
        <div className="flex flex-wrap items-center justify-end gap-1">
          <Badge variant="secondary">{hoursLabel}</Badge>
          {role === "Administrador" && <>
            <Button variant="ghost" size="icon-sm" aria-label={`Editar ${title}`} onClick={() => onEdit(activity)}><Pencil /></Button>
            <Button variant="destructive" size="icon-sm" aria-label={`Eliminar ${title}`} onClick={() => onDelete(activity)}><Trash2 /></Button>
          </>}
        </div>
      </div>
      <CardTitle className="line-clamp-2">{title}</CardTitle>
      <CardDescription>{area}</CardDescription>
      {activity.description && <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{activity.description}</p>}
    </CardHeader>
    <CardContent className="flex flex-1 flex-col gap-3 text-sm">
      <p className="flex items-start gap-2 text-muted-foreground"><MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><span className="line-clamp-2">{place}</span></p>
      <div className="flex items-start gap-2">
        <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <div>
          <p>{schedule ? nextDate ? `Próxima: ${formatActivityDate(nextDate)}` : "Sin jornadas pendientes" : activity.date}</p>
          <p className="text-xs text-muted-foreground">{activity.time}</p>
        </div>
      </div>
      {schedule && <p className="flex items-start gap-2 text-muted-foreground"><Repeat2 className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><span className="line-clamp-2">{recurrenceLabel(schedule)}</span></p>}
      {credit && schedule && <p className="text-xs text-muted-foreground">{creditSummary(credit, schedule.dates.length, openEnded)}</p>}
    </CardContent>
    <CardFooter className="flex-wrap gap-2">
      <ButtonLink href={detailsHref} variant="outline" size="sm" aria-label={`Ver detalles de ${title}`}>Ver detalles <ArrowRight data-icon="inline-end" /></ButtonLink>
      {role !== "Estudiante" && <Button variant="ghost" size="sm" onClick={() => onBeginAttendance(activity)}>Registrar asistencia</Button>}
    </CardFooter>
  </Card>;
}
