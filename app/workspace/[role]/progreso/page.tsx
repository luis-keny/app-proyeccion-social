import type { Metadata } from "next";
import { StudentProgressView } from "@/modules/students/ui/student-progress-view";
import { requireWorkspaceRole, type WorkspaceRouteProps } from "@/modules/portal/route-access";
export const metadata: Metadata = { title: "Mi progreso | Proyección Social" };
export default async function Page({ params }: WorkspaceRouteProps) {
  await requireWorkspaceRole(params, "progress");
  return <StudentProgressView />;
}
