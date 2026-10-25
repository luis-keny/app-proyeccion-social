"use client";

import { ArrowRight,CalendarDays,MapPin,Pencil,Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card,CardContent,CardDescription,CardHeader,CardTitle } from "@/components/ui/card";
import type { Role } from "@/modules/portal/navigation";
import type { SocialActivity } from "../model";

type Props={
  activity: SocialActivity;
  role: Role;
  onEdit: (activity: SocialActivity) => void;
  onDelete: (activity: SocialActivity) => void;
  onBeginAttendance: (activity: SocialActivity) => void;
};

export function ActivityCard({ activity,role,onEdit,onDelete,onBeginAttendance }: Props) {
  const { title: name,area,date,time,place,hours,icon: Icon }=activity;
  return <Card>
    <CardHeader>
      <div className="mb-2 flex items-center justify-between">
        <span className="rounded-md bg-muted p-2">
          <Icon className="size-5" />
        </span>
        <div className="flex items-center gap-1">
          <Badge variant="outline">{hours}</Badge>{role==="Administrador"&&<>
            <Button variant="ghost" size="icon" aria-label={`Editar ${name}`} onClick={() => onEdit(activity)}>
              <Pencil className="size-4" />
            </Button>
            <Button variant="destructive" size="icon" aria-label={`Eliminar ${name}`} onClick={() => onDelete(activity)}>
              <Trash2 className="size-4" />
            </Button>
          </>}</div>
      </div>
      <CardTitle className="text-lg">{name}</CardTitle>
      <CardDescription>{area}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-2 text-sm text-muted-foreground">
      <p className="flex items-center gap-2">
        <MapPin className="size-4" />{place}</p>
      <p className="flex items-center gap-2">
        <CalendarDays className="size-4" />{date} · {time}</p>{role!=="Estudiante"&&<Button variant="link" className="h-auto p-0" onClick={() => onBeginAttendance(activity)}>Registrar asistencia <ArrowRight className="ml-1 size-4" />
        </Button>}</CardContent>
  </Card>;
}
