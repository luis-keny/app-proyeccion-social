import { Activity, FileText, HeartHandshake } from "lucide-react";
import type { SocialActivity } from "./model";

export const INITIAL_ACTIVITIES: SocialActivity[] = [
  { id: "activity-food", title: "Manos que alimentan", area: "Comunidad · Servicio", date: "Sáb, 25 oct", time: "8:00 a. m.", place: "Comedor San José", hours: "4 h", icon: HeartHandshake, lat: -12.0464, lng: -77.0428 },
  { id: "activity-reading", title: "Lectura para todos", area: "Educación · Voluntariado", date: "Mié, 28 oct", time: "3:30 p. m.", place: "Biblioteca Central", hours: "2 h", icon: FileText, lat: -12.0561, lng: -77.0845 },
  { id: "activity-health", title: "Jornada de salud", area: "Bienestar · Comunidad", date: "Sáb, 31 oct", time: "9:00 a. m.", place: "Clínica Universitaria", hours: "3 h", icon: Activity, lat: -12.0797, lng: -77.0357 },
];
