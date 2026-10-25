"use client";

import { ArrowRight, QrCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function StudentQrView({ activitiesHref }: { activitiesHref: string }) {
  return <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-2">
    <Card>
      <CardHeader className="text-center">
        <CardDescription>CÓDIGO DE ESTUDIANTE</CardDescription>
        <CardTitle>Daniela Rojas</CardTitle>
        <p className="text-sm text-muted-foreground">EST-00482 · Psicología</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="grid size-60 gap-px rounded-xl border bg-white p-3" style={{ gridTemplateColumns: "repeat(21, minmax(0, 1fr))" }} aria-label="Código gráfico de demostración EST-00482" role="img">{Array.from({ length: 441 }, (_, index) => { const x = index % 21; const y = Math.floor(index / 21); const finder = (fx: number, fy: number) => { const dx = x - fx; const dy = y - fy; return dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6 ? dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4) : null; }; const inFinder = finder(0, 0) ?? finder(14, 0) ?? finder(0, 14); const dark = inFinder ?? (((x * 17 + y * 31 + x * y * 7 + 19) % 11) < 5); return <span key={index} className={dark ? "rounded-[1px] bg-slate-900" : "bg-white"} />; })}</div>
        <Badge variant="secondary">
          <QrCode className="mr-1 size-3" /> Código de demo · EST-00482</Badge>
        <p className="text-center text-xs text-muted-foreground">Código visual de demostración. La lectura se simula desde el lector de asistencia.</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Cómo usar tu código</CardTitle>
        <CardDescription>Tu código identifica tu asistencia a cada actividad.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <p>1. Acércate al punto de encuentro de la actividad.</p>
        <p>2. Abre “Registrar asistencia” en el teléfono del asistente.</p>
        <p>3. El asistente escanea tu código y confirma tu presencia.</p>
        <ButtonLink className="w-full" href={activitiesHref}>Ver actividades disponibles <ArrowRight className="ml-2 size-4" />
        </ButtonLink>
      </CardContent>
    </Card>
  </div>;
}
