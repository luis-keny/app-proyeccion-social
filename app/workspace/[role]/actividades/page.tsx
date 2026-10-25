import type { Metadata } from "next";
import { ActivitiesScreen } from "@/modules/activities/ui/activities-screen";
import { requireWorkspaceRole, type WorkspaceRouteProps } from "@/modules/portal/route-access";
export const metadata: Metadata = { title: "Actividades | Proyección Social" };
export default async function Page({ params }: WorkspaceRouteProps) {
  const role = await requireWorkspaceRole(params, "activities");
  return <ActivitiesScreen role={role} />;
}
