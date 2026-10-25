import type { LucideIcon } from "lucide-react";

export type SocialActivity = { id: string; title: string; area: string; date: string; time: string; place: string; hours: string; icon: LucideIcon; lat: number; lng: number };
export const DEFAULT_COORDINATES = { lat: -12.0464, lng: -77.0428 };
