"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Compass,
  FileText,
  Gauge,
  HeartHandshake,
  LayoutDashboard,
  MapPin,
  Menu,
  QrCode,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  UsersRound,
  X,
} from "lucide-react";

type Role = "Estudiante" | "Asistente" | "Administrador";
type View = "Inicio" | "Mi progreso" | "Actividades" | "Mi QR" | "Registrar asistencia" | "Estudiantes" | "Usuarios" | "Configuración";

const roleViews: Record<Role, View[]> = {
  Estudiante: ["Inicio", "Mi progreso", "Actividades", "Mi QR"],
  Asistente: ["Inicio", "Mi progreso", "Actividades", "Registrar asistencia", "Mi QR"],
  Administrador: ["Inicio", "Actividades", "Estudiantes", "Usuarios", "Registrar asistencia", "Configuración"],
};

const activityData = [
  { title: "Manos que alimentan", area: "Comunidad · Servicio", date: "Sáb, 18 oct", time: "8:00 a. m.", place: "Comedor San José", hours: "4 h", tone: "citrus", icon: HeartHandshake },
  { title: "Lectura para todos", area: "Educación · Voluntariado", date: "Mié, 22 oct", time: "3:30 p. m.", place: "Biblioteca Central", hours: "2 h", tone: "blue", icon: FileText },
  { title: "Jornada de salud", area: "Bienestar · Comunidad", date: "Sáb, 25 oct", time: "9:00 a. m.", place: "Clínica Universitaria", hours: "3 h", tone: "peach", icon: Activity },
];

const historyData = [
  { title: "Huerto comunitario", date: "04 oct 2026", place: "Villa Esperanza", hours: "3.5 h", state: "Acreditadas" },
  { title: "Acompañamiento escolar", date: "27 sep 2026", place: "I. E. José Olaya", hours: "2 h", state: "Acreditadas" },
  { title: "Despensa solidaria", date: "13 sep 2026", place: "Comedor San José", hours: "4 h", state: "Acreditadas" },
];

function BrandMark() {
  return <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>;
}

function NavIcon({ label }: { label: View }) {
  const icons: Record<View, typeof LayoutDashboard> = {
    Inicio: LayoutDashboard,
    "Mi progreso": Gauge,
    Actividades: Compass,
    "Mi QR": QrCode,
    "Registrar asistencia": ShieldCheck,
    Estudiantes: UsersRound,
    Usuarios: UsersRound,
    Configuración: Settings2,
  };
  const Icon = icons[label];
  return <Icon size={17} strokeWidth={1.8} aria-hidden="true" />;
}

function LocalQr() {
  return <div className="qr-art" aria-label="Representación visual de un código QR de demostración" role="img">
    {Array.from({ length: 81 }, (_, i) => <i key={i} className={`qr-pixel ${[0, 2, 6, 8, 18, 20, 24, 26, 54, 56, 60, 62, 4, 13, 22, 31, 40, 49, 58, 67, 76].includes(i) ? "qr-blank" : ""}`} />)}
  </div>;
}

function Sidebar({ role, view, setView, compact, onClose }: { role: Role; view: View; setView: (view: View) => void; compact: boolean; onClose: () => void }) {
  const items = roleViews[role];
  return <aside className={`sidebar ${compact ? "sidebar-compact" : ""}`} aria-label="Navegación principal">
    <div className="sidebar-brand"><BrandMark /><span>proyección<span className="brand-dot">.</span><small>social</small></span>
      {compact && <button type="button" className="icon-button sidebar-close" onClick={onClose} aria-label="Cerrar menú"><X size={19} /></button>}
    </div>
    <div className="school-label">UNIVERSIDAD PERUANA UNIÓN</div>
    <nav className="side-nav" aria-label="Secciones">
      {items.map((item, index) => <button type="button" key={item} onClick={() => { setView(item); onClose(); }} className={`nav-item ${view === item ? "nav-item-active" : ""}`} aria-current={view === item ? "page" : undefined}>
        <NavIcon label={item} /><span>{item}</span>{index === 0 && <span className="nav-count">{role === "Administrador" ? "04" : ""}</span>}
      </button>)}
    </nav>
    {role !== "Estudiante" && <div className="sidebar-section">
      <div className="sidebar-section-title">HERRAMIENTAS</div>
      <div className="sidebar-note"><span className="live-dot" /> Jornada activa <b>·</b> 18 oct</div>
    </div>}
    <div className="sidebar-bottom">
      <div className="help-card"><span className="help-icon"><CircleHelp size={16} /></span><div><b>¿Necesitas ayuda?</b><span>Estamos para acompañarte</span></div><ArrowRight size={15} /></div>
      <button className="profile-row" type="button" aria-label="Perfil de Daniela Rojas">
        <span className="avatar avatar-side">DR</span><span className="profile-copy"><b>Daniela Rojas</b><span>{role === "Estudiante" ? "Estudiante · 2024" : role}</span></span><ChevronDown size={16} />
      </button>
    </div>
  </aside>;
}

