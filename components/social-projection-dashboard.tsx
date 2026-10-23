"use client";

import { useMemo, useState } from "react";
import { Activity, ArrowRight, Bell, CalendarDays, Check, ChevronDown, Clock3, Compass, FileText, Gauge, HeartHandshake, LayoutDashboard, MapPin, Menu, QrCode, Search, ShieldCheck, Sparkles, UsersRound } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Role = "Estudiante" | "Asistente" | "Administrador";
type View = "Inicio" | "Mi progreso" | "Actividades" | "Mi QR" | "Registrar asistencia" | "Estudiantes" | "Usuarios" | "Configuración";
const activities = [
  { title: "Manos que alimentan", area: "Comunidad · Servicio", date: "Sáb, 18 oct", time: "8:00 a. m.", place: "Comedor San José", hours: "4 h", icon: HeartHandshake },
  { title: "Lectura para todos", area: "Educación · Voluntariado", date: "Mié, 22 oct", time: "3:30 p. m.", place: "Biblioteca Central", hours: "2 h", icon: FileText },
  { title: "Jornada de salud", area: "Bienestar · Comunidad", date: "Sáb, 25 oct", time: "9:00 a. m.", place: "Clínica Universitaria", hours: "3 h", icon: Activity },
];
const history = ["Huerto comunitario", "Acompañamiento escolar", "Despensa solidaria"];
const nav: { label: View; icon: typeof LayoutDashboard; roles: Role[] }[] = [
  { label: "Inicio", icon: LayoutDashboard, roles: ["Estudiante", "Asistente", "Administrador"] },
  { label: "Mi progreso", icon: Gauge, roles: ["Estudiante", "Asistente"] },
  { label: "Actividades", icon: Compass, roles: ["Estudiante", "Asistente", "Administrador"] },
  { label: "Mi QR", icon: QrCode, roles: ["Estudiante", "Asistente"] },
  { label: "Registrar asistencia", icon: ShieldCheck, roles: ["Asistente", "Administrador"] },
  { label: "Estudiantes", icon: UsersRound, roles: ["Administrador"] },
  { label: "Usuarios", icon: UsersRound, roles: ["Administrador"] },
  { label: "Configuración", icon: Activity, roles: ["Administrador"] },
];

