import type { Metadata } from "next";
import { AdminDashboardAndReport } from "@/modules/reports/ui/admin-dashboard-report";
import { requireWorkspaceRole, type WorkspaceRouteProps } from "@/modules/portal/route-access";
export const metadata: Metadata = { title: "Reporte de alumnos | Proyección Social" };
export default async function Page({ params }: WorkspaceRouteProps) {
  await requireWorkspaceRole(params, "reports");
  return <AdminDashboardAndReport mode="report" />;
}
