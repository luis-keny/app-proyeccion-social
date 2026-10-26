"use client";

import { useRef, useState, type FormEvent } from "react";
import { Download, FileSpreadsheet, Settings2, Upload, UserPlus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LabeledSelect } from "@/components/ui/labeled-select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ADMISSION_YEAR_DIGITS, DEFAULT_CAREER_CYCLES, EMPTY_PARTICIPANT, reviewParticipants, type ParticipantInput } from "../participants";
import { MAX_IMPORT_ROWS, readParticipantWorkbook } from "../workbook-import";
import { ReportDrawer } from "./report-drawer";
import { useReports } from "./reports-provider";

function FormFooter({ close, label, disabled = false }: { close: () => void; label: string; disabled?: boolean }) {
  return <div className="flex shrink-0 justify-end gap-2 border-t p-4">
    <Button type="button" variant="outline" onClick={close}>Cancelar</Button>
    <Button type="submit" disabled={disabled}>{label}</Button>
  </div>;
}

function GoalForm({ close, onSaved }: { close: () => void; onSaved: (message: string) => void }) {
  const { goalRules, saveGoalRule } = useReports();
  const [year, setYear] = useState(""), [hours, setHours] = useState(""), [error, setError] = useState("");
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!new RegExp(`^\\d{${ADMISSION_YEAR_DIGITS}}$`).test(year) || Number(year) === 0 || !Number.isFinite(Number(hours)) || Number(hours) <= 0) {
      setError("Indica un año de cuatro dígitos y una meta de horas positiva."); return;
    }
    saveGoalRule({ year: Number(year), hours: Number(hours) });
    onSaved(`Meta de ${hours} h vigente desde el ingreso ${year} hasta la siguiente regla. Las metas ya asignadas se conservan.`);
    close();
  }
  return <form className="flex min-h-0 flex-1 flex-col" noValidate onSubmit={save}>
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
      <Alert><AlertTitle>Una meta continúa hasta que definas otra</AlertTitle><AlertDescription>El año indica desde qué ingreso se aplica. No necesitas configurar cada año. Agregar o editar una regla conserva las metas de estudiantes ya registrados.</AlertDescription></Alert>
      <Table><TableHeader><TableRow><TableHead>Ingresos cubiertos</TableHead><TableHead>Meta total</TableHead><TableHead><span className="sr-only">Acciones</span></TableHead></TableRow></TableHeader>
        <TableBody>{goalRules.map((rule, index) => <TableRow key={rule.year}><TableCell>{goalRules[index + 1] ? `${rule.year}–${goalRules[index + 1].year - 1}` : `${rule.year} en adelante`}</TableCell><TableCell>{rule.hours} h</TableCell><TableCell className="text-right"><Button variant="ghost" size="sm" type="button" onClick={() => { setYear(String(rule.year)); setHours(String(rule.hours)); setError(""); }}>Editar desde {rule.year}</Button></TableCell></TableRow>)}</TableBody>
      </Table>
      <FieldGroup>
        <Field><FieldLabel htmlFor="goal-year">Vigente desde el año de ingreso</FieldLabel><Input id="goal-year" inputMode="numeric" value={year} onChange={(event) => setYear(event.target.value)} placeholder="2026" /><FieldDescription>Se aplica desde este ingreso hasta el anterior a la siguiente regla.</FieldDescription></Field>
        <Field><FieldLabel htmlFor="goal-hours">Horas totales requeridas</FieldLabel><Input id="goal-hours" inputMode="decimal" value={hours} onChange={(event) => setHours(event.target.value.replace(",", "."))} placeholder="120" /></Field>
      </FieldGroup>
      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
    </div>
    <FormFooter close={close} label="Guardar meta" />
  </form>;
}

const FIELD_LABELS = {
  nombre: "Nombre completo", dni: "DNI", codigo: "Código universitario", escuela: "Escuela profesional",
  anio_ingreso: "Año de ingreso", ciclo_actual: "Ciclo actual", ciclos_carrera: "Ciclos de la carrera",
} as const;

