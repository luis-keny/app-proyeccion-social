import { notFound } from "next/navigation";
import { isRoleSlug, navigation, type WorkspaceView } from "./navigation";
export type WorkspaceRouteProps = { params: Promise<{ role: string }> };
// Valida la matriz visual; los permisos reales requieren identidad y servidor.
export async function requireWorkspaceRole(params: WorkspaceRouteProps["params"], view?: WorkspaceView) {
  const { role } = await params;
  if(!isRoleSlug(role)) notFound();
  if(view && !navigation.find((item) => item.id === view)?.roles.includes(role)) notFound();
  return role;
}
