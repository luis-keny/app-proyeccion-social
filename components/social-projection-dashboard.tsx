"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Activity, ArrowRight, Bell, CalendarDays, Check, ChevronDown, Clock3, Compass, FileSpreadsheet, FileText, Gauge, HeartHandshake, LayoutDashboard, LoaderCircle, MapPin, Menu, Pencil, Plus, QrCode, Search, ShieldCheck, Sparkles, Trash2, Video, VideoOff } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ActivityMapPicker } from "@/components/activity-map-picker";
import { AdminDashboardAndReport } from "@/components/admin-dashboard-report";

type Role = "Estudiante" | "Asistente" | "Administrador";
type View = "Mi progreso" | "Dashboard" | "Reporte de alumnos" | "Actividades" | "Mi QR" | "Registrar asistencia";
const activities = [
  { title: "Manos que alimentan", area: "Comunidad · Servicio", date: "Sáb, 25 oct", time: "8:00 a. m.", place: "Comedor San José", hours: "4 h", icon: HeartHandshake, lat: -12.0464, lng: -77.0428 },
  { title: "Lectura para todos", area: "Educación · Voluntariado", date: "Mié, 28 oct", time: "3:30 p. m.", place: "Biblioteca Central", hours: "2 h", icon: FileText, lat: -12.0561, lng: -77.0845 },
  { title: "Jornada de salud", area: "Bienestar · Comunidad", date: "Sáb, 31 oct", time: "9:00 a. m.", place: "Clínica Universitaria", hours: "3 h", icon: Activity, lat: -12.0797, lng: -77.0357 },
];
const history = ["Huerto comunitario", "Acompañamiento escolar", "Despensa solidaria"];
const nav: { label: View; icon: typeof LayoutDashboard; roles: Role[] }[] = [
  { label: "Dashboard", icon: LayoutDashboard, roles: ["Administrador"] },
  { label: "Reporte de alumnos", icon: FileSpreadsheet, roles: ["Administrador"] },
  { label: "Mi progreso", icon: Gauge, roles: ["Estudiante", "Asistente"] },
  { label: "Actividades", icon: Compass, roles: ["Estudiante", "Asistente", "Administrador"] },
  { label: "Mi QR", icon: QrCode, roles: ["Estudiante", "Asistente"] },
  { label: "Registrar asistencia", icon: ShieldCheck, roles: ["Asistente", "Administrador"] },
];