function DemoNotice() {
  return <div className="demo-notice"><Sparkles size={14} aria-hidden="true" /><span>Vista de demostración</span><span className="demo-separator">·</span><span>Los datos mostrados son de ejemplo y no se guardan.</span></div>;
}

function Topbar({ role, setRole, onMenu }: { role: Role; setRole: (role: Role) => void; onMenu: () => void }) {
  return <header className="topbar">
    <button className="icon-button mobile-menu" type="button" onClick={onMenu} aria-label="Abrir menú"><Menu size={20} /></button>
    <div className="breadcrumb"><span>Portal</span><span className="crumb-slash">/</span><b>Mi espacio</b></div>
    <div className="top-actions">
      <label className="role-picker"><span>Vista:</span><select value={role} onChange={(e) => setRole(e.target.value as Role)} aria-label="Cambiar vista de demostración"><option>Estudiante</option><option>Asistente</option><option>Administrador</option></select><ChevronDown size={14} aria-hidden="true" /></label>
      <button type="button" className="icon-button notification-button" aria-label="Notificaciones"><Bell size={18} /><span /></button>
      <span className="avatar avatar-top" aria-label="Daniela Rojas">DR</span>
    </div>
  </header>;
}

function DashboardHome({ role, go }: { role: Role; go: (view: View) => void }) {
  const isAdmin = role === "Administrador";
  const isHelper = role === "Asistente";
  return <>
    <section className="welcome-row">
      <div><p className="eyebrow"><span className="eyebrow-line" /> SÁBADO, 18 DE OCTUBRE DE 2026</p><h1>{isAdmin ? <>Un impacto que<br /><em>se multiplica.</em></> : <>Hola, Daniela<span className="period">.</span><br /><em>Qué bueno verte.</em></>}</h1>
        <p className="welcome-copy">{isAdmin ? "Cada hora compartida transforma una comunidad. Esto es lo que está pasando hoy." : isHelper ? "Hoy es una buena oportunidad para estar donde más se necesita." : "Tu compromiso deja huella. Mira todo lo que has logrado y lo que viene."}</p></div>
      <div className="welcome-meta"><span className="sun-mark"><span /><span /><span /><span /></span><span className="term-caption">CICLO ACADÉMICO<br /><b>2026 · II</b></span></div>
    </section>
    <section className={`impact-panel ${isAdmin ? "impact-admin" : ""}`} aria-label={isAdmin ? "Resumen de participación" : "Resumen de horas"}>
      <div className="impact-main"><div className="impact-label"><span className="impact-icon"><Clock3 size={16} /></span>{isAdmin ? "HORAS ACREDITADAS · CICLO 2026-II" : "TUS HORAS DE PROYECCIÓN SOCIAL"}</div><div className="impact-total">{isAdmin ? "1,284" : "28"}<span>{isAdmin ? "h" : ".5 h"}</span></div><div className="impact-foot"><span className="trend"><ArrowUpRight size={14} />{isAdmin ? "+12%" : "+6.5 h"}</span><span>{isAdmin ? "respecto al ciclo anterior" : "desde el último ciclo"}</span></div></div>
      <div className="impact-graphic" aria-hidden="true"><span className="orbit orbit-one" /><span className="orbit orbit-two" /><span className="orbit orbit-three" /><span className="orbit-core"><HeartHandshake size={38} strokeWidth={1.1} /></span><span className="orbit-label orbit-label-top">PROPÓSITO</span><span className="orbit-label orbit-label-bottom">COMUNIDAD</span></div>
      <div className="impact-side"><span className="side-stat-label">{isAdmin ? "ESTUDIANTES ACTIVOS" : "META DEL CICLO"}</span><b>{isAdmin ? "312" : "40 h"}</b><span className="mini-progress"><i style={{ width: isAdmin ? "79%" : "71%" }} /></span><span className="progress-caption">{isAdmin ? "79% de participación" : "71% completado"}</span><button className="text-link link-light" type="button" onClick={() => go(isAdmin ? "Estudiantes" : "Mi progreso")}>Ver mi progreso <ArrowRight size={14} /></button></div>
    </section>
    <div className="section-heading"><div><p className="eyebrow eyebrow-muted">LO QUE SIGUE</p><h2>{isAdmin ? "La comunidad en marcha" : "Encuentra dónde sumar"}</h2></div><button className="text-link" type="button" onClick={() => go("Actividades")}>Ver todas las actividades <ArrowRight size={15} /></button></div>
    <section className="activity-grid" aria-label="Próximas actividades">{activityData.map((activity, index) => {
      const Icon = activity.icon;
      return <article className={`activity-card activity-${activity.tone}`} key={activity.title}><div className="activity-card-top"><span className="activity-icon"><Icon size={19} strokeWidth={1.8} /></span><span className="activity-index">0{index + 1} / OCT</span></div><span className="activity-area">{activity.area}</span><h3>{activity.title}</h3><p className="activity-location"><MapPin size={14} />{activity.place}</p><div className="activity-card-bottom"><span><CalendarDays size={14} />{activity.date} · {activity.time}</span><b>{activity.hours}</b></div><button className="card-hit" type="button" onClick={() => go("Actividades")} aria-label={`Ver actividad ${activity.title}`} /></article>;
    })}</section>
    {isAdmin ? <AdminSummary /> : <RecentHistory go={go} />}
  </>;
}

