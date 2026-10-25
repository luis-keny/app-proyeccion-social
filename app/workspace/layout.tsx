import type { ReactNode } from "react";
import { WorkspaceProvider } from "@/modules/portal/ui/workspace-provider";
import { WorkspaceShell } from "@/modules/portal/ui/workspace-shell";
export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <WorkspaceProvider>
    <WorkspaceShell>{children}</WorkspaceShell>
  </WorkspaceProvider>;
}
