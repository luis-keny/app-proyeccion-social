"use client";

import { useState, type FormEvent } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ActivityMapPicker } from "./activity-map-picker";
import { DEFAULT_COORDINATES, type SocialActivity } from "../model";

export type ActivityDraft = Pick<SocialActivity, "title" | "place" | "hours" | "lat" | "lng">;

export function ActivityEditorDrawer({ activity, onClose, onSave }: {
  activity: SocialActivity | null;
  onClose: () => void;
  onSave: (draft: ActivityDraft) => void;
}) {
  const [title, setTitle] = useState(activity?.title ?? "");
  const [place, setPlace] = useState(activity?.place ?? "");
  const [hours, setHours] = useState(activity?.hours.replace(" h", "") ?? "2");
  const [coordinates, setCoordinates] = useState(activity ? { lat: activity.lat, lng: activity.lng } : DEFAULT_COORDINATES);
  const [error, setError] = useState("");

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const numericHours = Number(hours.replace(",", "."));
    if (!title.trim() || !place.trim() || !Number.isFinite(numericHours) || numericHours <= 0) {
      setError("Completa el nombre, lugar y una cantidad positiva de horas.");
      return;
    }
    onSave({ title: title.trim(), place: place.trim(), hours: `${numericHours} h`, ...coordinates });
    onClose();
  }

  return (
    <Drawer open swipeDirection="right" onOpenChange={(open) => { if (!open) onClose(); }}>
      <DrawerContent className="data-[swipe-axis=x]:[--drawer-content-width:100%] data-[swipe-axis=x]:sm:[--drawer-content-width:32rem]">
        <DrawerHeader>
          <div className="flex items-center justify-between gap-3">
            <DrawerTitle>{activity ? "Editar actividad" : "Agregar actividad"}</DrawerTitle>
            <DrawerClose render={<Button variant="ghost" size="icon" aria-label="Cerrar formulario" />}>
              <X />
            </DrawerClose>
          </div>
          <DrawerDescription>Completa los datos y marca el punto de encuentro. Los cambios se conservan durante esta sesión visual.</DrawerDescription>
        </DrawerHeader>
        <form className="flex min-h-0 flex-1 flex-col" onSubmit={save} noValidate>
          <div className="flex-1 overflow-y-auto p-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="activity-title">Nombre de la actividad</FieldLabel>
                <Input id="activity-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ej. Limpieza de parque" />
              </Field>
              <Field>
                <FieldLabel htmlFor="activity-place">Lugar</FieldLabel>
                <Input id="activity-place" value={place} onChange={(event) => setPlace(event.target.value)} placeholder="Ej. Parque Los Olivos" />
              </Field>
              <Field>
                <FieldLabel htmlFor="activity-hours">Horas de proyección social</FieldLabel>
                <Input id="activity-hours" inputMode="decimal" value={hours} onChange={(event) => setHours(event.target.value)} aria-describedby="activity-hours-help" />
                <p id="activity-hours-help" className="text-xs text-muted-foreground">Valor de ejemplo para revisar el flujo; las reglas de acreditación están pendientes.</p>
              </Field>
              <ActivityMapPicker value={coordinates} onChange={setCoordinates} />
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            </FieldGroup>
          </div>
          <div className="flex justify-end gap-2 border-t p-4">
            <DrawerClose render={<Button variant="outline" />}>Cancelar</DrawerClose>
            <Button type="submit">{activity ? "Guardar cambios" : "Agregar actividad"}</Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
}
