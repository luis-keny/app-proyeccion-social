"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Role } from "@/modules/portal/navigation";
import type { SocialActivity } from "../model";
import { ActivityCard } from "./activity-card";
import { ActivityEditorDrawer, type ActivityDraft } from "./activity-editor-drawer";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type Props = {
  role: Role;
  referenceTime: string;
  getDetailsHref: (activity: SocialActivity) => string;
  activityList: SocialActivity[];
  onBeginAttendance: (activity: SocialActivity) => void;
  onSave: (draft: ActivityDraft, id: string | null) => void;
  onDelete: (id: string) => void;
};
export function ActivitiesView({ role, referenceTime, getDetailsHref, activityList, onBeginAttendance, onSave, onDelete }: Props) {
  const [query, setQuery] = useState("");
  const [editor, setEditor] = useState<{ activity: SocialActivity | null } | null>(null);
  const [pendingDelete, setPendingDelete] = useState<SocialActivity | null>(null);
  const visibleActivities = useMemo(() => activityList.filter((item) => `${item.title} ${item.area} ${item.place}`.toLowerCase().includes(query.toLowerCase())), [activityList, query]);
  return <>
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Actividades disponibles</h2>
          <p className="text-sm text-muted-foreground">Cada actividad indica las horas que puedes obtener.</p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <div className="relative min-w-0 flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar actividad" />
          </div>{role === "Administrador" && <Button onClick={() => setEditor((current) => current ?? { activity: null })}>
            <Plus className="mr-2 size-4" />Agregar actividad</Button>}</div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{visibleActivities.map((activity) => <ActivityCard key={activity.id} activity={activity} role={role} referenceTime={referenceTime} detailsHref={getDetailsHref(activity)} onEdit={(item) => setEditor((current) => current ?? { activity: item })} onDelete={setPendingDelete} onBeginAttendance={onBeginAttendance} />)}</div>{visibleActivities.length === 0 && <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">No encontramos actividades con ese nombre.</CardContent>
      </Card>}</section>
    {editor && role === "Administrador" && <ActivityEditorDrawer activity={editor.activity} onClose={() => setEditor(null)} onSave={(draft) => onSave(draft, editor.activity?.id ?? null)} />}
    <AlertDialog open={pendingDelete !== null} onOpenChange={(open) => { if (!open) setPendingDelete(null); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar actividad?</AlertDialogTitle>
          <AlertDialogDescription>Se quitará «{pendingDelete?.title}» de esta sesión visual. Puedes cancelar para conservarla.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={() => { if (pendingDelete) onDelete(pendingDelete.id); setPendingDelete(null); }}>Eliminar actividad</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>;
}
