import type { LucideIcon } from "lucide-react";
import type { ActivityCredit, ActivitySchedule } from "./scheduling";

export type SocialActivity = { id: string; title: string; description?: string; area: string; date: string; time: string; place: string; hours: string; icon: LucideIcon; lat: number; lng: number; radiusMeters?: number; schedule?: ActivitySchedule; credit?: ActivityCredit };
export const DEFAULT_COORDINATES = { lat: -12.0464, lng: -77.0428 };