function RecentHistory({ go }: { go: (view: View) => void }) {
  return <section className="history-block"><div className="section-heading compact-heading"><div><p className="eyebrow eyebrow-muted">TU HUELLA RECIENTE</p><h2>Horas que ya compartiste</h2></div><button className="text-link" type="button" onClick={() => go("Mi progreso")}>Ver historial <ArrowRight size={15} /></button></div><div className="history-card"><div className="cycle-heading"><span><span className="cycle-dot" /> CICLO 2026-II</span><b>9.5 h <small>en este ciclo</small></b></div>{historyData.map((item, index) => <div className="history-row" key={item.title}><span className="history-number">0{index + 1}</span><div className="history-detail"><b>{item.title}</b><span>{item.date} <i>·</i> {item.place}</span></div><span className="approved"><Check size={12} /> {item.state}</span><b className="history-hours">{item.hours}</b></div>)}</div></section>;
}

function AdminSummary() {
  return <section className="admin-quick"><div className="section-heading compact-heading"><div><p className="eyebrow eyebrow-muted">HOY EN LA UNIVERSIDAD</p><h2>Actividad de la comunidad</h2></div><span className="live-pill"><span className="live-dot" />ACTUALIZACIÓN LOCAL</span></div><div className="admin-metrics"><div><span>ACTIVIDADES PUBLICADAS</span><b>18</b><small><ArrowUpRight size={13} /> 3 nuevas esta semana</small></div><div><span>ASISTENCIAS HOY</span><b>46</b><small>En 4 jornadas activas</small></div><div><span>POR VALIDAR</span><b>12</b><small>Revisa los registros recientes</small></div></div></section>;
}

