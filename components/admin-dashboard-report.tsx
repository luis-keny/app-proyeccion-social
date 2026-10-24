"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpen,
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Eye,
  FileSpreadsheet,
  Filter,
  GraduationCap,
  HeartHandshake,
  Layers,
  MapPin,
  QrCode,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type CycleCode = "2025-I" | "2025-II" | "2026-I" | "2026-II";

export type StudentActivityLog = {
  id: string;
  cycle: CycleCode;
  title: string;
  area: "Comunidad y Servicio" | "Educación y Voluntariado" | "Bienestar y Salud" | "Medio Ambiente";
  place: string;
  date: string;
  schedule: string;
  hours: number;
  supervisor: string;
  validationMethod: "QR + GPS" | "QR Presencial";
  status: "Validado" | "En revisión";
};

export type CycleSummary = {
  cycle: CycleCode;
  year: "2025" | "2026";
  semester: "Ciclo I" | "Ciclo II";
  hours: number;
  goalHours: number;
  activitiesCount: number;
  mainProject: string;
  lastDate: string;
  status: "Meta cumplida" | "En curso" | "Observado";
};

export type StudentReportItem = {
  id: string;
  name: string;
  initials: string;
  studentCode: string;
  dni: string;
  faculty: string;
  email: string;
  currentSemesterLabel: string;
  annualGoalHours: number;
  cycles: Record<CycleCode, CycleSummary>;
  activities: StudentActivityLog[];
};

export const ACADEMIC_YEARS: { year: "2025" | "2026"; label: string; cycles: [CycleCode, CycleCode] }[] = [
  { year: "2025", label: "Año Académico 2025 (2 ciclos)", cycles: ["2025-I", "2025-II"] },
  { year: "2026", label: "Año Académico 2026 (2 ciclos)", cycles: ["2026-I", "2026-II"] },
];

export const ALL_CYCLES: CycleCode[] = ["2025-I", "2025-II", "2026-I", "2026-II"];

