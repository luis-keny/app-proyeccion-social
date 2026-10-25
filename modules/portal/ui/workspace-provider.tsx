"use client";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Activity } from "lucide-react";
import { INITIAL_ACTIVITIES } from "@/modules/activities/fixtures";
import type { SocialActivity } from "@/modules/activities/model";
import type { ActivityDraft } from "@/modules/activities/ui/activity-editor-drawer";

type WorkspaceState = {
  activities: SocialActivity[];
  selectedActivity: SocialActivity | undefined;
  selectActivity: (activity: SocialActivity) => void;
  saveActivity: (draft: ActivityDraft, id: string | null) => void;
  removeActivity: (id: string) => void;
};
const WorkspaceContext = createContext<WorkspaceState | null>(null);
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES);
  const [selectedActivityId, setSelectedActivityId] = useState(INITIAL_ACTIVITIES[0].id);
  const selectedActivity = activities.find((item) => item.id === selectedActivityId) ?? activities[0];
  function saveActivity(draft: ActivityDraft, id: string | null) {
    setActivities((current) => id ? current.map((item) => item.id === id ? { ...item, ...draft } : item) : [...current, { id: crypto.randomUUID(), ...draft, area: "Comunidad · Servicio", date: "Fecha por coordinar", time: "Por definir", icon: Activity }]);
  }
  return <WorkspaceContext.Provider value={{ activities, selectedActivity, selectActivity: (activity) => setSelectedActivityId(activity.id), saveActivity, removeActivity: (id) => setActivities((current) => current.filter((item) => item.id !== id)) }}>{children}</WorkspaceContext.Provider>;
}
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if(!context) throw new Error("El estado de la plataforma requiere WorkspaceProvider.");
  return context;
}
