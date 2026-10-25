"use client";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/modules/portal/ui/workspace-provider";
import { ROLE_LABELS, getViewPath, type RoleSlug } from "@/modules/portal/navigation";
import { ActivitiesView } from "./activities-view";
export function ActivitiesScreen({ role }: { role: RoleSlug }) {
  const workspace = useWorkspace();
  const router = useRouter();
  return <ActivitiesView role={ROLE_LABELS[role]} activityList={workspace.activities} onSave={workspace.saveActivity} onDelete={workspace.removeActivity} onBeginAttendance={(activity) => { workspace.selectActivity(activity); router.push(getViewPath(role, "attendance")); }} />;
}
