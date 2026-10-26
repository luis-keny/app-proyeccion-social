"use client";

import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const PERCENTAGE_TOTAL = 100;
const SCHOOL_LABEL_LIMIT = 23;
const SCHOOL_ROW_HEIGHT = 48;
const MIN_SCHOOL_CHART_HEIGHT = 220;
const SCHOOL_AXIS_HEIGHT = 36;
const SCHOOL_AXIS_WIDTH = 150;
const formatHours = (value: number) => new Intl.NumberFormat("es-PE", { maximumFractionDigits: 2 }).format(value);

const statusConfig = {
  completed: { label: "Meta completa", color: "var(--chart-2)" },
  onTrack: { label: "Al día, sin completar", color: "var(--chart-3)" },
  observed: { label: "Observados", color: "var(--destructive)" },
} satisfies ChartConfig;

const schoolConfig = {
  onTrackPercent: { label: "Al día", color: "var(--chart-2)" },
  observedPercent: { label: "Observados", color: "var(--destructive)" },
} satisfies ChartConfig;

const participationConfig = {
  active: { label: "Con participación", color: "var(--chart-2)" },
  inactive: { label: "Sin participación", color: "var(--chart-4)" },
} satisfies ChartConfig;

export type SchoolOverview = { name: string; count: number; observed: number; rate: number; gap: number };

function ChartKey({ color, label, value }: { color: string; label: string; value?: string }) {
  return <div className="flex items-center justify-between gap-3 text-sm">
    <span className="flex items-center gap-2"><span aria-hidden="true" className="size-2.5 shrink-0 rounded-sm" style={{ background: color }} />{label}</span>
    {value && <span className="shrink-0 font-medium tabular-nums">{value}</span>}
  </div>;
}

export function AcademicStatusChart({ total, completed, observed }: { total: number; completed: number; observed: number }) {
  const data = [
    { status: "completed", value: completed, fill: "var(--color-completed)" },
    { status: "onTrack", value: total - completed - observed, fill: "var(--color-onTrack)" },
    { status: "observed", value: observed, fill: "var(--color-observed)" },
  ];
  return <Card className="h-full"><CardHeader><CardTitle>Situación de los estudiantes</CardTitle><CardDescription>Avance respecto a la meta individual. Cada estudiante pertenece a un solo grupo.</CardDescription></CardHeader>
    <CardContent className="flex flex-col gap-4">
      {total ? <div className="relative">
        <ChartContainer config={statusConfig} className="mx-auto h-60 w-full max-w-80 aspect-auto" aria-label="Distribución del avance académico; cifras detalladas debajo">
          <PieChart accessibilityLayer>
            <ChartTooltip content={<ChartTooltipContent nameKey="status" hideLabel formatter={(value, _name, item) => <span>{statusConfig[item.payload.status as keyof typeof statusConfig].label}: {Number(value)} estudiantes</span>} />} />
            <Pie data={data} dataKey="value" nameKey="status" innerRadius="66%" outerRadius="90%" stroke="var(--card)" strokeWidth={3} isAnimationActive={false}>
              {data.map((item) => <Cell key={item.status} fill={item.fill} />)}
            </Pie>
          </PieChart>
        </ChartContainer>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"><span className="text-4xl font-semibold tabular-nums">{total}</span><span className="text-xs text-muted-foreground">estudiantes</span></div>
      </div> : <p className="py-12 text-center text-sm text-muted-foreground">Agrega estudiantes para ver su distribución.</p>}
      <div className="flex flex-col gap-3">{data.map((item) => <ChartKey key={item.status} color={statusConfig[item.status as keyof typeof statusConfig].color} label={statusConfig[item.status as keyof typeof statusConfig].label} value={`${item.value} · ${total ? Math.round(item.value / total * PERCENTAGE_TOTAL) : 0}%`} />)}</div>
    </CardContent>
  </Card>;
}