export const STUDENTS_DATA: StudentReportItem[] = [
  {
    id: "est-1",
    name: "Daniela Rojas Quispe",
    initials: "DR",
    studentCode: "202310482 · EST-00482",
    dni: "74829103",
    faculty: "Psicología",
    email: "daniela.rojas@upeu.edu.pe",
    currentSemesterLabel: "VII Ciclo",
    annualGoalHours: 160,
    cycles: {
      "2025-I": {
        cycle: "2025-I",
        year: "2025",
        semester: "Ciclo I",
        hours: 40,
        goalHours: 40,
        activitiesCount: 4,
        mainProject: "Escuelas Saludables Ñaña",
        lastDate: "28 jun 2025",
        status: "Meta cumplida",
      },
      "2025-II": {
        cycle: "2025-II",
        year: "2025",
        semester: "Ciclo II",
        hours: 42,
        goalHours: 40,
        activitiesCount: 4,
        mainProject: "Brigada Psicoeducativa",
        lastDate: "29 nov 2025",
        status: "Meta cumplida",
      },
      "2026-I": {
        cycle: "2026-I",
        year: "2026",
        semester: "Ciclo I",
        hours: 38,
        goalHours: 40,
        activitiesCount: 3,
        mainProject: "Red de Apoyo Familiar",
        lastDate: "04 jul 2026",
        status: "Meta cumplida",
      },
      "2026-II": {
        cycle: "2026-II",
        year: "2026",
        semester: "Ciclo II",
        hours: 28.5,
        goalHours: 40,
        activitiesCount: 4,
        mainProject: "Comedor San José",
        lastDate: "18 oct 2026",
        status: "En curso",
      },
    },
    activities: [
      {
        id: "dr-1",
        cycle: "2026-II",
        title: "Huerto comunitario y nutrición",
        area: "Medio Ambiente",
        place: "Villa Esperanza, Chosica",
        date: "04 oct 2026",
        schedule: "08:00 a. m. - 11:30 a. m.",
        hours: 3.5,
        supervisor: "Lic. Marco Céspedes",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "dr-2",
        cycle: "2026-II",
        title: "Acompañamiento escolar y lectura",
        area: "Educación y Voluntariado",
        place: "I. E. José Olaya",
        date: "27 sep 2026",
        schedule: "03:00 p. m. - 09:00 p. m.",
        hours: 6,
        supervisor: "Mg. Elena Vargas",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "dr-3",
        cycle: "2026-II",
        title: "Despensa solidaria · Manos que alimentan",
        area: "Comunidad y Servicio",
        place: "Comedor San José",
        date: "13 sep 2026",
        schedule: "07:30 a. m. - 04:30 p. m.",
        hours: 9,
        supervisor: "Lic. Marco Céspedes",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "dr-4",
        cycle: "2026-II",
        title: "Taller de orientación emocional juvenil",
        area: "Bienestar y Salud",
        place: "Centro Comunal Huascata",
        date: "18 oct 2026",
        schedule: "08:00 a. m. - 06:00 p. m.",
        hours: 10,
        supervisor: "Dra. Ruth Mendoza",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "dr-5",
        cycle: "2026-I",
        title: "Programa Red de Apoyo Familiar · Módulo I",
        area: "Bienestar y Salud",
        place: "C. P. Virgen del Rosario",
        date: "16 may 2026",
        schedule: "08:00 a. m. - 02:00 p. m.",
        hours: 14,
        supervisor: "Dra. Ruth Mendoza",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "dr-6",
        cycle: "2026-I",
        title: "Programa Red de Apoyo Familiar · Módulo II",
        area: "Bienestar y Salud",
        place: "C. P. Virgen del Rosario",
        date: "13 jun 2026",
        schedule: "08:00 a. m. - 02:00 p. m.",
        hours: 12,
        supervisor: "Dra. Ruth Mendoza",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "dr-7",
        cycle: "2026-I",
        title: "Feria de salud mental comunitaria",
        area: "Comunidad y Servicio",
        place: "Plaza Principal de Ñaña",
        date: "04 jul 2026",
        schedule: "08:00 a. m. - 04:00 p. m.",
        hours: 12,
        supervisor: "Lic. Marco Céspedes",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "dr-8",
        cycle: "2025-II",
        title: "Brigada Psicoeducativa en Colegios",
        area: "Educación y Voluntariado",
        place: "I. E. Felipe Huamán Poma de Ayala",
        date: "18 oct 2025",
        schedule: "08:00 a. m. - 02:00 p. m.",
        hours: 22,
        supervisor: "Mg. Elena Vargas",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "dr-9",
        cycle: "2025-II",
        title: "Clausura de Escuela de Padres",
        area: "Bienestar y Salud",
        place: "Auditorio Municipal Chaclacayo",
        date: "29 nov 2025",
        schedule: "08:00 a. m. - 04:00 p. m.",
        hours: 20,
        supervisor: "Dra. Ruth Mendoza",
        validationMethod: "QR Presencial",
        status: "Validado",
      },
      {
        id: "dr-10",
        cycle: "2025-I",
        title: "Campaña Escuelas Saludables Ñaña",
        area: "Bienestar y Salud",
        place: "Red Educativa Ñaña",
        date: "28 jun 2025",
        schedule: "Jornadas acumuladas semestrales",
        hours: 40,
        supervisor: "Dra. Ruth Mendoza",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
    ],
  },
  {
    id: "est-2",
    name: "Mateo Valdivia Huamán",
    initials: "MV",
    studentCode: "202210894 · EST-00894",
    dni: "72910485",
    faculty: "Ingeniería de Sistemas",
    email: "mateo.valdivia@upeu.edu.pe",
    currentSemesterLabel: "VIII Ciclo",
    annualGoalHours: 160,
    cycles: {
      "2025-I": {
        cycle: "2025-I",
        year: "2025",
        semester: "Ciclo I",
        hours: 40,
        goalHours: 40,
        activitiesCount: 4,
        mainProject: "Alfabetización Digital",
        lastDate: "21 jun 2025",
        status: "Meta cumplida",
      },
      "2025-II": {
        cycle: "2025-II",
        year: "2025",
        semester: "Ciclo II",
        hours: 40,
        goalHours: 40,
        activitiesCount: 5,
        mainProject: "Aulas Conectadas Chosica",
        lastDate: "22 nov 2025",
        status: "Meta cumplida",
      },
      "2026-I": {
        cycle: "2026-I",
        year: "2026",
        semester: "Ciclo I",
        hours: 44,
        goalHours: 40,
        activitiesCount: 4,
        mainProject: "Soporte TI Comedores",
        lastDate: "27 jun 2026",
        status: "Meta cumplida",
      },
      "2026-II": {
        cycle: "2026-II",
        year: "2026",
        semester: "Ciclo II",
        hours: 40,
        goalHours: 40,
        activitiesCount: 4,
        mainProject: "Laboratorio Digital Escolar",
        lastDate: "20 oct 2026",
        status: "Meta cumplida",
      },
    },
    activities: [
      {
        id: "mv-1",
        cycle: "2026-II",
        title: "Capacitación en ofimática para emprendedores",
        area: "Educación y Voluntariado",
        place: "Centro Cívico Chaclacayo",
        date: "20 oct 2026",
        schedule: "08:00 a. m. - 01:00 p. m.",
        hours: 15,
        supervisor: "Ing. Carlos Pineda",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "mv-2",
        cycle: "2026-II",
        title: "Mantenimiento de laboratorio de cómputo",
        area: "Educación y Voluntariado",
        place: "I. E. José Olaya",
        date: "03 oct 2026",
        schedule: "08:00 a. m. - 05:00 p. m.",
        hours: 15,
        supervisor: "Ing. Carlos Pineda",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "mv-3",
        cycle: "2026-II",
        title: "Taller de ciberseguridad para escolares",
        area: "Educación y Voluntariado",
        place: "Biblioteca Central",
        date: "19 sep 2026",
        schedule: "09:00 a. m. - 02:00 p. m.",
        hours: 10,
        supervisor: "Mg. Elena Vargas",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "mv-4",
        cycle: "2026-I",
        title: "Inventario digital para comedores solidarios",
        area: "Comunidad y Servicio",
        place: "Comedor San José",
        date: "27 jun 2026",
        schedule: "Proyecto semestral",
        hours: 44,
        supervisor: "Ing. Carlos Pineda",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "mv-5",
        cycle: "2025-II",
        title: "Aulas Conectadas · Instalación de redes",
        area: "Educación y Voluntariado",
        place: "Instituciones Educativas de Lurigancho",
        date: "22 nov 2025",
        schedule: "Proyecto semestral",
        hours: 40,
        supervisor: "Ing. Carlos Pineda",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "mv-6",
        cycle: "2025-I",
        title: "Alfabetización Digital para Adultos Mayores",
        area: "Comunidad y Servicio",
        place: "CIAM Chaclacayo",
        date: "21 jun 2025",
        schedule: "Proyecto semestral",
        hours: 40,
        supervisor: "Ing. Carlos Pineda",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
    ],
  },
  {
    id: "est-3",
    name: "Camila Paredes Tello",
    initials: "CP",
    studentCode: "202320115 · EST-00115",
    dni: "75103948",
    faculty: "Medicina Humana",
    email: "camila.paredes@upeu.edu.pe",
    currentSemesterLabel: "VI Ciclo",
    annualGoalHours: 160,
    cycles: {
      "2025-I": {
        cycle: "2025-I",
        year: "2025",
        semester: "Ciclo I",
        hours: 36,
        goalHours: 40,
        activitiesCount: 3,
        mainProject: "Campaña Anemia Cero",
        lastDate: "14 jun 2025",
        status: "Meta cumplida",
      },
      "2025-II": {
        cycle: "2025-II",
        year: "2025",
        semester: "Ciclo II",
        hours: 44,
        goalHours: 40,
        activitiesCount: 5,
        mainProject: "Clínica Móvil Solidaria",
        lastDate: "30 nov 2025",
        status: "Meta cumplida",
      },
      "2026-I": {
        cycle: "2026-I",
        year: "2026",
        semester: "Ciclo I",
        hours: 40,
        goalHours: 40,
        activitiesCount: 4,
        mainProject: "Prevención Dengue y Salud",
        lastDate: "28 jun 2026",
        status: "Meta cumplida",
      },
      "2026-II": {
        cycle: "2026-II",
        year: "2026",
        semester: "Ciclo II",
        hours: 34,
        goalHours: 40,
        activitiesCount: 4,
        mainProject: "Jornada Médica Integral",
        lastDate: "21 oct 2026",
        status: "En curso",
      },
    },
    activities: [
      {
        id: "cp-1",
        cycle: "2026-II",
        title: "Jornada de salud preventiva y triaje",
        area: "Bienestar y Salud",
        place: "Clínica Universitaria / Ñaña",
        date: "21 oct 2026",
        schedule: "08:00 a. m. - 04:00 p. m.",
        hours: 12,
        supervisor: "Dr. Samuel Lozada",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "cp-2",
        cycle: "2026-II",
        title: "Despistaje de anemia infantil",
        area: "Bienestar y Salud",
        place: "Comedor San José",
        date: "04 oct 2026",
        schedule: "08:00 a. m. - 03:00 p. m.",
        hours: 12,
        supervisor: "Dr. Samuel Lozada",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "cp-3",
        cycle: "2026-II",
        title: "Charla de higiene y primeros auxilios",
        area: "Bienestar y Salud",
        place: "I. E. José Olaya",
        date: "20 sep 2026",
        schedule: "08:00 a. m. - 02:00 p. m.",
        hours: 10,
        supervisor: "Dra. Ruth Mendoza",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "cp-4",
        cycle: "2026-I",
        title: "Brigada de Prevención contra el Dengue",
        area: "Bienestar y Salud",
        place: "AA. HH. Morón y Carapongo",
        date: "28 jun 2026",
        schedule: "4 jornadas médicas",
        hours: 40,
        supervisor: "Dr. Samuel Lozada",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "cp-5",
        cycle: "2025-II",
        title: "Operativo Clínica Móvil Solidaria",
        area: "Bienestar y Salud",
        place: "Huaycán Zona Z",
        date: "30 nov 2025",
        schedule: "5 jornadas de atención",
        hours: 44,
        supervisor: "Dr. Samuel Lozada",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "cp-6",
        cycle: "2025-I",
        title: "Campaña Anemia Cero en Cunas Comunales",
        area: "Bienestar y Salud",
        place: "Lurigancho - Chosica",
        date: "14 jun 2025",
        schedule: "3 jornadas integrales",
        hours: 36,
        supervisor: "Dr. Samuel Lozada",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
    ],
  },
  {
    id: "est-4",
    name: "Sebastián Mendoza Flores",
    initials: "SM",
    studentCode: "202410309 · EST-00309",
    dni: "76482019",
    faculty: "Administración y Negocios",
    email: "sebastian.mendoza@upeu.edu.pe",
    currentSemesterLabel: "V Ciclo",
    annualGoalHours: 160,
    cycles: {
      "2025-I": {
        cycle: "2025-I",
        year: "2025",
        semester: "Ciclo I",
        hours: 32,
        goalHours: 40,
        activitiesCount: 3,
        mainProject: "Emprende Mujer Chosica",
        lastDate: "20 jun 2025",
        status: "Observado",
      },
      "2025-II": {
        cycle: "2025-II",
        year: "2025",
        semester: "Ciclo II",
        hours: 40,
        goalHours: 40,
        activitiesCount: 4,
        mainProject: "Formalización MYPES",
        lastDate: "25 nov 2025",
        status: "Meta cumplida",
      },
      "2026-I": {
        cycle: "2026-I",
        year: "2026",
        semester: "Ciclo I",
        hours: 38,
        goalHours: 40,
        activitiesCount: 4,
        mainProject: "Educación Financiera",
        lastDate: "01 jul 2026",
        status: "Meta cumplida",
      },
      "2026-II": {
        cycle: "2026-II",
        year: "2026",
        semester: "Ciclo II",
        hours: 18,
        goalHours: 40,
        activitiesCount: 2,
        mainProject: "Gestión Comedores Populares",
        lastDate: "10 oct 2026",
        status: "Observado",
      },
    },
    activities: [
      {
        id: "sm-1",
        cycle: "2026-II",
        title: "Asesoría en costos y compras comunitarias",
        area: "Comunidad y Servicio",
        place: "Comedor San José",
        date: "10 oct 2026",
        schedule: "08:00 a. m. - 02:00 p. m.",
        hours: 10,
        supervisor: "Mg. Jorge Alarcón",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "sm-2",
        cycle: "2026-II",
        title: "Taller de presupuesto familiar",
        area: "Educación y Voluntariado",
        place: "Centro Comunal Era de Ñaña",
        date: "26 sep 2026",
        schedule: "08:00 a. m. - 04:00 p. m.",
        hours: 8,
        supervisor: "Mg. Jorge Alarcón",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "sm-3",
        cycle: "2026-I",
        title: "Programa de Educación Financiera Barrial",
        area: "Educación y Voluntariado",
        place: "Asociación de Comerciantes Ñaña",
        date: "01 jul 2026",
        schedule: "4 sesiones",
        hours: 38,
        supervisor: "Mg. Jorge Alarcón",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "sm-4",
        cycle: "2025-II",
        title: "Clínica de Formalización y Gestión MYPES",
        area: "Comunidad y Servicio",
        place: "Cámara de Comercio Este",
        date: "25 nov 2025",
        schedule: "4 sesiones",
        hours: 40,
        supervisor: "Mg. Jorge Alarcón",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "sm-5",
        cycle: "2025-I",
        title: "Incubadora Social Emprende Mujer",
        area: "Comunidad y Servicio",
        place: "Municipalidad de Chosica",
        date: "20 jun 2025",
        schedule: "3 sesiones",
        hours: 32,
        supervisor: "Mg. Jorge Alarcón",
        validationMethod: "QR Presencial",
        status: "Validado",
      },
    ],
  },
  {
    id: "est-5",
    name: "Lucía Fernández Ríos",
    initials: "LF",
    studentCode: "202220512 · EST-00512",
    dni: "71839204",
    faculty: "Arquitectura y Urbanismo",
    email: "lucia.fernandez@upeu.edu.pe",
    currentSemesterLabel: "VIII Ciclo",
    annualGoalHours: 160,
    cycles: {
      "2025-I": {
        cycle: "2025-I",
        year: "2025",
        semester: "Ciclo I",
        hours: 40,
        goalHours: 40,
        activitiesCount: 4,
        mainProject: "Espacios Públicos Seguros",
        lastDate: "26 jun 2025",
        status: "Meta cumplida",
      },
      "2025-II": {
        cycle: "2025-II",
        year: "2025",
        semester: "Ciclo II",
        hours: 40,
        goalHours: 40,
        activitiesCount: 4,
        mainProject: "Biohuertos Urbanos",
        lastDate: "28 nov 2025",
        status: "Meta cumplida",
      },
      "2026-I": {
        cycle: "2026-I",
        year: "2026",
        semester: "Ciclo I",
        hours: 42,
        goalHours: 40,
        activitiesCount: 4,
        mainProject: "Mejoramiento de Comedores",
        lastDate: "03 jul 2026",
        status: "Meta cumplida",
      },
      "2026-II": {
        cycle: "2026-II",
        year: "2026",
        semester: "Ciclo II",
        hours: 31,
        goalHours: 40,
        activitiesCount: 3,
        mainProject: "Recuperación de Parques",
        lastDate: "17 oct 2026",
        status: "En curso",
      },
    },
    activities: [
      {
        id: "lf-1",
        cycle: "2026-II",
        title: "Recuperación y arborización de parque vecinal",
        area: "Medio Ambiente",
        place: "Parque Los Olivos de Ñaña",
        date: "17 oct 2026",
        schedule: "07:30 a. m. - 03:30 p. m.",
        hours: 12,
        supervisor: "Arq. Patricia Solís",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "lf-2",
        cycle: "2026-II",
        title: "Diseño participativo de mobiliario escolar",
        area: "Educación y Voluntariado",
        place: "I. E. José Olaya",
        date: "27 sep 2026",
        schedule: "08:00 a. m. - 05:00 p. m.",
        hours: 11,
        supervisor: "Arq. Patricia Solís",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "lf-3",
        cycle: "2026-II",
        title: "Diagnóstico de accesibilidad en comedor solidario",
        area: "Comunidad y Servicio",
        place: "Comedor San José",
        date: "12 sep 2026",
        schedule: "08:00 a. m. - 04:00 p. m.",
        hours: 8,
        supervisor: "Arq. Patricia Solís",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "lf-4",
        cycle: "2026-I",
        title: "Acondicionamiento de cocinas comunitarias",
        area: "Comunidad y Servicio",
        place: "Red de Ollas Comunes Chosica",
        date: "03 jul 2026",
        schedule: "4 jornadas técnicas",
        hours: 42,
        supervisor: "Arq. Patricia Solís",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "lf-5",
        cycle: "2025-II",
        title: "Implementación de Biohuertos Escolares",
        area: "Medio Ambiente",
        place: "Colegios de Huaycán",
        date: "28 nov 2025",
        schedule: "4 jornadas técnicas",
        hours: 40,
        supervisor: "Arq. Patricia Solís",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "lf-6",
        cycle: "2025-I",
        title: "Proyecto Espacios Públicos Seguros",
        area: "Comunidad y Servicio",
        place: "Alameda Ñaña",
        date: "26 jun 2025",
        schedule: "4 jornadas técnicas",
        hours: 40,
        supervisor: "Arq. Patricia Solís",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
    ],
  },
  {
    id: "est-6",
    name: "Diego Quispe Condori",
    initials: "DQ",
    studentCode: "202310771 · EST-00771",
    dni: "73920184",
    faculty: "Enfermería",
    email: "diego.quispe@upeu.edu.pe",
    currentSemesterLabel: "VII Ciclo",
    annualGoalHours: 160,
    cycles: {
      "2025-I": {
        cycle: "2025-I",
        year: "2025",
        semester: "Ciclo I",
        hours: 40,
        goalHours: 40,
        activitiesCount: 4,
        mainProject: "Vacunación y Control Niño Sano",
        lastDate: "27 jun 2025",
        status: "Meta cumplida",
      },
      "2025-II": {
        cycle: "2025-II",
        year: "2025",
        semester: "Ciclo II",
        hours: 38,
        goalHours: 40,
        activitiesCount: 4,
        mainProject: "Cuidado del Adulto Mayor",
        lastDate: "26 nov 2025",
        status: "Meta cumplida",
      },
      "2026-I": {
        cycle: "2026-I",
        year: "2026",
        semester: "Ciclo I",
        hours: 40,
        goalHours: 40,
        activitiesCount: 4,
        mainProject: "Promoción de Vida Saludable",
        lastDate: "02 jul 2026",
        status: "Meta cumplida",
      },
      "2026-II": {
        cycle: "2026-II",
        year: "2026",
        semester: "Ciclo II",
        hours: 40,
        goalHours: 40,
        activitiesCount: 5,
        mainProject: "Jornada de Salud Integral",
        lastDate: "22 oct 2026",
        status: "Meta cumplida",
      },
    },
    activities: [
      {
        id: "dq-1",
        cycle: "2026-II",
        title: "Control de signos vitales y consejería nutricional",
        area: "Bienestar y Salud",
        place: "Clínica Universitaria",
        date: "22 oct 2026",
        schedule: "08:00 a. m. - 04:00 p. m.",
        hours: 16,
        supervisor: "Lic. Rosaura Medina",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "dq-2",
        cycle: "2026-II",
        title: "Campaña de vacunación y prevención comunitaria",
        area: "Bienestar y Salud",
        place: "Posta Médica Virgen del Carmen",
        date: "08 oct 2026",
        schedule: "08:00 a. m. - 04:00 p. m.",
        hours: 14,
        supervisor: "Lic. Rosaura Medina",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "dq-3",
        cycle: "2026-II",
        title: "Visitas domiciliarias al adulto mayor",
        area: "Comunidad y Servicio",
        place: "Sector Balaguer, Ñaña",
        date: "21 sep 2026",
        schedule: "08:00 a. m. - 02:00 p. m.",
        hours: 10,
        supervisor: "Lic. Rosaura Medina",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "dq-4",
        cycle: "2026-I",
        title: "Promoción de Vida Saludable · 8 Remedios Naturales",
        area: "Bienestar y Salud",
        place: "Comunidades de Chaclacayo",
        date: "02 jul 2026",
        schedule: "4 jornadas",
        hours: 40,
        supervisor: "Lic. Rosaura Medina",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "dq-5",
        cycle: "2025-II",
        title: "Programa Integral del Adulto Mayor",
        area: "Bienestar y Salud",
        place: "CIAM Lurigancho",
        date: "26 nov 2025",
        schedule: "4 jornadas",
        hours: 38,
        supervisor: "Lic. Rosaura Medina",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
      {
        id: "dq-6",
        cycle: "2025-I",
        title: "Control Niño Sano y Crecimiento",
        area: "Bienestar y Salud",
        place: "Red de Salud Lima Este",
        date: "27 jun 2025",
        schedule: "4 jornadas",
        hours: 40,
        supervisor: "Lic. Rosaura Medina",
        validationMethod: "QR + GPS",
        status: "Validado",
      },
    ],
  },
];

export function getStudentTotalHours(student: StudentReportItem): number {
  return ALL_CYCLES.reduce((acc, cycle) => acc + student.cycles[cycle].hours, 0);
}

export function getStudentTotalActivities(student: StudentReportItem): number {
  return ALL_CYCLES.reduce((acc, cycle) => acc + student.cycles[cycle].activitiesCount, 0);
}

interface AdminDashboardAndReportProps {
  mode: "dashboard" | "report";
  onSwitchToReport: () => void;
  onSwitchToDashboard: () => void;
}

export function AdminDashboardAndReport({
  mode,
  onSwitchToReport,
  onSwitchToDashboard,
}: AdminDashboardAndReportProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYearFilter, setSelectedYearFilter] = useState<"ALL" | "2026" | "2025">("ALL");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("Todas");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"Todos" | "Meta cumplida" | "En curso" | "Observado">("Todos");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [detailCycleFilter, setDetailCycleFilter] = useState<"ALL" | CycleCode>("ALL");

  const faculties = useMemo(
    () => ["Todas", ...Array.from(new Set(STUDENTS_DATA.map((s) => s.faculty)))],
    []
  );

  const visibleAcademicYears = useMemo(() => {
    if (selectedYearFilter === "ALL") return ACADEMIC_YEARS;
    return ACADEMIC_YEARS.filter((item) => item.year === selectedYearFilter);
  }, [selectedYearFilter]);

  const filteredStudents = useMemo(() => {
    return STUDENTS_DATA.filter((student) => {
      const matchesSearch =
        `${student.name} ${student.studentCode} ${student.dni} ${student.faculty}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesFaculty = selectedFaculty === "Todas" || student.faculty === selectedFaculty;
      const currentCycleStatus = student.cycles["2026-II"].status;
      const matchesStatus =
        selectedStatusFilter === "Todos" || currentCycleStatus === selectedStatusFilter;
      return matchesSearch && matchesFaculty && matchesStatus;
    });
  }, [searchQuery, selectedFaculty, selectedStatusFilter]);

  const selectedStudent = useMemo(
    () => STUDENTS_DATA.find((s) => s.id === selectedStudentId) ?? null,
    [selectedStudentId]
  );

  // Aggregate institutional KPIs for the Admin Dashboards
  const institutionalMetrics = useMemo(() => {
    const totalStudents = STUDENTS_DATA.length;
    const totalHoursAllCycles = STUDENTS_DATA.reduce(
      (sum, student) => sum + getStudentTotalHours(student),
      0
    );
    const totalActivitiesAllCycles = STUDENTS_DATA.reduce(
      (sum, student) => sum + getStudentTotalActivities(student),
      0
    );

    const cycleStats = ALL_CYCLES.map((cycle) => {
      const totalHours = STUDENTS_DATA.reduce((sum, s) => sum + s.cycles[cycle].hours, 0);
      const totalGoal = STUDENTS_DATA.reduce((sum, s) => sum + s.cycles[cycle].goalHours, 0);
      const totalActs = STUDENTS_DATA.reduce((sum, s) => sum + s.cycles[cycle].activitiesCount, 0);
      const completedStudents = STUDENTS_DATA.filter(
        (s) => s.cycles[cycle].hours >= s.cycles[cycle].goalHours * 0.9
      ).length;
      const avgHours = totalHours / totalStudents;
      const completionRate = Math.round((totalHours / totalGoal) * 100);
      return {
        cycle,
        year: cycle.startsWith("2025") ? "2025" : "2026",
        semester: cycle.endsWith("-I") ? "Ciclo I (Mar–Jul)" : "Ciclo II (Ago–Dic)",
        totalHours,
        totalGoal,
        totalActs,
        completedStudents,
        avgHours,
        completionRate,
      };
    });

    const areaBreakdown: Record<string, { hours: number; count: number }> = {
      "Bienestar y Salud": { hours: 0, count: 0 },
      "Educación y Voluntariado": { hours: 0, count: 0 },
      "Comunidad y Servicio": { hours: 0, count: 0 },
      "Medio Ambiente": { hours: 0, count: 0 },
    };

    STUDENTS_DATA.forEach((student) => {
      student.activities.forEach((act) => {
        areaBreakdown[act.area].hours += act.hours;
        areaBreakdown[act.area].count += 1;
      });
    });

    const currentCycleCompleted = STUDENTS_DATA.filter(
      (s) => s.cycles["2026-II"].status === "Meta cumplida"
    ).length;
    const currentCycleInProgress = STUDENTS_DATA.filter(
      (s) => s.cycles["2026-II"].status === "En curso"
    ).length;
    const currentCycleObserved = STUDENTS_DATA.filter(
      (s) => s.cycles["2026-II"].status === "Observado"
    ).length;

    return {
      totalStudents,
      totalHoursAllCycles,
      totalActivitiesAllCycles,
      cycleStats,
      areaBreakdown,
      currentCycleCompleted,
      currentCycleInProgress,
      currentCycleObserved,
    };
  }, []);

  const openStudentDetail = (studentId: string, cycle: "ALL" | CycleCode = "ALL") => {
    setSelectedStudentId(studentId);
    setDetailCycleFilter(cycle);
  };

  // ============================================================================
  // VISTA DE DETALLE DE LAS HORAS REALIZADAS POR EL ESTUDIANTE
  // ============================================================================
  if (selectedStudent) {
    const studentTotalHours = getStudentTotalHours(selectedStudent);
    const studentTotalActs = getStudentTotalActivities(selectedStudent);
    const overallProgress = Math.min(
      100,
      Math.round((studentTotalHours / selectedStudent.annualGoalHours) * 100)
    );
    const visibleLogs =
      detailCycleFilter === "ALL"
        ? selectedStudent.activities
        : selectedStudent.activities.filter((act) => act.cycle === detailCycleFilter);

    return (
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedStudentId(null)}
              className="gap-2"
            >
              <ArrowLeft className="size-4" />
              Volver al reporte de alumnos
            </Button>
            <div className="hidden h-5 w-px bg-border sm:block" />
            <span className="text-xs font-medium text-muted-foreground">
              Expediente de Proyección Social · Vista de detalle por alumno
            </span>
          </div>
          <Badge variant="secondary" className="gap-1.5">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            Horas auditadas por QR y GPS
          </Badge>
        </div>

        {/* Ficha principal del estudiante */}
        <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-muted/30">
          <CardContent className="pt-6">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="flex items-start gap-4">
                <Avatar className="size-16 border-2 border-primary/20 text-lg font-semibold">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedStudent.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">{selectedStudent.name}</h2>
                    <Badge>{selectedStudent.faculty}</Badge>
                    <Badge variant="outline">{selectedStudent.currentSemesterLabel}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                    <span>
                      <strong className="font-medium text-foreground">Código:</strong>{" "}
                      {selectedStudent.studentCode}
                    </span>
                    <span>
                      <strong className="font-medium text-foreground">DNI:</strong>{" "}
                      {selectedStudent.dni}
                    </span>
                    <span>
                      <strong className="font-medium text-foreground">Correo:</strong>{" "}
                      {selectedStudent.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 rounded-xl border bg-background/80 p-4 sm:min-w-88">
                <div>
                  <p className="text-xs text-muted-foreground">Horas Totales</p>
                  <p className="text-2xl font-bold text-primary">{studentTotalHours} h</p>
                  <p className="text-[11px] text-muted-foreground">
                    Meta: {selectedStudent.annualGoalHours} h
                  </p>
                </div>
                <div className="border-x px-3">
                  <p className="text-xs text-muted-foreground">Ciclos cursados</p>
                  <p className="text-2xl font-bold">4 ciclos</p>
                  <p className="text-[11px] text-muted-foreground">2 por año (2025–2026)</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Actividades</p>
                  <p className="text-2xl font-bold">{studentTotalActs}</p>
                  <p className="text-[11px] text-emerald-600">{overallProgress}% completado</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Desglose por Año y sus 2 Ciclos Académicos */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-semibold">
                Resumen por Ciclo Académico (2 ciclos por año)
              </h3>
              <p className="text-sm text-muted-foreground">
                Selecciona cualquier ciclo para filtrar las actividades y horas realizadas en ese semestre.
              </p>
            </div>
            {detailCycleFilter !== "ALL" && (
              <Button variant="ghost" size="sm" onClick={() => setDetailCycleFilter("ALL")}>
                Mostrar todos los ciclos ({ALL_CYCLES.length})
              </Button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {ACADEMIC_YEARS.map((yearGroup) => {
              const yearHours = yearGroup.cycles.reduce(
                (acc, c) => acc + selectedStudent.cycles[c].hours,
                0
              );
              const yearGoal = yearGroup.cycles.reduce(
                (acc, c) => acc + selectedStudent.cycles[c].goalHours,
                0
              );
              return (
                <Card key={yearGroup.year}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardDescription className="text-xs font-semibold uppercase tracking-wider">
                          {yearGroup.label}
                        </CardDescription>
                        <CardTitle className="text-base">
                          Total Año {yearGroup.year}: {yearHours} h{" "}
                          <span className="text-sm font-normal text-muted-foreground">
                            / {yearGoal} h meta anual
                          </span>
                        </CardTitle>
                      </div>
                      <Badge variant="outline">2 ciclos</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-3 sm:grid-cols-2">
                    {yearGroup.cycles.map((cycleCode) => {
                      const cData = selectedStudent.cycles[cycleCode];
                      const pct = Math.min(100, Math.round((cData.hours / cData.goalHours) * 100));
                      const isSelected = detailCycleFilter === cycleCode;
                      return (
                        <button
                          key={cycleCode}
                          type="button"
                          onClick={() =>
                            setDetailCycleFilter(isSelected ? "ALL" : cycleCode)
                          }
                          className={`flex flex-col justify-between rounded-lg border p-3.5 text-left transition-all hover:border-primary/60 hover:bg-muted/40 ${
                            isSelected
                              ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                              : "bg-background"
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-semibold text-sm">
                                Ciclo {cData.cycle}
                              </span>
                              <Badge
                                variant={
                                  cData.status === "Meta cumplida"
                                    ? "secondary"
                                    : cData.status === "En curso"
                                    ? "outline"
                                    : "destructive"
                                }
                                className="text-[10px]"
                              >
                                {cData.status}
                              </Badge>
                            </div>
                            <div className="flex items-baseline justify-between">
                              <span className="text-2xl font-bold">
                                {cData.hours} <span className="text-xs font-normal">h</span>
                              </span>
                              <span className="text-xs text-muted-foreground">
                                Meta: {cData.goalHours} h ({pct}%)
                              </span>
                            </div>
                            <Progress value={pct} locale="es-PE" />
                          </div>
                          <div className="mt-3 space-y-1 border-t pt-2.5 text-xs text-muted-foreground">
                            <p className="truncate font-medium text-foreground">
                              {cData.mainProject}
                            </p>
                            <div className="flex items-center justify-between">
                              <span>{cData.activitiesCount} actividades</span>
                              <span>Últ.: {cData.lastDate}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Tabla de detalle de actividades y horas realizadas por el estudiante */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock3 className="size-5 text-primary" />
                  Detalle de horas realizadas por {selectedStudent.name}
                </CardTitle>
                <CardDescription>
                  Registro cronológico de participaciones, proyectos, horarios y validación de asistencia.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Button
                  size="xs"
                  variant={detailCycleFilter === "ALL" ? "default" : "outline"}
                  onClick={() => setDetailCycleFilter("ALL")}
                >
                  Todos ({selectedStudent.activities.length})
                </Button>
                {ALL_CYCLES.map((cycle) => (
                  <Button
                    key={cycle}
                    size="xs"
                    variant={detailCycleFilter === cycle ? "default" : "outline"}
                    onClick={() => setDetailCycleFilter(cycle)}
                  >
                    {cycle} ({selectedStudent.cycles[cycle].hours} h)
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Ciclo</TableHead>
                  <TableHead>Actividad / Proyecto Social</TableHead>
                  <TableHead>Eje de Impacto</TableHead>
                  <TableHead>Lugar y Fecha</TableHead>
                  <TableHead>Supervisor / Validador</TableHead>
                  <TableHead className="text-right">Horas Acreditadas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {log.cycle}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs whitespace-normal">
                      <p className="font-medium text-foreground">{log.title}</p>
                      <p className="text-xs text-muted-foreground">{log.schedule}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{log.area}</Badge>
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      <p className="flex items-center gap-1 text-sm">
                        <MapPin className="size-3.5 text-muted-foreground" />
                        {log.place}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="size-3" />
                        {log.date}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{log.supervisor}</p>
                      <p className="flex items-center gap-1 text-xs text-emerald-700">
                        <QrCode className="size-3" />
                        {log.validationMethod} · {log.status}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">
                        +{log.hours} h
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    );
  }

  // ============================================================================
  // BLOQUE REUTILIZABLE: TABLA DE REPORTE DE TODOS LOS ALUMNOS
  // ============================================================================
  const studentReportSection = (
    <Card id="reporte-alumnos-card" className="border-border/80 shadow-xs">
      <CardHeader className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Badge variant="secondary" className="gap-1">
                <FileSpreadsheet className="size-3.5" />
                Reporte Consolidado
              </Badge>
              <span className="text-xs text-muted-foreground">
                2 ciclos académicos por año (2025-I, 2025-II, 2026-I, 2026-II)
              </span>
            </div>
            <CardTitle className="text-xl">
              Reporte General de Alumnos y Horas por Ciclo
            </CardTitle>
            <CardDescription>
              Visualiza el nombre, código o DNI, horas totales acumuladas y el desglose dentro de cada ciclo académico (horas del ciclo, meta, número de actividades y proyecto). Haz clic en cualquier alumno o ciclo para abrir la vista de detalle.
            </CardDescription>
          </div>
        </div>

        {/* Barra de filtros del reporte */}
        <div className="grid gap-3 pt-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar alumno por nombre, código universitario o DNI…"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Filter className="size-3.5 shrink-0" />
            <span className="shrink-0 font-medium">Escuela:</span>
            <select
              className="h-8 w-full rounded-md border bg-background px-2 text-sm text-foreground"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              aria-label="Filtrar por escuela profesional"
            >
              {faculties.map((fac) => (
                <option key={fac} value={fac}>
                  {fac}
                </option>
              ))}
            </select>
          </label>

          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5 shrink-0" />
            <span className="shrink-0 font-medium">Ciclos:</span>
            <select
              className="h-8 w-full rounded-md border bg-background px-2 text-sm text-foreground"
              value={selectedYearFilter}
              onChange={(e) =>
                setSelectedYearFilter(e.target.value as "ALL" | "2026" | "2025")
              }
              aria-label="Filtrar columnas de ciclos por año"
            >
              <option value="ALL">2025 y 2026 (4 ciclos)</option>
              <option value="2026">Año 2026 (2026-I y 2026-II)</option>
              <option value="2025">Año 2025 (2025-I y 2025-II)</option>
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-1.5">
            <span>Estado en Ciclo 2026-II:</span>
            {(["Todos", "Meta cumplida", "En curso", "Observado"] as const).map(
              (statusOption) => (
                <Button
                  key={statusOption}
                  size="xs"
                  variant={selectedStatusFilter === statusOption ? "default" : "outline"}
                  onClick={() => setSelectedStatusFilter(statusOption)}
                >
                  {statusOption}
                </Button>
              )
            )}
          </div>
          <span>
            Mostrando <strong>{filteredStudents.length}</strong> de{" "}
            <strong>{STUDENTS_DATA.length}</strong> alumnos registrados
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            {/* Fila superior de agrupación por Año (2 ciclos por año) */}
            <TableRow className="bg-muted/60 text-xs">
              <TableHead rowSpan={2} className="min-w-52 border-r align-middle">
                Nombre del Estudiante
              </TableHead>
              <TableHead rowSpan={2} className="min-w-40 border-r align-middle">
                Código / DNI
              </TableHead>
              <TableHead rowSpan={2} className="min-w-36 border-r align-middle">
                Horas Totales
              </TableHead>
              {visibleAcademicYears.map((yearGroup) => (
                <TableHead
                  key={yearGroup.year}
                  colSpan={2}
                  className="border-r text-center font-semibold text-foreground"
                >
                  Año {yearGroup.year} · 2 Ciclos Académicos ({yearGroup.cycles[0]} y{" "}
                  {yearGroup.cycles[1]})
                </TableHead>
              ))}
              <TableHead rowSpan={2} className="text-right align-middle">
                Detalle
              </TableHead>
            </TableRow>
            <TableRow className="bg-muted/30">
              {visibleAcademicYears.flatMap((yearGroup) =>
                yearGroup.cycles.map((cycleCode) => (
                  <TableHead key={cycleCode} className="min-w-48 border-r">
                    <div className="flex items-center justify-between">
                      <span>Ciclo {cycleCode}</span>
                      <span className="text-[11px] font-normal text-muted-foreground">
                        Meta: 40 h
                      </span>
                    </div>
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredStudents.map((student) => {
              const totalHours = getStudentTotalHours(student);
              const totalActs = getStudentTotalActivities(student);
              const totalPct = Math.min(
                100,
                Math.round((totalHours / student.annualGoalHours) * 100)
              );

              return (
                <TableRow key={student.id} className="align-top">
                  {/* Columna 1: Nombre */}
                  <TableCell className="border-r py-3">
                    <div className="flex items-start gap-2.5">
                      <Avatar className="mt-0.5 size-9">
                        <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                          {student.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-0.5 whitespace-normal">
                        <button
                          type="button"
                          onClick={() => openStudentDetail(student.id, "ALL")}
                          className="text-left font-semibold text-foreground hover:text-primary hover:underline"
                        >
                          {student.name}
                        </button>
                        <p className="text-xs text-muted-foreground">
                          {student.faculty} · {student.currentSemesterLabel}
                        </p>
                        <p className="text-[11px] text-muted-foreground">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Columna 2: Código o DNI */}
                  <TableCell className="border-r py-3">
                    <div className="space-y-1">
                      <div>
                        <span className="text-[10px] font-medium uppercase text-muted-foreground">
                          Código UPeU
                        </span>
                        <p className="font-mono text-xs font-semibold">
                          {student.studentCode}
                        </p>
                      </div>
                      <div>
                        <span className="text-[10px] font-medium uppercase text-muted-foreground">
                          DNI
                        </span>
                        <p className="font-mono text-xs text-muted-foreground">
                          {student.dni}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Columna 3: Horas Totales */}
                  <TableCell className="border-r py-3">
                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-lg font-bold text-primary">
                          {totalHours} h
                        </span>
                        <span className="text-xs text-muted-foreground">
                          / {student.annualGoalHours} h
                        </span>
                      </div>
                      <Progress value={totalPct} locale="es-PE" />
                      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>{totalActs} asistencias</span>
                        <span className="font-medium text-foreground">{totalPct}%</span>
                      </div>
                    </div>
                  </TableCell>

                  {/* Columnas de Ciclos (2 por año): muestra horas del ciclo y sus datos respectivos */}
                  {visibleAcademicYears.flatMap((yearGroup) =>
                    yearGroup.cycles.map((cycleCode) => {
                      const cData = student.cycles[cycleCode];
                      const pct = Math.min(
                        100,
                        Math.round((cData.hours / cData.goalHours) * 100)
                      );
                      return (
                        <TableCell key={cycleCode} className="border-r py-2.5">
                          <button
                            type="button"
                            onClick={() => openStudentDetail(student.id, cycleCode)}
                            className="w-full rounded-lg border bg-muted/20 p-2.5 text-left transition-colors hover:border-primary/50 hover:bg-muted/60"
                            title={`Ver detalle de ${student.name} en el ciclo ${cycleCode}`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-bold text-foreground">
                                {cData.hours} h{" "}
                                <span className="text-xs font-normal text-muted-foreground">
                                  / {cData.goalHours} h
                                </span>
                              </span>
                              <Badge
                                variant={
                                  cData.status === "Meta cumplida"
                                    ? "secondary"
                                    : cData.status === "En curso"
                                    ? "outline"
                                    : "destructive"
                                }
                                className="h-4 px-1.5 text-[10px]"
                              >
                                {pct}%
                              </Badge>
                            </div>
                            <p className="mt-1 truncate text-xs font-medium text-foreground">
                              {cData.mainProject}
                            </p>
                            <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                              <span>{cData.activitiesCount} activ.</span>
                              <span>Últ.: {cData.lastDate}</span>
                            </div>
                          </button>
                        </TableCell>
                      );
                    })
                  )}

                  {/* Columna de acción: Vista de detalle */}
                  <TableCell className="py-3 text-right">
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() => openStudentDetail(student.id, "ALL")}
                      className="gap-1.5"
                    >
                      <Eye className="size-3.5" />
                      Ver detalle
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredStudents.length === 0 && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No se encontraron alumnos con los filtros seleccionados.
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Si está en la pestaña exclusiva de "Reporte de alumnos", mostramos un resumen rápido y la tabla completa
  if (mode === "report") {
    return (
      <section className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card size="sm">
            <CardHeader>
              <CardDescription> Padrón de Estudiantes</CardDescription>
              <CardTitle className="text-2xl">
                {institutionalMetrics.totalStudents} alumnos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              6 escuelas profesionales activas en el sistema
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardDescription>Horas Acreditadas (2025–2026)</CardDescription>
              <CardTitle className="text-2xl">
                {institutionalMetrics.totalHoursAllCycles} h
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              Acumuladas en 4 ciclos (2 ciclos por año)
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardDescription>Meta Cumplida (Ciclo 2026-II)</CardDescription>
              <CardTitle className="text-2xl text-emerald-600">
                {institutionalMetrics.currentCycleCompleted} de{" "}
                {institutionalMetrics.totalStudents}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              {institutionalMetrics.currentCycleInProgress} en curso ·{" "}
              {institutionalMetrics.currentCycleObserved} por reforzar
            </CardContent>
          </Card>
          <Card size="sm">
            <CardHeader>
              <CardDescription>Asistencias Verificadas</CardDescription>
              <CardTitle className="text-2xl">
                {institutionalMetrics.totalActivitiesAllCycles} registros
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground">
              100% con código QR y ubicación registrada
            </CardContent>
          </Card>
        </div>

        {studentReportSection}
      </section>
    );
  }

  // ============================================================================
  // VISTA PRINCIPAL DEL ADMINISTRADOR: DASHBOARDS PROPUESTOS + REPORTE DE ALUMNOS
  // ============================================================================
  return (
    <section className="space-y-8">
      {/* 1. Tarjetas KPI Ejecutivas (sin horas personales del administrador) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>HORAS INSTITUCIONALES ACREDITADAS</span>
              <TrendingUp className="size-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              {institutionalMetrics.totalHoursAllCycles}{" "}
              <span className="text-base font-normal text-muted-foreground">h totales</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs text-muted-foreground">
            <p className="font-medium text-emerald-700">
              +191.5 h registradas en el ciclo actual 2026-II
            </p>
            <p>Suma global de todos los estudiantes (2025-I a 2026-II)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>ESTUDIANTES EN PROYECCIÓN SOCIAL</span>
              <Users className="size-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              {institutionalMetrics.totalStudents}{" "}
              <span className="text-base font-normal text-muted-foreground">alumnos</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">
              Promedio global:{" "}
              {(
                institutionalMetrics.totalHoursAllCycles /
                institutionalMetrics.totalStudents
              ).toFixed(1)}{" "}
              h / alumno
            </p>
            <p>100% con expediente activo en 6 escuelas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>AVANCE META SEMESTRAL (2026-II)</span>
              <Award className="size-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              {institutionalMetrics.cycleStats[3].completionRate}%{" "}
              <span className="text-base font-normal text-muted-foreground">de meta</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <Progress
              value={institutionalMetrics.cycleStats[3].completionRate}
              locale="es-PE"
            />
            <p>
              Promedio 2026-II:{" "}
              {institutionalMetrics.cycleStats[3].avgHours.toFixed(1)} h de 40 h requeridas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>PARTICIPACIONES VALIDADAS QR/GPS</span>
              <QrCode className="size-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              {institutionalMetrics.totalActivitiesAllCycles}{" "}
              <span className="text-base font-normal text-muted-foreground">asistencias</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs text-muted-foreground">
            <p className="font-medium text-emerald-700">
              {institutionalMetrics.cycleStats[3].totalActs} participaciones en 2026-II
            </p>
            <p>Auditoría geolocalizada en campo sin incidencias</p>
          </CardContent>
        </Card>
      </div>

      {/* 2. Dashboards Analíticos Propuestos: Comparativa por Ciclos (2 por año) + Ejes de Impacto */}
      <div className="grid gap-6 lg:grid-cols-[1.25fr_.95fr]">
        {/* Dashboard 1: Rendimiento comparativo por Año y Ciclo Académico (2 ciclos por año) */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="size-5 text-primary" />
                  Evolución de Horas por Ciclo Académico (2 ciclos por año)
                </CardTitle>
                <CardDescription>
                  Comparativa semestral de horas acreditadas, promedio por alumno y cumplimiento de la meta de 40 h por ciclo.
                </CardDescription>
              </div>
              <Badge variant="outline">Meta: 40 h / ciclo</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {ACADEMIC_YEARS.map((yearGroup) => {
                const statsForYear = institutionalMetrics.cycleStats.filter(
                  (c) => c.year === yearGroup.year
                );
                const yearTotalHours = statsForYear.reduce(
                  (acc, item) => acc + item.totalHours,
                  0
                );
                return (
                  <div
                    key={yearGroup.year}
                    className="space-y-3 rounded-xl border bg-muted/20 p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Año Académico {yearGroup.year}
                        </p>
                        <p className="text-sm font-bold">
                          Total anual: {yearTotalHours} h colectivas
                        </p>
                      </div>
                      <Badge variant="secondary">2 Ciclos</Badge>
                    </div>

                    <div className="space-y-3">
                      {statsForYear.map((stat) => (
                        <div
                          key={stat.cycle}
                          className="space-y-1.5 rounded-lg border bg-background p-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-sm">
                                Ciclo {stat.cycle}
                              </span>
                              <span className="ml-2 text-xs text-muted-foreground">
                                {stat.semester}
                              </span>
                            </div>
                            <Badge
                              variant={stat.completionRate >= 90 ? "secondary" : "outline"}
                            >
                              {stat.completionRate}% meta
                            </Badge>
                          </div>
                          <Progress value={stat.completionRate} locale="es-PE" />
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-muted-foreground">
                            <span>
                              <strong className="text-foreground">
                                {stat.totalHours} h
                              </strong>{" "}
                              totales ({stat.avgHours.toFixed(1)} h/alumno)
                            </span>
                            <span>{stat.totalActs} asistencias</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Semáforo de estado de cumplimiento del ciclo vigente */}
            <div className="grid gap-3 rounded-xl border bg-muted/30 p-3.5 sm:grid-cols-3">
              <button
                type="button"
                onClick={() => setSelectedStatusFilter("Meta cumplida")}
                className="flex items-center justify-between rounded-lg border bg-background p-3 text-left transition hover:border-emerald-500"
              >
                <div>
                  <p className="text-xs text-muted-foreground">Meta cumplida (2026-II)</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {institutionalMetrics.currentCycleCompleted} alumnos
                  </p>
                </div>
                <CheckCircle2 className="size-5 text-emerald-600" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatusFilter("En curso")}
                className="flex items-center justify-between rounded-lg border bg-background p-3 text-left transition hover:border-primary"
              >
                <div>
                  <p className="text-xs text-muted-foreground">En progreso regular</p>
                  <p className="text-xl font-bold text-primary">
                    {institutionalMetrics.currentCycleInProgress} alumnos
                  </p>
                </div>
                <Clock3 className="size-5 text-primary" />
              </button>
              <button
                type="button"
                onClick={() => setSelectedStatusFilter("Observado")}
                className="flex items-center justify-between rounded-lg border bg-background p-3 text-left transition hover:border-amber-500"
              >
                <div>
                  <p className="text-xs text-muted-foreground">Requiere seguimiento</p>
                  <p className="text-xl font-bold text-amber-600">
                    {institutionalMetrics.currentCycleObserved} alumno
                  </p>
                </div>
                <Activity className="size-5 text-amber-600" />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard 2: Distribución de Horas por Eje de Impacto Social y Escuelas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HeartHandshake className="size-5 text-primary" />
              Impacto por Eje Social y Escuela Profesional
            </CardTitle>
            <CardDescription>
              Distribución de las horas ejecutadas según la línea de intervención comunitaria.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(institutionalMetrics.areaBreakdown).map(([area, info]) => {
              const pct = Math.round(
                (info.hours / institutionalMetrics.totalHoursAllCycles) * 100
              );
              return (
                <div key={area} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{area}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      <strong className="text-foreground">{info.hours} h</strong> ({pct}%) ·{" "}
                      {info.count} jornadas
                    </span>
                  </div>
                  <Progress value={pct} locale="es-PE" />
                </div>
              );
            })}

            <div className="border-t pt-4">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Participación por Escuela Profesional
              </p>
              <div className="grid grid-cols-2 gap-2">
                {STUDENTS_DATA.map((student) => {
                  const total = getStudentTotalHours(student);
                  return (
                    <button
                      key={student.id}
                      type="button"
                      onClick={() => openStudentDetail(student.id, "ALL")}
                      className="flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2 text-left text-xs transition hover:border-primary/50 hover:bg-muted/50"
                    >
                      <span className="truncate font-medium">{student.faculty}</span>
                      <Badge variant="secondary" className="ml-2 shrink-0">
                        {total} h
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Vista de Reporte de todos los alumnos integrada directamente en la vista del administrador */}
      {studentReportSection}
    </section>
  );
}
