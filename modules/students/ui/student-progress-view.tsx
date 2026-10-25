import { Check, Clock3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const history = ["Huerto comunitario", "Acompañamiento escolar", "Despensa solidaria"];

export function StudentProgressView() {
  return <section className="space-y-6">
    <Card>
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <Clock3 className="size-4" /> HORAS DE PROYECCIÓN SOCIAL · CICLO 2026-II</CardDescription>
        <CardTitle className="text-5xl">28.5 <span className="text-xl font-normal text-muted-foreground">horas</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2 flex justify-between text-sm">
          <span>Meta del ciclo</span>
          <span>71%</span>
        </div>
        <Progress value={71} locale="es-PE" />
        <p className="mt-3 text-sm text-muted-foreground">+6.5 horas desde el último ciclo</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>Asistencias recientes</CardTitle>
        <CardDescription>Actividades que ya completaste</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">{history.map((name, i) => <div key={name} className="flex items-center gap-3">
        <div className="rounded-full bg-muted p-2">
          <Check className="size-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{["04 oct 2026 · Villa Esperanza", "27 sep 2026 · I. E. José Olaya", "13 sep 2026 · Comedor San José"][i]}</p>
        </div>
        <Badge variant="secondary">{["3.5 h", "2 h", "4 h"][i]}</Badge>
      </div>)}</CardContent>
    </Card>
  </section>;
}