function ParticipantForm({ close, onSaved }: { close: () => void; onSaved: (message: string) => void }) {
  const { participants, goalRules, addParticipants } = useReports();
  const [input, setInput] = useState<ParticipantInput>({ ...EMPTY_PARTICIPANT });
  const [submitted, setSubmitted] = useState(false), [error, setError] = useState("");
  const review = reviewParticipants([input], participants, goalRules)[0];
  const student = input.tipo === "estudiante";
  const fields = student ? Object.keys(FIELD_LABELS) as (keyof typeof FIELD_LABELS)[] : ["nombre", "dni"] as const;
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setSubmitted(true);
    if (review.issues.length) return;
    const message = addParticipants([input]);
    if (message) { setError(message); return; }
    setSubmitted(false);
    onSaved(`${input.nombre.trim()} se agregó al reporte con 0 horas. No se acreditan horas desde este formulario.`);
    close();
  }
  return <form className="flex min-h-0 flex-1 flex-col" noValidate onSubmit={save}>
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
      <FieldGroup>
        <Field><FieldLabel>Tipo de participante</FieldLabel><LabeledSelect label="Tipo de participante" value={input.tipo} options={[{ value: "estudiante", label: "Estudiante" }, { value: "beneficiario", label: "Beneficiario externo" }]} onValueChange={(tipo) => {
          setSubmitted(false); setError("");
          setInput((current) => ({ ...EMPTY_PARTICIPANT, nombre: current.nombre, dni: current.dni, tipo, ciclos_carrera: tipo === "estudiante" ? String(DEFAULT_CAREER_CYCLES) : "" }));
        }} /></Field>
        {fields.map((field) => {
          const issue = submitted ? review.issues.find((issue) => issue.field === field) : undefined;
          return <Field key={field} data-invalid={Boolean(issue)}>
            <FieldLabel htmlFor={`person-${field}`}>{FIELD_LABELS[field]}</FieldLabel>
            <Input id={`person-${field}`} value={input[field]} aria-invalid={Boolean(issue)} aria-describedby={issue ? `error-${field}` : undefined} inputMode={["dni", "anio_ingreso", "ciclo_actual", "ciclos_carrera"].includes(field) ? "numeric" : "text"} onChange={(event) => setInput((current) => ({ ...current, [field]: event.target.value }))} />
            {issue && <FieldDescription id={`error-${field}`}>{issue.message}</FieldDescription>}
          </Field>;
        })}
      </FieldGroup>
      {student && <Alert><AlertTitle>Meta que se asignará: {review.goalHours === null ? "sin configurar" : `${review.goalHours} h`}</AlertTitle><AlertDescription>Usa la última regla vigente para el año de ingreso. La meta asignada se conserva aunque cambien las reglas. Si no aparece, configura una vigente desde ese año o uno anterior.</AlertDescription></Alert>}
      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
    </div>
    <FormFooter close={close} label="Agregar participante" />
  </form>;
}

