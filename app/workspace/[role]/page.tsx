import { redirect } from "next/navigation";
import { getInitialPath } from "@/modules/portal/navigation";
import { requireWorkspaceRole, type WorkspaceRouteProps } from "@/modules/portal/route-access";
export default async function Page({ params }: WorkspaceRouteProps) { const role = await requireWorkspaceRole(params); redirect(getInitialPath(role)); }
