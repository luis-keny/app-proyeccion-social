import type { Metadata } from "next";
import { ActivityDetailsScreen } from "@/modules/activities/ui/activity-details-screen";
import { requireWorkspaceRole } from "@/modules/portal/route-access";

export const metadata: Metadata = { title: "Detalle de actividad | Proyección Social" };

export default async function Page({ params }: { params: Promise<{ role: string; activityId: string }> }) {
  const role = await requireWorkspaceRole(params, "activities");
  const { activityId } = await params;
  return <ActivityDetailsScreen role={role} activityId={activityId} referenceTime={new Date().toISOString()} />;
}