function ImportForm({ close, onSaved }: { close: () => void; onSaved: (message: string) => void }) {
  const { participants, goalRules, addParticipants } = useReports();
  const fileInput = useRef<HTMLInputElement>(null);
  const request = useRef(0);
  const [rows, setRows] = useState<{ input: ParticipantInput; row: number }[]>([]);
  const [filename, setFilename] = useState(""), [error, setError] = useState(""), [loading, setLoading] = useState(false);
  const reviews = reviewParticipants(rows.map((row) => row.input), participants, goalRules);
  const invalid = reviews.filter((review) => review.issues.length).length;
  async function read(file: File | undefined) {
    const token = ++request.current;
    setRows([]); setError(""); setFilename(file?.name ?? "");
    if (!file) { setLoading(false); return; }
    setLoading(true);
    try {
      const data = await readParticipantWorkbook(file);
      if (request.current === token) setRows(data);
    } catch (cause) {
      if (request.current === token) setError(cause instanceof Error ? cause.message : "No se pudo leer el archivo.");
    } finally { if (request.current === token) setLoading(false); }
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loading || !rows.length || invalid) return;
    const message = addParticipants(rows.map((row) => row.input));
    if (message) { setError(message); return; }
    onSaved(`Se agregaron ${rows.length} participantes con 0 horas. Los registros existentes se conservaron.`);
    setRows([]);
    close();
  }
  return <form className="flex min-h-0 flex-1 flex-col" noValidate onSubmit={save}>
    <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-4">
      <Alert><FileSpreadsheet /><AlertTitle>Agrega personas, sin modificar registros existentes</AlertTitle><AlertDescription>Completa la hoja Participantes. DNI y código deben ser texto para conservar ceros iniciales. Deja vacíos los campos académicos de beneficiarios. No incluyas horas ni asistencias.</AlertDescription></Alert>
      <Button variant="outline" render={<a href="/templates/participantes.xlsx" download /> }><Download data-icon="inline-start" />Descargar plantilla Excel</Button>
      <FieldGroup><Field><FieldLabel>Archivo Excel</FieldLabel>
        <Input ref={fileInput} className="hidden" type="file" accept=".xlsx" aria-label="Seleccionar archivo Excel" onChange={(event) => { void read(event.target.files?.[0]); event.target.value = ""; }} />
        <Button variant="outline" type="button" onClick={() => fileInput.current?.click()}><Upload data-icon="inline-start" />{filename ? "Cambiar archivo" : "Seleccionar archivo"}</Button>
        <FieldDescription>Hasta 5 MB y {MAX_IMPORT_ROWS} participantes. Solo .xlsx con valores, sin fórmulas.</FieldDescription>
      </Field></FieldGroup>
      <p className="text-sm text-muted-foreground" role="status">{loading ? "Leyendo archivo…" : filename || "Ningún archivo seleccionado."}</p>
      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      {rows.length > 0 && <>
        <div className="flex flex-wrap gap-2" role="status"><Badge variant="secondary">{rows.length} filas</Badge><Badge variant={invalid ? "destructive" : "secondary"}>{invalid ? `${invalid} con errores` : "Todo listo para importar"}</Badge></div>
        <Table><TableHeader><TableRow><TableHead>Fila / participante</TableHead><TableHead>Revisión</TableHead></TableRow></TableHeader><TableBody>
          {reviews.map((review, index) => <TableRow key={rows[index].row}><TableCell className="max-w-56 whitespace-normal"><p className="font-medium">{rows[index].row} · {review.input.nombre || "Sin nombre"}</p><p className="text-xs text-muted-foreground">{review.input.tipo} · DNI {review.input.dni || "vacío"}</p></TableCell><TableCell className="max-w-64 whitespace-normal">{review.issues.length ? <ul className="list-inside list-disc text-xs text-destructive">{review.issues.map((issue, index) => <li key={index}>{issue.message}</li>)}</ul> : <span className="text-sm">{review.goalHours === null ? "Sin meta académica" : `Meta: ${review.goalHours} h`}</span>}</TableCell></TableRow>)}
        </TableBody></Table>
        {invalid > 0 && <p className="text-sm text-muted-foreground">Corrige todas las filas en Excel y vuelve a seleccionar el archivo. No se importará ninguna fila mientras haya errores.</p>}
      </>}
    </div>
    <FormFooter close={close} disabled={loading || !rows.length || invalid > 0} label={`Importar${rows.length ? ` ${rows.length}` : ""} participantes`} />
  </form>;
}

export function ParticipantActions() {
  const [panel, setPanel] = useState<"goals" | "add" | "import" | null>(null);
  const [notice, setNotice] = useState("");
  const titles = { goals: "Configurar metas", add: "Agregar participante", import: "Importar Excel" };
  return <div className="flex flex-col gap-3">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-xs text-muted-foreground">Datos de ejemplo · Se reinician al recargar.</p>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" disabled={panel !== null} onClick={() => setPanel("goals")}><Settings2 data-icon="inline-start" />Configurar metas</Button>
        <Button variant="outline" disabled={panel !== null} onClick={() => setPanel("import")}><Upload data-icon="inline-start" />Importar Excel</Button>
        <Button disabled={panel !== null} onClick={() => setPanel("add")}><UserPlus data-icon="inline-start" />Agregar participante</Button>
      </div>
    </div>
    {notice && <p className="text-sm text-muted-foreground" role="status">{notice}</p>}
    {panel && <ReportDrawer key={panel} title={titles[panel]} onClose={() => setPanel((current) => current === panel ? null : current)}>{(close) => panel === "goals" ? <GoalForm close={close} onSaved={setNotice} /> : panel === "add" ? <ParticipantForm close={close} onSaved={setNotice} /> : <ImportForm close={close} onSaved={setNotice} />}</ReportDrawer>}
  </div>;
}