export default function SocialProjectionDashboard() {
  const [role, setRole] = useState<Role>("Estudiante");
  const [view, setView] = useState<View>("Mi progreso");
  const [query, setQuery] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(activities[0]);
  const [cameraState, setCameraState] = useState<"idle" | "starting" | "ready" | "error">("idle");
  const [cameraMessage, setCameraMessage] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationMessage, setLocationMessage] = useState("Solicitando ubicación del dispositivo…");
  const [attendance, setAttendance] = useState(false);
  const [newActivityTitle, setNewActivityTitle] = useState("");
  const [newActivityPlace, setNewActivityPlace] = useState("");
  const [newActivityHours, setNewActivityHours] = useState("2");
  const [draftCoordinates, setDraftCoordinates] = useState({ lat: -12.0464, lng: -77.0428 });
  const [mapLocationMessage, setMapLocationMessage] = useState("Marcador inicial en tu ubicación actual.");
  const [activityMessage, setActivityMessage] = useState("");
  const [activityList, setActivityList] = useState(activities);
  const [activityDrawerOpen, setActivityDrawerOpen] = useState(false);
  const [editingActivityTitle, setEditingActivityTitle] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const visibleActivities = useMemo(() => activityList.filter((item) => `${item.title} ${item.area} ${item.place}`.toLowerCase().includes(query.toLowerCase())), [activityList, query]);
  const go = (next: View) => { setView(next); setMobileMenu(false); };
  useEffect(() => {
    if (view !== "Registrar asistencia" || role === "Estudiante") return;
    let active = true;
    let stream: MediaStream | undefined;
    let scanTimer: ReturnType<typeof setTimeout> | undefined;
    setCameraState("starting");
    setCameraMessage("");
    setLocationMessage("Solicitando ubicación del dispositivo…");
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(
      ({ coords }) => { if (active) { setLocation({ lat: coords.latitude, lng: coords.longitude }); setLocationMessage("Ubicación del dispositivo capturada."); } },
      () => { if (active) setLocationMessage("No se obtuvo GPS. Se muestra la ubicación de la actividad para la demo."); },
      { enableHighAccuracy: true, timeout: 10000 },
    );
    else setLocationMessage("Este navegador no ofrece GPS. Se muestra la ubicación de la actividad para la demo.");
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraState("error");
      setCameraMessage("Este navegador no permite abrir la cámara. Usa “Simular lectura” para completar la demo.");
      return () => { active = false; };
    }
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false }).then((cameraStream) => {
      if (!active) { cameraStream.getTracks().forEach((track) => track.stop()); return; }
      stream = cameraStream;
      if (videoRef.current) videoRef.current.srcObject = cameraStream;
      setCameraState("ready");
      const BarcodeDetectorApi = (window as Window & { BarcodeDetector?: new (options?: { formats: string[] }) => { detect: (source: HTMLVideoElement) => Promise<Array<{ rawValue: string }>> } }).BarcodeDetector;
      if (!BarcodeDetectorApi) { setCameraMessage("Cámara activa. Usa “Simular lectura” para completar el flujo en esta demo."); return; }
      const detector = new BarcodeDetectorApi({ formats: ["qr_code"] });
      const scan = async () => {
        if (!active || !videoRef.current) return;
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes[0]?.rawValue) {
            if (codes[0].rawValue.includes("EST-00482")) { setAttendance(true); setCameraMessage("QR de Daniela Rojas leído correctamente."); }
            else setCameraMessage("QR leído. Este código no pertenece a la estudiante de demostración.");
          }
        } catch { /* El video todavía puede no tener fotogramas listos. */ }
        scanTimer = setTimeout(scan, 500);
      };
      scanTimer = setTimeout(scan, 500);
    }).catch(() => { if (active) { setCameraState("error"); setCameraMessage("No se pudo acceder a la cámara. Revisa el permiso del navegador o usa la lectura simulada."); } });
    return () => { active = false; if (scanTimer) clearTimeout(scanTimer); stream?.getTracks().forEach((track) => track.stop()); };
  }, [view, role]);
  const beginAttendance = (activity: typeof activityList[number]) => { setSelectedActivity(activity); setAttendance(false); go("Registrar asistencia"); };
  const saveActivity = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = newActivityTitle.trim();
    const place = newActivityPlace.trim();
    if (!title || !place) return;
    if (editingActivityTitle) {
      setActivityList((current) => current.map((item) => item.title === editingActivityTitle ? { ...item, title, place, hours: `${newActivityHours} h`, ...draftCoordinates } : item));
      if (selectedActivity.title === editingActivityTitle) setSelectedActivity((current) => ({ ...current, title, place, hours: `${newActivityHours} h`, ...draftCoordinates }));
      setActivityMessage(`“${title}” se actualizó.`);
    } else {
      setActivityList((current) => [...current, { title, area: "Comunidad · Servicio", date: "Fecha por coordinar", time: "Por definir", place, hours: `${newActivityHours} h`, icon: Activity, ...draftCoordinates }]);
      setActivityMessage(`“${title}” se agregó a las actividades.`);
    }
    setEditingActivityTitle(null);
    setNewActivityTitle(""); setNewActivityPlace(""); setNewActivityHours("2");
  };
  const startNewActivity = () => {
    setEditingActivityTitle(null); setNewActivityTitle(""); setNewActivityPlace(""); setNewActivityHours("2"); setActivityMessage("");
    setDraftCoordinates(location ?? { lat: -12.0464, lng: -77.0428 });
    setMapLocationMessage("Buscando tu ubicación actual…");
    setActivityDrawerOpen(true);
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(({ coords }) => { const current = { lat: coords.latitude, lng: coords.longitude }; setDraftCoordinates(current); setMapLocationMessage("El marcador comienza en tu ubicación actual. Pulsa el mapa para moverlo."); }, () => setMapLocationMessage("No se pudo obtener tu ubicación. Mueve el marcador desde el mapa."), { enableHighAccuracy: true, timeout: 10000 });
    else setMapLocationMessage("Este navegador no ofrece geolocalización. Mueve el marcador desde el mapa.");
  };
  const editActivity = (activity: typeof activityList[number]) => { setEditingActivityTitle(activity.title); setNewActivityTitle(activity.title); setNewActivityPlace(activity.place); setNewActivityHours(activity.hours.replace(" h", "")); setDraftCoordinates({ lat: activity.lat, lng: activity.lng }); setMapLocationMessage("Ajusta la ubicación de esta actividad en el mapa."); setActivityMessage(""); setActivityDrawerOpen(true); };
  const removeActivity = (title: string) => { setActivityList((current) => current.filter((item) => item.title !== title)); if (selectedActivity.title === title) setSelectedActivity(activityList.find((item) => item.title !== title) ?? activities[0]); };
  const title = view === "Mi progreso" ? "Mis horas de proyección social" : view === "Dashboard" ? "Dashboard y Reporte General de Alumnos" : view === "Reporte de alumnos" ? "Reporte de Horas por Estudiante y Ciclo" : view;
  const subtitle = view === "Mi progreso"
    ? "Revisa tus horas y encuentra tu próxima actividad."
    : view === "Dashboard"
    ? "Monitorea los indicadores institucionales, el avance por ciclo académico (2 por año) y el reporte detallado de todos los estudiantes."
    : view === "Reporte de alumnos"
    ? "Consulta las horas totales y el desglose semestral (Ciclo I y Ciclo II por año) de cada alumno registrado."
    : view === "Actividades"
    ? "Encuentra dónde compartir tus talentos."
    : view === "Mi QR"
    ? "Muestra tu código al asistente para registrar tu participación."
    : "Escanea el QR del estudiante para registrar su asistencia.";
  const profileName = role === "Administrador" ? "Coordinación PS" : "Daniela Rojas";
  const profileInitials = role === "Administrador" ? "AD" : "DR";

  return <div className="min-h-screen bg-background text-foreground">
    <aside className={`${mobileMenu ? "fixed" : "hidden"} inset-y-0 left-0 z-30 w-64 flex-col border-r bg-sidebar p-4 md:fixed md:flex`}>
      <div className="flex h-12 items-center gap-3 px-2 text-lg font-semibold"><HeartHandshake className="size-5 text-primary" /> Proyección Social</div>
      <p className="px-2 pb-3 pt-6 text-xs font-medium text-muted-foreground">UNIVERSIDAD PERUANA UNIÓN</p>
      <nav className="grid gap-1">{nav.filter((item) => item.roles.includes(role)).map(({ label, icon: Icon }) => <Button key={label} variant={view === label ? "secondary" : "ghost"} className="justify-start gap-3" onClick={() => go(label)}><Icon className="size-4" />{label}</Button>)}</nav>
      <div className="mt-auto"><Separator className="my-4" /><div className="flex items-center gap-3 px-2"><Avatar className="size-9"><AvatarFallback>{profileInitials}</AvatarFallback></Avatar><div className="min-w-0"><p className="text-sm font-medium">{profileName}</p><p className="text-xs text-muted-foreground">{role}</p></div><ChevronDown className="ml-auto size-4 text-muted-foreground" /></div></div>
    </aside>
    {mobileMenu && <button aria-label="Cerrar menú" className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={() => setMobileMenu(false)} />}
    <div className="md:pl-64">
      <header className="sticky top-0 z-10 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur md:px-6">
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú" onClick={() => setMobileMenu(true)}><Menu className="size-4" /></Button>
        <p className="text-sm text-muted-foreground">Portal <span className="px-2">/</span><span className="text-foreground">{role === "Administrador" ? "Administración" : "Mi espacio"}</span></p>
        <div className="ml-auto flex items-center gap-3"><label className="flex items-center gap-2 text-sm text-muted-foreground">Vista<select className="h-9 rounded-md border bg-background px-2 text-sm text-foreground" value={role} onChange={(e) => { const nextRole = e.target.value as Role; setRole(nextRole); setActivityDrawerOpen(false); go(nextRole === "Administrador" ? "Dashboard" : "Mi progreso"); }}><option>Estudiante</option><option>Asistente</option><option>Administrador</option></select></label><Button variant="ghost" size="icon" aria-label="Notificaciones"><Bell className="size-4" /></Button><Avatar className="size-8"><AvatarFallback>{profileInitials}</AvatarFallback></Avatar></div>
      </header>
      <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2 text-sm text-muted-foreground md:px-6"><Sparkles className="size-4" /><span>Vista de demostración. Los datos mostrados son de ejemplo y no se guardan.</span></div>
      <main className={`mx-auto w-full ${role === "Administrador" ? "max-w-7xl" : "max-w-6xl"} space-y-8 p-4 md:p-8`}>
        <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-sm text-muted-foreground">SÁBADO, 25 DE OCTUBRE DE 2026 · CICLO 2026-II</p><h1 className="text-3xl font-semibold tracking-tight md:text-4xl">{title}</h1><p className="mt-2 text-muted-foreground">{subtitle}</p></div><Badge variant="secondary">{role}</Badge></div>
        {role === "Administrador" && (view === "Dashboard" || view === "Reporte de alumnos") && (
          <AdminDashboardAndReport
            mode={view === "Reporte de alumnos" ? "report" : "dashboard"}
            onSwitchToReport={() => go("Reporte de alumnos")}
            onSwitchToDashboard={() => go("Dashboard")}
          />
        )}
        {role !== "Administrador" && view === "Mi progreso" && <section className="space-y-6"><Card><CardHeader><CardDescription className="flex items-center gap-2"><Clock3 className="size-4" /> HORAS DE PROYECCIÓN SOCIAL · CICLO 2026-II</CardDescription><CardTitle className="text-5xl">28.5 <span className="text-xl font-normal text-muted-foreground">horas</span></CardTitle></CardHeader><CardContent><div className="mb-2 flex justify-between text-sm"><span>Meta del ciclo</span><span>71%</span></div><Progress value={71} locale="es-PE" /><p className="mt-3 text-sm text-muted-foreground">+6.5 horas desde el último ciclo</p></CardContent></Card><Card><CardHeader><CardTitle>Asistencias recientes</CardTitle><CardDescription>Actividades que ya completaste</CardDescription></CardHeader><CardContent className="space-y-4">{history.map((name, i) => <div key={name} className="flex items-center gap-3"><div className="rounded-full bg-muted p-2"><Check className="size-4" /></div><div className="flex-1"><p className="text-sm font-medium">{name}</p><p className="text-xs text-muted-foreground">{["04 oct 2026 · Villa Esperanza", "27 sep 2026 · I. E. José Olaya", "13 sep 2026 · Comedor San José"][i]}</p></div><Badge variant="secondary">{["3.5 h", "2 h", "4 h"][i]}</Badge></div>)}</CardContent></Card></section>}
        {view === "Actividades" && <section className="space-y-4"><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-xl font-semibold">Actividades disponibles</h2><p className="text-sm text-muted-foreground">Cada actividad indica las horas que puedes obtener.</p></div><div className="flex w-full gap-2 sm:w-auto"><div className="relative min-w-0 flex-1 sm:w-64"><Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" /><Input className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar actividad" /></div>{role === "Administrador" && <Button onClick={startNewActivity}><Plus className="mr-2 size-4" />Agregar actividad</Button>}</div></div><div className="grid gap-4 md:grid-cols-3">{visibleActivities.map((activity) => { const { title: name, area, date, time, place, hours, icon: Icon } = activity; return <Card key={name}><CardHeader><div className="mb-2 flex items-center justify-between"><span className="rounded-md bg-muted p-2"><Icon className="size-5" /></span><div className="flex items-center gap-1"><Badge variant="outline">{hours}</Badge>{role === "Administrador" && <><Button variant="ghost" size="icon" aria-label={`Editar ${name}`} onClick={() => editActivity(activity)}><Pencil className="size-4" /></Button><Button variant="ghost" size="icon" aria-label={`Eliminar ${name}`} onClick={() => removeActivity(name)}><Trash2 className="size-4" /></Button></>}</div></div><CardTitle className="text-lg">{name}</CardTitle><CardDescription>{area}</CardDescription></CardHeader><CardContent className="space-y-2 text-sm text-muted-foreground"><p className="flex items-center gap-2"><MapPin className="size-4" />{place}</p><p className="flex items-center gap-2"><CalendarDays className="size-4" />{date} · {time}</p>{role !== "Estudiante" && <Button variant="link" className="h-auto p-0" onClick={() => beginAttendance(activity)}>Registrar asistencia <ArrowRight className="ml-1 size-4" /></Button>}</CardContent></Card>; })}</div>{visibleActivities.length === 0 && <Card><CardContent className="py-8 text-center text-sm text-muted-foreground">No encontramos actividades con ese nombre.</CardContent></Card>}</section>}
        {view === "Mi QR" && <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2"><Card><CardHeader className="text-center"><CardDescription>CÓDIGO DE ESTUDIANTE</CardDescription><CardTitle>Daniela Rojas</CardTitle><p className="text-sm text-muted-foreground">EST-00482 · Psicología</p></CardHeader><CardContent className="flex flex-col items-center gap-4"><div className="grid size-60 gap-px rounded-xl border bg-white p-3" style={{ gridTemplateColumns: "repeat(21, minmax(0, 1fr))" }} aria-label="Código gráfico de demostración EST-00482" role="img">{Array.from({ length: 441 }, (_, index) => { const x = index % 21; const y = Math.floor(index / 21); const finder = (fx: number, fy: number) => { const dx = x - fx; const dy = y - fy; return dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6 ? dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4) : null; }; const inFinder = finder(0, 0) ?? finder(14, 0) ?? finder(0, 14); const dark = inFinder ?? (((x * 17 + y * 31 + x * y * 7 + 19) % 11) < 5); return <span key={index} className={dark ? "rounded-[1px] bg-slate-900" : "bg-white"} />; })}</div><Badge variant="secondary"><QrCode className="mr-1 size-3" /> Código de demo · EST-00482</Badge><p className="text-center text-xs text-muted-foreground">Código visual de demostración. La lectura se simula desde el lector de asistencia.</p></CardContent></Card><Card><CardHeader><CardTitle>Cómo usar tu código</CardTitle><CardDescription>Tu código identifica tu asistencia a cada actividad.</CardDescription></CardHeader><CardContent className="space-y-4 text-sm"><p>1. Acércate al punto de encuentro de la actividad.</p><p>2. Abre “Registrar asistencia” en el teléfono del asistente.</p><p>3. El asistente escanea tu código y confirma tu presencia.</p><Button className="w-full" onClick={() => go("Actividades")}>Ver actividades disponibles <ArrowRight className="ml-2 size-4" /></Button></CardContent></Card></div>}
        <Sheet open={activityDrawerOpen && role === "Administrador"} onOpenChange={setActivityDrawerOpen}><SheetContent side="right" className="w-full overflow-y-auto sm:max-w-lg"><SheetHeader><SheetTitle>{editingActivityTitle ? "Editar actividad" : "Agregar actividad"}</SheetTitle><SheetDescription>{editingActivityTitle ? "Actualiza los datos y la ubicación en el mapa." : "Completa los datos y marca el punto de encuentro en el mapa."}</SheetDescription></SheetHeader><div className="px-4 pb-6"><form className="space-y-4" onSubmit={saveActivity}><label className="grid gap-1.5 text-sm font-medium">Nombre de la actividad<Input required value={newActivityTitle} onChange={(event) => setNewActivityTitle(event.target.value)} placeholder="Ej. Limpieza de parque" /></label><label className="grid gap-1.5 text-sm font-medium">Lugar<Input required value={newActivityPlace} onChange={(event) => setNewActivityPlace(event.target.value)} placeholder="Ej. Parque Los Olivos" /></label><label className="grid gap-1.5 text-sm font-medium">Horas de proyección social<input required min="0.5" max="24" step="0.5" type="number" className="h-9 rounded-md border bg-background px-3 text-sm font-normal" value={newActivityHours} onChange={(event) => setNewActivityHours(event.target.value)} /></label><div className="rounded-lg border p-3"><p className="mb-2 text-xs text-muted-foreground">{mapLocationMessage}</p><ActivityMapPicker value={draftCoordinates} onChange={setDraftCoordinates} /></div><Button type="submit">{editingActivityTitle ? "Guardar cambios" : "Agregar actividad"}</Button></form>{activityMessage && <p className="mt-4 rounded-md bg-emerald-50 p-3 text-sm text-emerald-900">{activityMessage}</p>}</div></SheetContent></Sheet>
        {view === "Registrar asistencia" && <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]"><Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck className="size-5" /> Registrar asistencia</CardTitle><CardDescription>La actividad se selecciona desde la que abriste. Puedes cambiarla aquí.</CardDescription></CardHeader><CardContent className="space-y-4"><label className="grid gap-2 text-sm font-medium">Actividad actual<select className="h-10 rounded-md border bg-background px-3 font-normal" value={selectedActivity.title} onChange={(event) => { setSelectedActivity(activityList.find((item) => item.title === event.target.value) ?? activityList[0]); setAttendance(false); }} aria-label="Seleccionar actividad actual">{activityList.map((item) => <option key={item.title} value={item.title}>{item.title}</option>)}</select></label><div className="flex items-start gap-3 rounded-lg bg-muted p-3 text-sm"><MapPin className="mt-0.5 size-4 shrink-0" /><div><p className="font-medium">{selectedActivity.place}</p><p className="text-muted-foreground">{selectedActivity.date} · {selectedActivity.time} · {selectedActivity.hours}</p></div></div><div className="relative aspect-video overflow-hidden rounded-lg bg-slate-950"><video ref={videoRef} autoPlay muted playsInline className="size-full object-cover" />{cameraState !== "ready" && <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950 text-center text-white"><div className="rounded-full bg-white/10 p-4">{cameraState === "starting" ? <LoaderCircle className="size-7 animate-spin" /> : <VideoOff className="size-7" />}</div><p className="text-sm">{cameraState === "starting" ? "Conectando con la cámara…" : "La cámara estará disponible al permitir el acceso"}</p></div>}<Badge className="absolute left-3 top-3 bg-black/60 text-white">{cameraState === "ready" ? <><Video className="mr-1 size-3" /> Cámara activa</> : "Lector QR"}</Badge></div><p className="text-sm text-muted-foreground">{cameraMessage || "Apunta la cámara al código del estudiante."}</p><div className="flex flex-wrap gap-2"><Button onClick={() => { setAttendance(true); setCameraMessage("Código de Daniela Rojas leído correctamente. Asistencia registrada."); }}><QrCode className="mr-2 size-4" /> Simular lectura QR</Button><Button variant="outline" onClick={() => { if (!navigator.geolocation) { setLocationMessage("Este navegador no ofrece GPS."); return; } setLocationMessage("Actualizando ubicación…"); navigator.geolocation.getCurrentPosition(({ coords }) => { setLocation({ lat: coords.latitude, lng: coords.longitude }); setLocationMessage("Ubicación del dispositivo capturada."); }, () => setLocationMessage("Permiso de ubicación denegado. Se usa la ubicación de la actividad."), { enableHighAccuracy: true, timeout: 10000 }); }}><MapPin className="mr-2 size-4" /> Actualizar ubicación</Button></div>{attendance && <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900"><Check className="size-5" /><div><p className="font-semibold">Asistencia registrada</p><p className="text-sm">Daniela Rojas · {selectedActivity.title} · {selectedActivity.hours}</p></div></div>}</CardContent></Card><div className="space-y-4"><Card><CardHeader><CardTitle className="flex items-center gap-2"><MapPin className="size-5" /> Ubicación de registro</CardTitle><CardDescription>{locationMessage}</CardDescription></CardHeader><CardContent><div className="overflow-hidden rounded-lg border"><iframe title={`Mapa OpenStreetMap: ${selectedActivity.place}`} className="h-72 w-full" loading="lazy" src={`https://www.openstreetmap.org/export/embed.html?bbox=${(location?.lng ?? selectedActivity.lng) - 0.015}%2C${(location?.lat ?? selectedActivity.lat) - 0.01}%2C${(location?.lng ?? selectedActivity.lng) + 0.015}%2C${(location?.lat ?? selectedActivity.lat) + 0.01}&layer=mapnik&marker=${location?.lat ?? selectedActivity.lat}%2C${location?.lng ?? selectedActivity.lng}`} /><a className="block p-2 text-xs text-primary underline" href={`https://www.openstreetmap.org/?mlat=${location?.lat ?? selectedActivity.lat}&mlon=${location?.lng ?? selectedActivity.lng}#map=16/${location?.lat ?? selectedActivity.lat}/${location?.lng ?? selectedActivity.lng}`} target="_blank" rel="noreferrer">Abrir mapa en OpenStreetMap</a></div></CardContent></Card><Card><CardHeader><CardTitle>Datos del registro</CardTitle><CardDescription>Información capturada en este dispositivo</CardDescription></CardHeader><CardContent className="space-y-3 text-sm"><div className="flex justify-between gap-4"><span className="text-muted-foreground">Estudiante</span><span className="font-medium">{attendance ? "Daniela Rojas" : "Esperando lectura"}</span></div><div className="flex justify-between gap-4"><span className="text-muted-foreground">Actividad</span><span className="text-right font-medium">{selectedActivity.title}</span></div><div className="flex justify-between gap-4"><span className="text-muted-foreground">Coordenadas</span><span className="font-mono text-xs">{(location?.lat ?? selectedActivity.lat).toFixed(4)}, {(location?.lng ?? selectedActivity.lng).toFixed(4)}</span></div><p className="border-t pt-3 text-xs text-muted-foreground">Demo: los datos se muestran en pantalla y no se guardan en el servidor.</p></CardContent></Card></div></section>}
        <footer className="flex flex-wrap justify-between gap-2 border-t pt-4 text-sm text-muted-foreground"><span>Universidad Peruana Unión · Proyección Social</span><span className="flex items-center gap-2">Servir también es aprender <HeartHandshake className="size-4" /></span></footer>
      </main>
    </div>
  </div>;
}
