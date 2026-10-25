"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Clock3, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { LabeledSelect } from "@/components/ui/labeled-select";
import { ActivityScheduleFields } from "./activity-schedule-fields";
import { buildSchedule, creditSummary, DEFAULT_ACTIVITY_HOURS, initialSchedule, MAX_ACTIVITY_DAYS, scheduleLabel, TIME_PATTERN, type ActivitySchedule, type CreditRule } from "../scheduling";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ActivityMapPicker, DEFAULT_LOCATION_RADIUS_METERS } from "./activity-map-picker";
import { DEFAULT_COORDINATES, type SocialActivity } from "../model";

export type ActivityDraft = Pick<SocialActivity, "title" | "description" | "place" | "hours" | "lat" | "lng" | "radiusMeters" | "schedule" | "credit" | "date" | "time">;
const CREDIT_OPTIONS = [
  { value: "all", label: "Todas las jornadas" }, { value: "minimum", label: "Mínimo de jornadas" }, { value: "per-attendance", label: "Por asistencia" },
] as const;

export function ActivityEditorDrawer({ activity, onClose, onSave }: {
  activity: SocialActivity | null; onClose: () => void; onSave: (draft: ActivityDraft) => void;
}) {
  const [title, setTitle] = useState(activity?.title ?? "");
  const [description, setDescription] = useState(activity?.description ?? "");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  const [schedule, setSchedule] = useState<ActivitySchedule>(() => initialSchedule(activity?.schedule));
  const [rule, setRule] = useState<CreditRule>(activity?.credit?.rule ?? "per-attendance");
  const [minimumDays, setMinimumDays] = useState(String(activity?.credit?.minimumDays ?? 1));
  const [place, setPlace] = useState(activity?.place ?? "");
  const [hours, setHours] = useState(String(activity?.credit?.hours ?? activity?.hours.replace(" h", "") ?? DEFAULT_ACTIVITY_HOURS));
  const [coordinates, setCoordinates] = useState(activity ? { lat: activity.lat, lng: activity.lng } : DEFAULT_COORDINATES);
  const [error, setError] = useState("");
  const radiusMeters = activity?.radiusMeters ?? DEFAULT_LOCATION_RADIUS_METERS;
  const generated = buildSchedule(schedule);
  const numericHours = Number(hours.replace(",", "."));
  const minimumValid = Number.isInteger(Number(minimumDays)) && Number(minimumDays) > 0 && Number(minimumDays) <= (generated.unbounded ? MAX_ACTIVITY_DAYS : generated.dates.length);
  const previewValid = !generated.error && Number.isFinite(numericHours) && numericHours > 0 && Number.isFinite(numericHours * generated.dates.length) && (rule !== "minimum" || minimumValid) && !(rule === "all" && generated.unbounded);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!open) return;
    if (!title.trim() || !description.trim() || !place.trim()) {
      setError("Completa nombre, descripción y lugar."); return;
    }
    if (generated.error) { setError(generated.error); return; }
    if (!TIME_PATTERN.test(schedule.startTime) || !TIME_PATTERN.test(schedule.endTime) || schedule.endTime <= schedule.startTime) {
      setError("Revisa el horario: HH:mm, con fin posterior al inicio."); return;
    }
    if (rule === "all" && generated.unbounded) {
      setError("Para exigir todas las jornadas, define cuándo termina la actividad."); return;
    }
    if (rule === "minimum" && !minimumValid) {
      setError(generated.unbounded ? `El mínimo debe estar entre 1 y ${MAX_ACTIVITY_DAYS} jornadas.` : "El mínimo debe estar entre 1 y el total de jornadas."); return;
    }
    const totalHours = rule === "per-attendance" && !generated.unbounded ? numericHours * generated.dates.length : numericHours;
    if (!Number.isFinite(numericHours) || numericHours <= 0 || !Number.isFinite(totalHours)) {
      setError("Indica una cantidad positiva de horas."); return;
    }
    const savedSchedule = { ...schedule, dates: generated.dates };
    const credit = { rule, hours: numericHours, minimumDays: rule === "all" ? generated.dates.length : rule === "minimum" ? Number(minimumDays) : 1 };
    setError("");
    onSave({ title: title.trim(), description: description.trim(), place: place.trim(), hours: `${totalHours} h${generated.unbounded && rule === "per-attendance" ? "/asistencia" : ""}`, schedule: savedSchedule, credit, date: scheduleLabel(savedSchedule), time: `${schedule.startTime} – ${schedule.endTime}`, radiusMeters, ...coordinates });
    setOpen(false);
  }

  return <Drawer open={open} swipeDirection="right" onOpenChange={setOpen} onOpenChangeComplete={(isOpen) => { if (!isOpen) onClose(); }}>
    <DrawerContent className="data-[swipe-axis=x]:[--drawer-content-width:100%] data-[swipe-axis=x]:sm:[--drawer-content-width:32rem]">
      <DrawerHeader>
        <div className="flex items-center justify-between gap-3">
          <DrawerTitle>{activity ? "Editar actividad" : "Agregar actividad"}</DrawerTitle>
          <DrawerClose render={<Button variant="ghost" size="icon" aria-label="Cerrar formulario" />}><X /></DrawerClose>
        </div>
        <DrawerDescription>Datos de ejemplo · Guardado durante esta sesión.</DrawerDescription>
      </DrawerHeader>
      <form className="flex min-h-0 flex-1 flex-col" onSubmit={save} onChange={() => setError("")} noValidate>
        <div className="flex-1 overflow-y-auto p-4">
          <FieldGroup className="gap-5">
            <Field><FieldLabel htmlFor="activity-title">Nombre</FieldLabel><Input id="activity-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ej. Limpieza de parque" /></Field>
            <Field><FieldLabel htmlFor="activity-description">Descripción</FieldLabel><Textarea id="activity-description" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="¿Qué haremos en esta actividad?" rows={3} /></Field>
            <Field><FieldLabel htmlFor="activity-place">Lugar</FieldLabel><Input id="activity-place" value={place} onChange={(event) => setPlace(event.target.value)} placeholder="Ej. Parque Los Olivos" /></Field>
            <ActivityMapPicker value={coordinates} onChange={setCoordinates} radiusMeters={radiusMeters} />
            <ActivityScheduleFields value={schedule} onChange={(next) => { setSchedule(next); setError(""); }} />
            <FieldSet className="activity-form-section">
              <FieldLegend className="activity-section-title"><Clock3 aria-hidden="true" />Validación de horas</FieldLegend>
              <FieldGroup className="gap-4">
                <Field><FieldLabel>Asistencia</FieldLabel><LabeledSelect label="Asistencia" value={rule} options={CREDIT_OPTIONS} onValueChange={(next) => { setRule(next); setError(""); }} className="w-full" /></Field>
                <FieldGroup className="grid grid-cols-2 gap-3">
                  {rule === "minimum" && <Field><FieldLabel htmlFor="activity-minimum">Mínimo de días</FieldLabel><Input id="activity-minimum" inputMode="numeric" value={minimumDays} onChange={(event) => setMinimumDays(event.target.value)} /></Field>}
                  <Field><FieldLabel htmlFor="activity-hours">{rule === "per-attendance" ? "Horas por asistencia" : "Horas totales"}</FieldLabel><Input id="activity-hours" inputMode="decimal" value={hours} onChange={(event) => setHours(event.target.value)} /></Field>
                </FieldGroup>
                <p aria-live="polite" className="text-xs text-muted-foreground">{previewValid ? creditSummary({ rule, hours: numericHours, minimumDays: Number(minimumDays) }, generated.dates.length, generated.unbounded) : rule === "all" && generated.unbounded ? "Define un fin para exigir todas las jornadas." : "Completa la programación y las horas."}</p>
              </FieldGroup>
            </FieldSet>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          </FieldGroup>
        </div>
        <div className="flex justify-end gap-2 border-t p-4">
          <DrawerClose render={<Button variant="outline" />}>Cancelar</DrawerClose>
          <Button type="submit" disabled={!open}>{activity ? "Guardar cambios" : "Agregar actividad"}</Button>
        </div>
      </form>
    </DrawerContent>
  </Drawer>;
}
