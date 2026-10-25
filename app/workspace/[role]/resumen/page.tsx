import type { Metadata } from "next";
import { AdminDashboardAndReport } from "@/modules/reports/ui/admin-dashboard-report";
import { requireWorkspaceRole, type WorkspaceRouteProps } from "@/modules/portal/route-access";
export const metadata: Metadata = { title: "Resumen general | Proyección Social" };
export default async function Page({ params }: WorkspaceRouteProps) {
  await requireWorkspaceRole(params, "overview");
  return <AdminDashboardAndReport mode="dashboard" />;
}