export default function SocialProjectionDashboard() {
  const [role, setRole] = useState<Role>("Estudiante");
  const [view, setView] = useState<View>("Inicio");
  const [query, setQuery] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const visibleActivities = useMemo(() => activities.filter((item) => `${item.title} ${item.area} ${item.place}`.toLowerCase().includes(query.toLowerCase())), [query]);
  const go = (next: View) => { setView(next); setMobileMenu(false); };
  const title = view === "Inicio" ? (role === "Administrador" ? "Resumen institucional" : "Hola, Daniela") : view;

  return <div className="min-h-screen bg-background text-foreground">
    <aside className={`${mobileMenu ? "fixed" : "hidden"} inset-y-0 left-0 z-30 w-64 flex-col border-r bg-sidebar p-4 md:fixed md:flex`}>
      <div className="flex h-12 items-center gap-3 px-2 text-lg font-semibold"><HeartHandshake className="size-5 text-primary" /> Proyección Social</div>
      <p className="px-2 pb-3 pt-6 text-xs font-medium text-muted-foreground">UNIVERSIDAD PERUANA UNIÓN</p>
      <nav className="grid gap-1">{nav.filter((item) => item.roles.includes(role)).map(({ label, icon: Icon }) => <Button key={label} variant={view === label ? "secondary" : "ghost"} className="justify-start gap-3" onClick={() => go(label)}><Icon className="size-4" />{label}</Button>)}</nav>
      <div className="mt-auto"><Separator className="my-4" /><div className="flex items-center gap-3 px-2"><Avatar className="size-9"><AvatarFallback>DR</AvatarFallback></Avatar><div className="min-w-0"><p className="text-sm font-medium">Daniela Rojas</p><p className="text-xs text-muted-foreground">{role}</p></div><ChevronDown className="ml-auto size-4 text-muted-foreground" /></div></div>
    </aside>
    {mobileMenu && <button aria-label="Cerrar menú" className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={() => setMobileMenu(false)} />}
    <div className="md:pl-64">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú" onClick={() => setMobileMenu(true)}><Menu className="size-4" /></Button>
        <p className="text-sm text-muted-foreground">Portal <span className="px-2">/</span><span className="text-foreground">Mi espacio</span></p>
        <div className="ml-auto flex items-center gap-3"><label className="flex items-center gap-2 text-sm text-muted-foreground">Vista<select className="h-9 rounded-md border bg-background px-2 text-sm text-foreground" value={role} onChange={(e) => { setRole(e.target.value as Role); go("Inicio"); }}><option>Estudiante</option><option>Asistente</option><option>Administrador</option></select></label><Button variant="ghost" size="icon" aria-label="Notificaciones"><Bell className="size-4" /></Button><Avatar className="size-8"><AvatarFallback>DR</AvatarFallback></Avatar></div>
      </header>
      <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2 text-sm text-muted-foreground md:px-6"><Sparkles className="size-4" /><span>Vista de demostración. Los datos mostrados son de ejemplo y no se guardan.</span></div>
      <main className="mx-auto w-full max-w-6xl space-y-8 p-4 md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-sm text-muted-foreground">SÁBADO, 18 DE OCTUBRE DE 2026 · CICLO 2026-II</p><h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1><p className="mt-2 text-muted-foreground">{view === "Inicio" ? "Tu compromiso deja huella. Mira lo que has logrado y lo que viene." : `Consulta y administra ${view.toLowerCase()} de proyección social.`}</p></div><Badge variant="secondary">{role}</Badge></div>
        {(view === "Inicio" || view === "Mi progreso") && <section className="grid gap-4 md:grid-cols-3"><Card className="md:col-span-2"><CardHeader><CardDescription className="flex items-center gap-2"><Clock3 className="size-4" /> HORAS DE PROYECCIÓN SOCIAL</CardDescription><CardTitle className="text-5xl">28.5 <span className="text-xl font-normal text-muted-foreground">horas</span></CardTitle></CardHeader><CardContent><div className="mb-2 flex justify-between text-sm"><span>Meta del ciclo</span><span>71%</span></div><Progress value={71} locale="es-PE" /><p className="mt-3 text-sm text-muted-foreground">+6.5 horas desde el último ciclo</p></CardContent></Card><Card><CardHeader><CardDescription>ESTUDIANTES ACTIVOS</CardDescription><CardTitle className="text-4xl">312</CardTitle></CardHeader><CardContent><Button variant="outline" onClick={() => go(role === "Administrador" ? "Estudiantes" : "Mi progreso")}>Ver progreso <ArrowRight className="ml-2 size-4" /></Button></CardContent></Card></section>}
        {(view === "Inicio" || view === "Actividades") && <section className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-semibold">{view === "Inicio" ? "Próximas actividades" : "Actividades"}</h2><p className="text-sm text-muted-foreground">Encuentra dónde compartir tus talentos.</p></div><div className="relative w-full max-w-sm"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar actividad" /></div></div><div className="grid gap-4 md:grid-cols-3">{visibleActivities.map(({ title: name, area, date, time, place, hours, icon: Icon }) => <Card key={name}><CardHeader><div className="mb-2 flex items-center justify-between"><span className="rounded-md bg-muted p-2"><Icon className="size-5" /></span><Badge variant="outline">{hours}</Badge></div><CardTitle className="text-lg">{name}</CardTitle><CardDescription>{area}</CardDescription></CardHeader><CardContent className="space-y-2 text-sm text-muted-foreground"><p className="flex items-center gap-2"><MapPin className="size-4" />{place}</p><p className="flex items-center gap-2"><CalendarDays className="size-4" />{date} · {time}</p><Button variant="link" className="h-auto p-0" onClick={() => go("Registrar asistencia")}>Conocer actividad <ArrowRight className="ml-1 size-4" /></Button></CardContent></Card>)}</div>{visibleActivities.length === 0 && <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No encontramos actividades con ese nombre.</CardContent></Card>}</section>}
        {(view === "Inicio" || view === "Mi progreso") && <Card><CardHeader><CardTitle>Horas que ya compartiste</CardTitle><CardDescription>Historial de asistencias · Ciclo 2026-II</CardDescription></CardHeader><CardContent className="space-y-4">{history.map((name, i) => <div key={name} className="flex items-center gap-3"><div className="rounded-full bg-muted p-2"><Check className="size-4" /></div><div className="flex-1"><p className="text-sm font-medium">{name}</p><p className="text-xs text-muted-foreground">{["04 oct 2026 · Villa Esperanza", "27 sep 2026 · I. E. José Olaya", "13 sep 2026 · Comedor San José"][i]}</p></div><Badge variant="secondary">{["3.5 h", "2 h", "4 h"][i]}</Badge></div>)}</CardContent></Card>}
        {view !== "Inicio" && view !== "Mi progreso" && view !== "Actividades" && <Card><CardHeader><CardTitle>{view}</CardTitle><CardDescription>Información de demostración · Los cambios no se guardan.</CardDescription></CardHeader><CardContent>{view === "Estudiantes" ? <Table><TableHeader><TableRow><TableHead>Estudiante</TableHead><TableHead>Programa</TableHead><TableHead>Horas</TableHead></TableRow></TableHeader><TableBody>{[["Daniela Rojas", "Psicología", "28.5 h"], ["Joaquín Mendoza", "Ingeniería Ambiental", "24 h"], ["Lucía Morales", "Educación", "32 h"]].map((row) => <TableRow key={row[0]}>{row.map((cell) => <TableCell key={cell}>{cell}</TableCell>)}</TableRow>)}</TableBody></Table> : <div className="flex min-h-40 flex-col items-center justify-center gap-3 text-center"><div className="rounded-full bg-muted p-3">{view === "Mi QR" ? <QrCode className="size-6" /> : view === "Registrar asistencia" ? <ShieldCheck className="size-6" /> : <UsersRound className="size-6" />}</div><p className="text-muted-foreground">{view === "Mi QR" ? "Código QR ilustrativo de Daniela Rojas · EST-00482" : view === "Registrar asistencia" ? "Selecciona una actividad para registrar asistencia." : `Panel de ${view.toLowerCase()} de demostración.`}</p><Button variant="outline" onClick={() => go("Actividades")}>Ver actividades</Button></div>}</CardContent></Card>}
        <footer className="flex flex-wrap justify-between gap-2 border-t pt-4 text-sm text-muted-foreground"><span>Universidad Peruana Unión · Proyección Social</span><span className="flex items-center gap-2">Servir también es aprender <HeartHandshake className="size-4" /></span></footer>
      </main>
    </div>
  </div>;
}