function ProgressView() {
  const cycles = [{ term: "2026 · II", hours: "9.5", percent: 24, status: "En curso" }, { term: "2026 · I", hours: "12", percent: 30, status: "Finalizado" }, { term: "2025 · II", hours: "7", percent: 18, status: "Finalizado" }];
  return <><PageIntro label="TU RECORRIDO" title="Mi progreso" text="Cada hora cuenta. Acá puedes seguir tu participación a lo largo de los ciclos." /><div className="progress-layout"><section className="progress-summary"><span>HORAS TOTALES ACUMULADAS</span><b>28.5 <small>h</small></b><p>De 40 horas recomendadas para tu formación.</p><div className="progress-track"><i style={{ width: "71%" }} /></div><small className="progress-percent">71% de tu meta personal</small></section><section className="cycle-list"><div className="subsection-title"><h2>Por ciclo académico</h2><span>Más reciente primero</span></div>{cycles.map((cycle) => <article className="cycle-card" key={cycle.term}><div className="cycle-card-title"><span className="cycle-icon"><CalendarDays size={17} /></span><div><b>Ciclo {cycle.term}</b><span>{cycle.status}</span></div><strong>{cycle.hours}<small> h</small></strong></div><div className="progress-track"><i style={{ width: `${cycle.percent}%` }} /></div><div className="cycle-foot"><span>{cycle.percent}% de la meta del ciclo</span><span>{cycle.term === "2026 · II" ? "3 actividades" : `${cycle.term === "2026 · I" ? "4" : "2"} actividades`}</span></div></article>)}</section></div><section className="history-block progress-history"><div className="subsection-title"><h2>Historial de asistencias</h2><button className="filter-button" type="button"><CalendarDays size={14} /> Todos los ciclos <ChevronDown size={14} /></button></div><div className="history-card">{historyData.map((item, index) => <div className="history-row" key={item.title}><span className="history-number">0{index + 1}</span><div className="history-detail"><b>{item.title}</b><span>{item.date} <i>·</i> {item.place}</span></div><span className="approved"><Check size={12} /> {item.state}</span><b className="history-hours">{item.hours}</b></div>)}</div></section><p className="demo-footnote"><Sparkles size={14} /> Datos de demostración local · Los registros no se guardan.</p></>;
}

function ActivitiesView() {
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => activityData.filter((item) => `${item.title} ${item.area} ${item.place}`.toLowerCase().includes(search.toLowerCase()) && (filter === "Todas" || item.area.includes(filter))), [filter, search]);
  return <><PageIntro label="UNA OPORTUNIDAD PARA SERVIR" title="Actividades" text="Explora las jornadas abiertas y encuentra una forma de compartir tus talentos." /><div className="filter-bar"><label className="search-box"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar actividad" aria-label="Buscar actividad" /><kbd>⌘ K</kbd></label><div className="filter-tabs" aria-label="Filtrar actividades">{["Todas", "Comunidad", "Educación", "Bienestar"].map((item) => <button type="button" key={item} onClick={() => setFilter(item)} aria-pressed={filter === item} className={filter === item ? "filter-active" : ""}>{item}</button>)}</div></div><div className="activity-list">{filtered.map((item) => <article className="activity-list-card" key={item.title}><span className={`list-icon activity-${item.tone}`}><item.icon size={19} /></span><div className="activity-list-copy"><span>{item.area}</span><b>{item.title}</b><small><MapPin size={13} /> {item.place}</small></div><div className="activity-date"><b>{item.date}</b><span>{item.time}</span></div><div className="activity-credit"><b>{item.hours}</b><span>por jornada</span></div><button type="button" className="outline-action">Conocer <ArrowRight size={14} /></button></article>)}{filtered.length === 0 && <div className="empty-state">No encontramos actividades con ese nombre. Prueba con otra búsqueda.</div>}</div><p className="demo-footnote"><Sparkles size={14} /> Actividades de demostración local · No existe inscripción ni reserva de cupo.</p></>;
}

function QrView() {
  return <><PageIntro label="TU IDENTIFICACIÓN" title="Mi código QR" text="Presenta este código a un asistente o administrador para registrar tu participación en una jornada." /><div className="qr-layout"><section className="qr-card"><div className="qr-card-head"><span>UNIVERSIDAD PERUANA UNIÓN</span><BrandMark /></div><div className="qr-person"><span className="avatar avatar-large">DR</span><div><span>ESTUDIANTE</span><b>Daniela Rojas</b><small>Psicología · 2024</small></div></div><div className="qr-code-wrap"><LocalQr /></div><p>Acerca el código al lector de asistencia</p><div className="qr-card-foot"><span>IDENTIFICACIÓN DE DEMOSTRACIÓN</span><b>EST · 00482</b></div></section><aside className="qr-info"><span className="qr-info-icon"><ShieldCheck size={20} /></span><h2>Simple, seguro y personal.</h2><p>Tu código ayuda al equipo de asistencia a identificarte. Antes de registrar una participación, siempre se confirma tu nombre.</p><div className="qr-step"><span>01</span><p>Presenta tu código QR al equipo de asistencia.</p></div><div className="qr-step"><span>02</span><p>Confirma que tus datos sean correctos.</p></div><div className="qr-step"><span>03</span><p>Tu participación quedará registrada.</p></div><span className="demo-footnote"><Sparkles size={14} /> Este QR es ilustrativo y no identifica a una cuenta real.</span></aside></div></>;
}

