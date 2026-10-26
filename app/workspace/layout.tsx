import type { ReactNode } from "react";
import { WorkspaceProvider } from "@/modules/portal/ui/workspace-provider";
import { WorkspaceShell } from "@/modules/portal/ui/workspace-shell";
import { ReportsProvider } from "@/modules/reports/ui/reports-provider";
export default function WorkspaceLayout({ children }: { children: ReactNode }) {
  return <WorkspaceProvider>
    <ReportsProvider><WorkspaceShell>{children}</WorkspaceShell></ReportsProvider>
  </WorkspaceProvider>;
}
