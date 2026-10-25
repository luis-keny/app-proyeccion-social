"use client";
import { ButtonLink } from "@/components/ui/button-link";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { getViewPath, type RoleSlug } from "@/modules/portal/navigation";
import { useWorkspace } from "@/modules/portal/ui/workspace-provider";
import { AttendanceView } from "./attendance-view";
export function AttendanceScreen({ role }: { role: RoleSlug }) {
  const { activities, selectedActivity, selectActivity } = useWorkspace();
  if(!selectedActivity) return <Empty>
    <EmptyHeader>
      <EmptyTitle>No hay actividades disponibles</EmptyTitle>
      <EmptyDescription>Revisa las actividades antes de registrar asistencia.</EmptyDescription>
    </EmptyHeader>
    <EmptyContent>
      <ButtonLink href={getViewPath(role, "activities")}>Ver actividades</ButtonLink>
    </EmptyContent>
  </Empty>;
  return <AttendanceView key={selectedActivity.id} activityList={activities} selectedActivity={selectedActivity} onSelectActivity={selectActivity} />;
}
