"use client";

import { useState } from "react";
import type { MouseEvent } from "react";
import { Minus, Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const TILE_SIZE = 256;
const MAX_MERCATOR_LATITUDE = 85.0511;
const DEFAULT_ZOOM = 15;
const MIN_ZOOM = 3;
const MAX_ZOOM = 19;

type Coordinates = { lat: number; lng: number };

function toWorld({ lat, lng }: Coordinates, zoom: number) {
  const size = TILE_SIZE * 2 ** zoom;
  const safeLat = Math.max(-MAX_MERCATOR_LATITUDE, Math.min(MAX_MERCATOR_LATITUDE, lat));
  const sin = Math.sin((safeLat * Math.PI) / 180);
  return { x: ((lng + 180) / 360) * size, y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * size };
}

function fromWorld(x: number, y: number, zoom: number): Coordinates {
  const size = TILE_SIZE * 2 ** zoom;
  return {
    lng: (x / size) * 360 - 180,
    lat: (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / size))) * 180) / Math.PI,
  };
}

export function ActivityMapPicker({ value, onChange }: { value: Coordinates; onChange: (coordinates: Coordinates) => void }) {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const center = toWorld(value, zoom);
  const tileX = Math.floor(center.x / TILE_SIZE);
  const tileY = Math.floor(center.y / TILE_SIZE);
  const offsetX = center.x % TILE_SIZE;
  const offsetY = center.y % TILE_SIZE;

  const choosePoint = (event: MouseEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const next = fromWorld(center.x + event.clientX - bounds.left - bounds.width / 2, center.y + event.clientY - bounds.top - bounds.height / 2, zoom);
    onChange(next);
  };

  return <div className="space-y-2">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium">Ubicación en el mapa</p>
      <span className="font-mono text-xs text-muted-foreground">{value.lat.toFixed(5)}, {value.lng.toFixed(5)}</span>
    </div>
    <div className="relative h-64 cursor-crosshair touch-manipulation overflow-hidden rounded-lg border bg-muted" onClick={choosePoint} role="application" aria-label="Mapa OpenStreetMap. Pulsa para marcar la ubicación de la actividad.">
      {[-1, 0, 1].flatMap((dx) => [-1, 0, 1].map((dy) => {
        const x = tileX + dx;
        const y = tileY + dy;
        const tileCount = 2 ** zoom;
        if (y < 0 || y >= tileCount) return null;
        const wrappedX = ((x % tileCount) + tileCount) % tileCount;
        return <img key={`${zoom}-${x}-${y}`} alt="" draggable={false} className="pointer-events-none absolute size-64 max-w-none select-none" style={{ left: `calc(50% + ${(dx * TILE_SIZE) - offsetX}px)`, top: `calc(50% + ${(dy * TILE_SIZE) - offsetY}px)` }} src={`https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`} />;
      }))}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full text-primary drop-shadow-md">
        <MapPin className="size-9 fill-white" />
      </div>
      <div className="absolute right-2 top-2 grid overflow-hidden rounded-md border bg-background shadow-sm" onClick={(event) => event.stopPropagation()}>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Acercar mapa" onClick={() => setZoom((current) => Math.min(MAX_ZOOM, current + 1))}>
          <Plus className="size-4" />
        </Button>
        <Button type="button" variant="ghost" size="icon-sm" aria-label="Alejar mapa" onClick={() => setZoom((current) => Math.max(MIN_ZOOM, current - 1))}>
          <Minus className="size-4" />
        </Button>
      </div>
      <a className="absolute bottom-1 left-1 rounded bg-white/90 px-1 text-[10px] text-slate-700 underline" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer" onClick={(event) => event.stopPropagation()}>© OpenStreetMap contributors</a>
    </div>
    <p className="text-xs text-muted-foreground">Pulsa el mapa para colocar el marcador.</p>
  </div>;
}
