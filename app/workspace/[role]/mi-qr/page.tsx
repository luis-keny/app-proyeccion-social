import type { Metadata } from "next";
import { StudentQrView } from "@/modules/students/ui/student-qr-view";
import { getViewPath } from "@/modules/portal/navigation";
import { requireWorkspaceRole, type WorkspaceRouteProps } from "@/modules/portal/route-access";
export const metadata: Metadata = { title: "Mi código QR | Proyección Social" };
export default async function Page({ params }: WorkspaceRouteProps) {
  const role = await requireWorkspaceRole(params, "qr");
  return <StudentQrView activitiesHref={getViewPath(role, "activities")} />;
}
