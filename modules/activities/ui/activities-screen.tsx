"use client";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/modules/portal/ui/workspace-provider";
import { ROLE_LABELS, getActivityPath, getViewPath, type RoleSlug } from "@/modules/portal/navigation";
import { ActivitiesView } from "./activities-view";
export function ActivitiesScreen({ role, referenceTime }: { role: RoleSlug; referenceTime: string }) {
  const workspace = useWorkspace();
  const router = useRouter();
  return <ActivitiesView role={ROLE_LABELS[role]} referenceTime={referenceTime} getDetailsHref={(activity) => getActivityPath(role, activity.id)} activityList={workspace.activities} onSave={workspace.saveActivity} onDelete={workspace.removeActivity} onBeginAttendance={(activity) => { workspace.selectActivity(activity); router.push(getViewPath(role, "attendance")); }} />;
}