function AttendanceView() {
  const [confirmed, setConfirmed] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [activity, setActivity] = useState(activityData[0].title);
  return <><PageIntro label="CONTROL DE JORNADA" title="Registrar asistencia" text="Selecciona una actividad, identifica a la persona y confirma sus datos antes de registrar su participación." /><div className="attendance-layout"><section className="attendance-form"><div className="form-step"><span>01</span><div><h2>Selecciona la actividad</h2><p>Solo se muestran jornadas próximas o en curso.</p></div></div><label className="field-label" htmlFor="activity-select">Actividad</label><select className="demo-select" id="activity-select" value={activity} onChange={(e) => { setActivity(e.target.value); setRecorded(false); }}>{activityData.map((item) => <option key={item.title}>{item.title}</option>)}</select><div className="selected-activity"><CalendarDays size={16} /><span>{activityData.find((item) => item.title === activity)?.date} · {activityData.find((item) => item.title === activity)?.time}</span><MapPin size={15} /><span>{activityData.find((item) => item.title === activity)?.place}</span></div><div className="form-step step-next"><span>02</span><div><h2>Identifica al estudiante</h2><p>Escanea su QR o busca el código institucional.</p></div></div><button className="scan-button" type="button" onClick={() => { setConfirmed(true); setRecorded(false); }}><QrCode size={18} /> Escanear código QR</button><label className="field-label" htmlFor="student-code">O ingresa el código de estudiante</label><div className="code-entry"><input id="student-code" placeholder="Ej. EST-00482" /><button type="button" onClick={() => { setConfirmed(true); setRecorded(false); }}>Buscar</button></div></section><section className={`identity-card ${confirmed ? "identity-confirmed" : ""}`} aria-live="polite"><div className="identity-head"><span className="status-chip"><span className="live-dot" />{recorded ? "DEMO COMPLETADA" : confirmed ? "IDENTIDAD ENCONTRADA" : "VISTA PREVIA"}</span><span className="identity-step">PASO 03</span></div><span className="avatar avatar-large">DR</span><span className="identity-label">ESTUDIANTE</span><h2>{recorded ? "Asistencia simulada" : confirmed ? "Confirma la identidad" : "Aún no hay una búsqueda"}</h2><p>{recorded ? "La vista muestra una confirmación local; el registro no se guardó." : confirmed ? "Verifica que la persona presente coincida con estos datos antes de registrar." : "Busca un código o escanea el QR para mostrar los datos de la persona."}</p>{confirmed && !recorded && <><div className="identity-details"><span>Nombre<b>Daniela Rojas</b></span><span>Código<b>EST · 00482</b></span><span>Programa<b>Psicología · 2024</b></span></div><button className="confirm-button" type="button" onClick={() => setRecorded(true)}><Check size={16} /> Confirmar en esta demo</button></>}<small className="identity-demo"><Sparkles size={13} /> La confirmación solo cambia esta vista demo; no registra ni guarda asistencia.</small></section></div></>;
}

function AdminStudents() {
  const rows = [{ initials: "DR", name: "Daniela Rojas", major: "Psicología", hours: "28.5 h", trend: "+6.5 h" }, { initials: "JM", name: "Joaquín Mendoza", major: "Ingeniería Ambiental", hours: "24 h", trend: "+4 h" }, { initials: "LM", name: "Lucía Morales", major: "Educación", hours: "32 h", trend: "+8 h" }, { initials: "AC", name: "Andrés Castillo", major: "Enfermería", hours: "18.5 h", trend: "+2.5 h" }];
  return <><PageIntro label="FORMACIÓN CON PROPÓSITO" title="Estudiantes" text="Acompaña el avance de horas y participación de la comunidad universitaria." /><div className="admin-stats"><div><span>ESTUDIANTES ACTIVOS</span><b>312</b><small>En este ciclo académico</small></div><div><span>HORAS PROMEDIO</span><b>24.8 h</b><small>Por estudiante</small></div><div><span>EN META</span><b>68%</b><small>213 estudiantes</small></div></div><div className="table-toolbar"><label className="search-box"><Search size={16} /><input placeholder="Buscar estudiante" aria-label="Buscar estudiante" /></label><button className="filter-button" type="button">Ciclo 2026-II <ChevronDown size={14} /></button></div><div className="students-table-wrap"><table className="students-table"><thead><tr><th>ESTUDIANTE</th><th>PROGRAMA</th><th>HORAS TOTALES</th><th>ESTE CICLO</th><th /></tr></thead><tbody>{rows.map((row) => <tr key={row.name}><td><span className="student-name"><span className="avatar table-avatar">{row.initials}</span><b>{row.name}</b></span></td><td>{row.major}</td><td><b>{row.hours}</b></td><td><span className="trend"><ArrowUpRight size={13} />{row.trend}</span></td><td><button className="row-more" type="button" aria-label={`Ver detalle de ${row.name}`}><ArrowRight size={16} /></button></td></tr>)}</tbody></table></div><p className="demo-footnote"><Sparkles size={14} /> Registros de ejemplo para la vista de demostración.</p></>;
}

