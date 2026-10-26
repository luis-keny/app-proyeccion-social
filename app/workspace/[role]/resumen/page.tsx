import type { Metadata } from "next";
import { AdminOverview } from "@/modules/reports/ui/admin-overview";
import { requireWorkspaceRole, type WorkspaceRouteProps } from "@/modules/portal/route-access";
export const metadata: Metadata = { title: "Resumen general | Proyección Social" };
export default async function Page({ params }: WorkspaceRouteProps) {
  await requireWorkspaceRole(params, "overview");
  return <AdminOverview referenceTime={new Date().toISOString()} />;
}