export function SchoolProgressChart({ schools }: { schools: SchoolOverview[] }) {
  const data = schools.map((school) => ({ ...school, onTrackPercent: (1 - school.rate) * PERCENTAGE_TOTAL, observedPercent: school.rate * PERCENTAGE_TOTAL }));
  return <Card className="h-full"><CardHeader><CardTitle>Avance por escuela</CardTitle><CardDescription>Proporción de estudiantes al día y observados. Las escuelas con más retraso aparecen primero.</CardDescription></CardHeader>
    <CardContent className="flex flex-col gap-4">
      {data.length ? <>
        <ChartContainer config={schoolConfig} className="w-full aspect-auto" style={{ height: Math.max(MIN_SCHOOL_CHART_HEIGHT, data.length * SCHOOL_ROW_HEIGHT + SCHOOL_AXIS_HEIGHT) }} aria-label="Porcentaje de avance por escuela; tabla completa disponible para lectores de pantalla">
          <BarChart data={data} layout="vertical" accessibilityLayer margin={{ left: 0, right: 12, top: 8, bottom: 0 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" domain={[0, PERCENTAGE_TOTAL]} ticks={[0, 25, 50, 75, PERCENTAGE_TOTAL]} tickFormatter={(value) => `${value}%`} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" width={SCHOOL_AXIS_WIDTH} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} tickFormatter={(value: string) => value.length > SCHOOL_LABEL_LIMIT ? `${value.slice(0, SCHOOL_LABEL_LIMIT - 1)}…` : value} />
            <ChartTooltip cursor={false} content={({ active, payload }) => {
              const school = payload?.[0]?.payload as SchoolOverview | undefined;
              return active && school ? <div className="flex max-w-72 flex-col gap-1 rounded-lg border bg-popover p-3 text-xs text-popover-foreground shadow-md"><p className="font-medium">{school.name}</p><p>{school.count - school.observed} al día · {school.observed} observados</p><p>{school.count} estudiantes · {Math.round(school.rate * PERCENTAGE_TOTAL)}% observados</p><p>Brecha media entre observados: {formatHours(school.gap)} h</p></div> : null;
            }} />
            <Bar dataKey="onTrackPercent" stackId="progress" fill="var(--color-onTrackPercent)" barSize={22} isAnimationActive={false} />
            <Bar dataKey="observedPercent" stackId="progress" fill="var(--color-observedPercent)" barSize={22} isAnimationActive={false} />
          </BarChart>
        </ChartContainer>
        <div className="flex flex-wrap gap-x-6 gap-y-2"><ChartKey color={schoolConfig.onTrackPercent.color} label="Al día (incluye meta completa)" /><ChartKey color={schoolConfig.observedPercent.color} label="Observados" /></div>
        <div className="sr-only"><table><caption>Avance y brecha por escuela</caption><thead><tr><th>Escuela</th><th>Estudiantes</th><th>Al día</th><th>Observados</th><th>Porcentaje observado</th><th>Brecha media de observados en horas</th></tr></thead><tbody>{schools.map((school) => <tr key={school.name}><th scope="row">{school.name}</th><td>{school.count}</td><td>{school.count - school.observed}</td><td>{school.observed}</td><td>{Math.round(school.rate * PERCENTAGE_TOTAL)}%</td><td>{formatHours(school.gap)}</td></tr>)}</tbody></table></div>
      </> : <p className="py-12 text-center text-sm text-muted-foreground">Agrega estudiantes para consultar el avance por escuela.</p>}
      <p className="text-xs text-muted-foreground">Consulta cada barra para ver el nombre completo, las cantidades y la brecha de horas.</p>
    </CardContent>
  </Card>;
}

export function ParticipationChart({ total, active, period }: { total: number; active: number; period: string }) {
  const rate = total ? Math.round(active / total * PERCENTAGE_TOTAL) : 0;
  return <Card className="h-full"><CardHeader><CardTitle>Participación del periodo</CardTitle><CardDescription>{period} · Estudiantes únicos con al menos una asistencia validada de ejemplo.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4">
    <p className="flex items-baseline gap-2"><span className="text-4xl font-semibold tabular-nums">{total ? `${rate}%` : "—"}</span><span className="text-sm text-muted-foreground">participó</span></p>
    {total ? <ChartContainer config={participationConfig} className="h-20 w-full aspect-auto" aria-label={`${active} estudiantes con participación y ${total - active} sin participación en ${period}`}>
      <BarChart data={[{ name: period, active, inactive: total - active }]} layout="vertical" accessibilityLayer margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
        <XAxis type="number" domain={[0, total]} hide /><YAxis type="category" dataKey="name" hide />
        <ChartTooltip content={<ChartTooltipContent hideLabel formatter={(value, name) => <span>{participationConfig[name as keyof typeof participationConfig]?.label}: {Number(value)} estudiantes</span>} />} />
        <Bar dataKey="active" stackId="participation" fill="var(--color-active)" barSize={32} isAnimationActive={false} />
        <Bar dataKey="inactive" stackId="participation" fill="var(--color-inactive)" barSize={32} isAnimationActive={false} />
      </BarChart>
    </ChartContainer> : <p className="text-sm text-muted-foreground">Sin estudiantes registrados.</p>}
    <ChartKey color={participationConfig.active.color} label="Con participación" value={String(active)} />
    <ChartKey color={participationConfig.inactive.color} label="Sin participación" value={String(total - active)} />
    <p className="text-xs text-muted-foreground">Cada estudiante cuenta una vez, aunque tenga varias asistencias. Se excluyen beneficiarios externos.</p>
  </CardContent></Card>;
}