function AdminView({ view }: { view: View }) {
  const title = view === "Usuarios" ? "Usuarios y roles" : view === "Configuración" ? "Configuración" : "Actividades";
  const text = view === "Usuarios" ? "Administra el acceso de las personas que acompañan las jornadas." : view === "Configuración" ? "Preferencias generales del espacio de proyección social." : "Organiza oportunidades de servicio que conectan a la universidad con su comunidad.";
  return <><PageIntro label="GESTIÓN INSTITUCIONAL" title={title} text={text} /><div className="admin-view-tools"><label className="search-box"><Search size={16} /><input placeholder={view === "Actividades" ? "Buscar actividad" : "Buscar por nombre"} /></label><button type="button" className="primary-action">+ {view === "Actividades" ? "Nueva actividad" : "Invitar usuario"}</button></div><div className="admin-records">{activityData.map((activity, index) => <article key={activity.title}><span className={`record-icon activity-${activity.tone}`}><activity.icon size={18} /></span><div><span>{view === "Usuarios" ? (index === 0 ? "ADMINISTRADORA" : "ASISTENTE") : activity.area}</span><b>{view === "Usuarios" ? ["María Fernanda Paredes", "Carlos Huamán", "Andrea Salas"][index] : activity.title}</b><small>{view === "Usuarios" ? `usuario${index + 1}@upeu.edu.pe` : `${activity.date} · ${activity.place}`}</small></div><span className="status-label">{view === "Actividades" ? (index === 0 ? "En curso" : "Publicada") : "Activo"}</span><button type="button" className="row-more" aria-label={`Abrir ${view === "Usuarios" ? "usuario" : "actividad"}`}><ArrowRight size={16} /></button></article>)}</div><p className="demo-footnote"><Sparkles size={14} /> Datos de ejemplo · La gestión no persiste cambios.</p></>;
}

function PageIntro({ label, title, text }: { label: string; title: string; text: string }) {
  return <section className="page-intro"><p className="eyebrow"><span className="eyebrow-line" />{label}</p><h1>{title}<span className="period">.</span></h1><p>{text}</p></section>;
}

export default function SocialProjectionDashboard() {
  const [role, setRole] = useState<Role>("Estudiante");
  const [view, setView] = useState<View>("Inicio");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = (nextView: View) => setView(nextView);
  const changeRole = (nextRole: Role) => {
    setRole(nextRole);
    setView("Inicio");
  };

  return <main className="app-shell">
    <Sidebar role={role} view={view} setView={navigate} compact={menuOpen} onClose={() => setMenuOpen(false)} />
    {menuOpen && <button type="button" aria-label="Cerrar menú" className="sidebar-backdrop" onClick={() => setMenuOpen(false)} />}
    <div className="dashboard-area"><Topbar role={role} setRole={changeRole} onMenu={() => setMenuOpen(true)} /><DemoNotice /><div className="content-wrap">
      {view === "Inicio" && <DashboardHome role={role} go={navigate} />}
      {view === "Mi progreso" && <ProgressView />}
      {view === "Actividades" && <ActivitiesView />}
      {view === "Mi QR" && <QrView />}
      {view === "Registrar asistencia" && <AttendanceView />}
      {view === "Estudiantes" && <AdminStudents />}
      {(view === "Usuarios" || view === "Configuración") && <AdminView view={view} />}
    </div><footer className="page-footer"><span>Universidad Peruana Unión <i>·</i> Proyección Social</span><span>Servir también es aprender <HeartHandshake size={14} /></span></footer></div>
  </main>;
}
