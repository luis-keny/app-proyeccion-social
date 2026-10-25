"use client";

import { useRef, useState, type PointerEvent, type KeyboardEvent } from "react";
import { Minus, Plus, MapPin, LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";

const TILE_SIZE = 256;
const MAX_MERCATOR_LATITUDE = 85.0511;
const EARTH_CIRCUMFERENCE_METERS = 40_075_016.686;
const DEFAULT_ZOOM = 17;
const MIN_ZOOM = 3;
const MAX_ZOOM = 19;
const DRAG_THRESHOLD_PIXELS = 6;
const KEYBOARD_PAN_PIXELS = 40;
export const DEFAULT_LOCATION_RADIUS_METERS = 50;

type Coordinates = { lat: number; lng: number };
type Gesture = { pointerId: number; x: number; y: number; center: { x: number; y: number }; dragged: boolean };

function toWorld({ lat, lng }: Coordinates, zoom: number) {
  const size = TILE_SIZE * 2 ** zoom;
  const safeLat = Math.max(-MAX_MERCATOR_LATITUDE, Math.min(MAX_MERCATOR_LATITUDE, lat));
  const sin = Math.sin((safeLat * Math.PI) / 180);
  return { x: ((lng + 180) / 360) * size, y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * size };
}

function fromWorld(x: number, y: number, zoom: number): Coordinates {
  const size = TILE_SIZE * 2 ** zoom;
  return { lng: (((x / size) * 360) % 360 + 360) % 360 - 180, lat: (Math.atan(Math.sinh(Math.PI * (1 - (2 * Math.max(0, Math.min(size, y))) / size))) * 180) / Math.PI };
}

export function ActivityMapPicker({ value, onChange, radiusMeters = DEFAULT_LOCATION_RADIUS_METERS, readOnly = false }: { value: Coordinates; onChange?: (coordinates: Coordinates) => void; radiusMeters?: number; readOnly?: boolean }) {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [view, setView] = useState(value);
  const gesture = useRef<Gesture | null>(null);
  const center = toWorld(view, zoom);
  const point = toWorld(value, zoom);
  const worldSize = TILE_SIZE * 2 ** zoom;
  const markerX = ((point.x - center.x + worldSize / 2 + worldSize) % worldSize) - worldSize / 2;
  const markerY = point.y - center.y;
  const radiusPixels = radiusMeters / (EARTH_CIRCUMFERENCE_METERS * Math.cos(value.lat * Math.PI / 180) / worldSize);
  const tileX = Math.floor(center.x / TILE_SIZE);
  const tileY = Math.floor(center.y / TILE_SIZE);
  const offsetX = center.x % TILE_SIZE;
  const offsetY = center.y % TILE_SIZE;
  const horizontalTiles = readOnly ? [-2, -1, 0, 1, 2] : [-1, 0, 1];

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, center, dragged: false };
  }
  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = gesture.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (Math.hypot(dx, dy) > DRAG_THRESHOLD_PIXELS) drag.dragged = true;
    if (drag.dragged) setView(fromWorld(drag.center.x - dx, drag.center.y - dy, zoom));
  }
  function pointerUp(event: PointerEvent<HTMLDivElement>) {
    const drag = gesture.current;
    if (!drag || event.pointerId !== drag.pointerId) return;
    const moved = drag.dragged || Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > DRAG_THRESHOLD_PIXELS;
    if (!moved && !readOnly) {
      const bounds = event.currentTarget.getBoundingClientRect();
      onChange?.(fromWorld(drag.center.x + event.clientX - bounds.left - bounds.width / 2, drag.center.y + event.clientY - bounds.top - bounds.height / 2, zoom));
    }
    gesture.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }
  function keyboardPan(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    const offsets: Record<string, [number, number]> = { ArrowLeft: [-KEYBOARD_PAN_PIXELS, 0], ArrowRight: [KEYBOARD_PAN_PIXELS, 0], ArrowUp: [0, -KEYBOARD_PAN_PIXELS], ArrowDown: [0, KEYBOARD_PAN_PIXELS] };
    if (offsets[event.key]) {
      event.preventDefault();
      const [dx, dy] = offsets[event.key];
      setView(fromWorld(center.x + dx, center.y + dy, zoom));
    } else if (!readOnly && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      onChange?.(view);
    }
  }

  return <div className="flex flex-col gap-2">
    <div className="relative h-64 cursor-grab touch-none overflow-hidden rounded-lg border bg-muted outline-none select-none focus-visible:ring-2 focus-visible:ring-ring active:cursor-grabbing" onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={() => { gesture.current = null; }} onLostPointerCapture={() => { gesture.current = null; }} onKeyDown={keyboardPan} tabIndex={0} role="application" aria-label="Mapa de ubicación" aria-describedby="activity-map-help">
      {horizontalTiles.flatMap((dx) => [-1, 0, 1].map((dy) => {
        const x = tileX + dx;
        const y = tileY + dy;
        const tileCount = 2 ** zoom;
        if (y < 0 || y >= tileCount) return null;
        const wrappedX = ((x % tileCount) + tileCount) % tileCount;
        return <img key={`${zoom}-${x}-${y}`} alt="" draggable={false} className="pointer-events-none absolute size-64 max-w-none select-none" style={{ left: `calc(50% + ${(dx * TILE_SIZE) - offsetX}px)`, top: `calc(50% + ${(dy * TILE_SIZE) - offsetY}px)` }} src={`https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`} />;
      }))}
      <div data-slot="location-radius" className="pointer-events-none absolute rounded-full border-2 border-primary/60 bg-primary/15" style={{ left: `calc(50% + ${markerX}px)`, top: `calc(50% + ${markerY}px)`, width: radiusPixels * 2, height: radiusPixels * 2, transform: "translate(-50%, -50%)" }} />
      <div data-slot="location-marker" className="pointer-events-none absolute -translate-x-1/2 -translate-y-full text-primary drop-shadow-md" style={{ left: `calc(50% + ${markerX}px)`, top: `calc(50% + ${markerY}px)` }}><MapPin className="size-8 fill-background" /></div>
      <div className="absolute right-2 top-2 grid overflow-hidden rounded-md border bg-background shadow-sm" onPointerDown={(event) => event.stopPropagation()}>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Acercar mapa" onClick={() => setZoom((current) => Math.min(MAX_ZOOM, current + 1))}><Plus /></Button>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Alejar mapa" onClick={() => setZoom((current) => Math.max(MIN_ZOOM, current - 1))}><Minus /></Button>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Volver al punto seleccionado" onClick={() => setView(value)}><LocateFixed /></Button>
      </div>
      <a className="absolute bottom-1 left-1 rounded bg-background/90 px-1 text-[10px] text-foreground underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" onPointerDown={(event) => event.stopPropagation()}>© OpenStreetMap contributors</a>
    </div>
    <p id="activity-map-help" className="text-xs text-muted-foreground">{readOnly ? "Arrastra para explorar" : "Arrastra para explorar · Clic para ubicar"} · Radio {radiusMeters} m<span className="sr-only">{readOnly ? ". Con teclado: flechas para mover la vista." : ". Con teclado: flechas para mover y Enter para seleccionar el centro."}</span></p>
    <output className="sr-only" aria-live="polite">Ubicación: {value.lat.toFixed(5)}, {value.lng.toFixed(5)}. Radio: {radiusMeters} metros.</output>
  </div>;
}
