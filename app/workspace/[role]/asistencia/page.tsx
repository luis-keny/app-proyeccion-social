import type { Metadata } from "next";
import { AttendanceScreen } from "@/modules/attendance/ui/attendance-screen";
import { requireWorkspaceRole, type WorkspaceRouteProps } from "@/modules/portal/route-access";
export const metadata: Metadata = { title: "Registro de asistencia | Proyección Social" };
export default async function Page({ params }: WorkspaceRouteProps) {
  const role = await requireWorkspaceRole(params, "attendance");
  return <AttendanceScreen role={role} />;
}
