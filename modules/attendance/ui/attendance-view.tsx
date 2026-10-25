"use client";

import { useEffect, useRef, useState } from "react";
import { Check, LoaderCircle, MapPin, QrCode, ShieldCheck, Video, VideoOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { SocialActivity } from "@/modules/activities/model";
import { LabeledSelect } from "@/components/ui/labeled-select";

const LOCATION_TIMEOUT_MS = 10_000;
const QR_SCAN_INTERVAL_MS = 500;

export function AttendanceView({ activityList, selectedActivity, onSelectActivity }: { activityList: SocialActivity[]; selectedActivity: SocialActivity; onSelectActivity: (activity: SocialActivity) => void }) {
  const [cameraState, setCameraState] = useState<"idle" | "starting" | "ready" | "error">("idle");
  const [cameraMessage, setCameraMessage] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationMessage, setLocationMessage] = useState("Solicitando ubicación del dispositivo…");
  const [attendance, setAttendance] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    let active = true;
    let stream: MediaStream | undefined;
    let scanTimer: ReturnType<typeof setTimeout> | undefined;
    queueMicrotask(() => {
      if (!active) return;
      setCameraState("starting");
      setCameraMessage("");
      setLocationMessage("Solicitando ubicación del dispositivo…");
      if (navigator.geolocation) navigator.geolocation.getCurrentPosition(
        ({ coords }) => { if (active) { setLocation({ lat: coords.latitude, lng: coords.longitude }); setLocationMessage("Ubicación del dispositivo capturada."); } },
        () => { if (active) setLocationMessage("No se obtuvo GPS. Se muestra la ubicación de la actividad para la demo."); },
        { enableHighAccuracy: true, timeout: LOCATION_TIMEOUT_MS },
      );
      else setLocationMessage("Este navegador no ofrece GPS. Se muestra la ubicación de la actividad para la demo.");
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraState("error");
        setCameraMessage("Este navegador no permite abrir la cámara. Usa “Simular lectura” para completar la demo.");
        return;
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
          scanTimer = setTimeout(scan, QR_SCAN_INTERVAL_MS);
        };
        scanTimer = setTimeout(scan, QR_SCAN_INTERVAL_MS);
      }).catch(() => { if (active) { setCameraState("error"); setCameraMessage("No se pudo acceder a la cámara. Revisa el permiso del navegador o usa la lectura simulada."); } });
    });
    return () => { active = false; if (scanTimer) clearTimeout(scanTimer); stream?.getTracks().forEach((track) => track.stop()); };
  }, []);
  return <section className="grid gap-6 lg:grid-cols-[1.1fr_.9fr]">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="size-5" /> Registrar asistencia</CardTitle>
        <CardDescription>La actividad se selecciona desde la que abriste. Puedes cambiarla aquí.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="grid gap-2 text-sm font-medium">Actividad actual<LabeledSelect label="Seleccionar actividad actual" className="w-full" value={selectedActivity.id} options={activityList.map((item) => ({ value: item.id, label: item.title }))} onValueChange={(id) => { const activity = activityList.find((item) => item.id === id); if (activity) onSelectActivity(activity); setAttendance(false); }} />
        </label>
        <div className="flex items-start gap-3 rounded-lg bg-muted p-3 text-sm">
          <MapPin className="mt-0.5 size-4 shrink-0" />
          <div>
            <p className="font-medium">{selectedActivity.place}</p>
            <p className="text-muted-foreground">{selectedActivity.date} · {selectedActivity.time} · {selectedActivity.hours}</p>
          </div>
        </div>
        <div className="relative aspect-video overflow-hidden rounded-lg bg-slate-950">
          <video ref={videoRef} autoPlay muted playsInline className="size-full object-cover" />{cameraState !== "ready" && <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950 text-center text-white">
            <div className="rounded-full bg-white/10 p-4">{cameraState === "starting" ? <LoaderCircle className="size-7 animate-spin" /> : <VideoOff className="size-7" />}</div>
            <p className="text-sm">{cameraState === "starting" ? "Conectando con la cámara…" : "La cámara estará disponible al permitir el acceso"}</p>
          </div>}<Badge className="absolute left-3 top-3 bg-black/60 text-white">{cameraState === "ready" ? <>
            <Video className="mr-1 size-3" /> Cámara activa</> : "Lector QR"}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{cameraMessage || "Apunta la cámara al código del estudiante."}</p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => { setAttendance(true); setCameraMessage("Código de Daniela Rojas leído correctamente. Asistencia registrada."); }}>
            <QrCode className="mr-2 size-4" /> Simular lectura QR</Button>
          <Button variant="outline" onClick={() => { if (!navigator.geolocation) { setLocationMessage("Este navegador no ofrece GPS."); return; } setLocationMessage("Actualizando ubicación…"); navigator.geolocation.getCurrentPosition(({ coords }) => { setLocation({ lat: coords.latitude, lng: coords.longitude }); setLocationMessage("Ubicación del dispositivo capturada."); }, () => setLocationMessage("Permiso de ubicación denegado. Se usa la ubicación de la actividad."), { enableHighAccuracy: true, timeout: LOCATION_TIMEOUT_MS }); }}>
            <MapPin className="mr-2 size-4" /> Actualizar ubicación</Button>
        </div>{attendance && <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
          <Check className="size-5" />
          <div>
            <p className="font-semibold">Asistencia registrada</p>
            <p className="text-sm">Daniela Rojas · {selectedActivity.title} · {selectedActivity.hours}</p>
          </div>
        </div>}</CardContent>
    </Card>
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-5" /> Ubicación de registro</CardTitle>
          <CardDescription>{locationMessage}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border">
            <iframe title={`Mapa OpenStreetMap: ${selectedActivity.place}`} className="h-72 w-full" loading="lazy" src={`https://www.openstreetmap.org/export/embed.html?bbox=${(location?.lng ?? selectedActivity.lng) - 0.015}%2C${(location?.lat ?? selectedActivity.lat) - 0.01}%2C${(location?.lng ?? selectedActivity.lng) + 0.015}%2C${(location?.lat ?? selectedActivity.lat) + 0.01}&layer=mapnik&marker=${location?.lat ?? selectedActivity.lat}%2C${location?.lng ?? selectedActivity.lng}`} />
            <a className="block p-2 text-xs text-primary underline" href={`https://www.openstreetmap.org/?mlat=${location?.lat ?? selectedActivity.lat}&mlon=${location?.lng ?? selectedActivity.lng}#map=16/${location?.lat ?? selectedActivity.lat}/${location?.lng ?? selectedActivity.lng}`} target="_blank" rel="noreferrer">Abrir mapa en OpenStreetMap</a>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Datos del registro</CardTitle>
          <CardDescription>Información capturada en este dispositivo</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Estudiante</span>
            <span className="font-medium">{attendance ? "Daniela Rojas" : "Esperando lectura"}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Actividad</span>
            <span className="text-right font-medium">{selectedActivity.title}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Coordenadas</span>
            <span className="font-mono text-xs">{(location?.lat ?? selectedActivity.lat).toFixed(4)}, {(location?.lng ?? selectedActivity.lng).toFixed(4)}</span>
          </div>
          <p className="border-t pt-3 text-xs text-muted-foreground">Demo: los datos se muestran en pantalla y no se guardan en el servidor.</p>
        </CardContent>
      </Card>
    </div>
  </section>;
}
