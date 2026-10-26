"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Filter,
  GraduationCap,
  HeartHandshake,
  MapPin,
  QrCode,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ACADEMIC_YEARS, ALL_CYCLES, type CycleCode, type StudentReportItem } from "../fixtures";
import { ParticipantActions } from "./participant-actions";
import { useReports } from "./reports-provider";
import { participantStatus } from "../participants";
import { LabeledSelect } from "@/components/ui/labeled-select";

export function getStudentTotalHours(student: StudentReportItem): number {
  return ALL_CYCLES.reduce((acc, cycle) => acc + student.cycles[cycle].hours, 0);
}

export function getStudentTotalActivities(student: StudentReportItem): number {
  return ALL_CYCLES.reduce((acc, cycle) => acc + student.cycles[cycle].activitiesCount, 0);
}

export function AdminStudentReport() {
  const { participants } = useReports();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYearFilter, setSelectedYearFilter] = useState<"ALL" | "2026" | "2025">("ALL");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("Todas");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"Todos" | "Meta cumplida" | "Al día" | "Observado" | "No aplica">("Todos");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [detailCycleFilter, setDetailCycleFilter] = useState<"ALL" | CycleCode>("ALL");

  const faculties = useMemo(
    () => ["Todas", ...Array.from(new Set(participants.map((s) => s.faculty)))],
    [participants]
  );

  const visibleAcademicYears = useMemo(() => {
    if (selectedYearFilter === "ALL") return ACADEMIC_YEARS;
    return ACADEMIC_YEARS.filter((item) => item.year === selectedYearFilter);
  }, [selectedYearFilter]);

  const filteredStudents = useMemo(() => {
    return participants.filter((student) => {
      const matchesSearch =
        `${student.name} ${student.studentCode ?? ""} ${student.dni} ${student.faculty}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesFaculty = selectedFaculty === "Todas" || student.faculty === selectedFaculty;
      const currentCycleStatus = participantStatus(student);
      const matchesStatus =
        selectedStatusFilter === "Todos" || currentCycleStatus === selectedStatusFilter;
      return matchesSearch && matchesFaculty && matchesStatus;
    });
  }, [participants, searchQuery, selectedFaculty, selectedStatusFilter]);

  const selectedStudent = useMemo(
    () => participants.find((s) => s.id === selectedStudentId) ?? null,
    [participants, selectedStudentId]
  );

  const openStudentDetail = (studentId: string, cycle: "ALL" | CycleCode = "ALL") => {
    setSelectedStudentId(studentId);
    setDetailCycleFilter(cycle);
  };

  // ============================================================================
  // VISTA DE DETALLE DE LAS HORAS REALIZADAS POR EL ESTUDIANTE
  // ============================================================================
  if (selectedStudent) {
    const studentTotalHours = getStudentTotalHours(selectedStudent);
    const studentTotalActs = getStudentTotalActivities(selectedStudent);
    const overallProgress = Math.min(
      100,
      selectedStudent.assignedGoalHours > 0 ? Math.round((studentTotalHours / selectedStudent.assignedGoalHours) * 100) : 0
    );
    const visibleLogs =
      detailCycleFilter === "ALL"
        ? selectedStudent.activities
        : selectedStudent.activities.filter((act) => act.cycle === detailCycleFilter);

    return (
      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-card p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedStudentId(null)}
              className="gap-2"
            >
              <ArrowLeft className="size-4" />
              Volver al reporte de alumnos
            </Button>
            <div className="hidden h-5 w-px bg-border sm:block" />
            <span className="text-xs font-medium text-muted-foreground">
              Expediente de Proyección Social · Detalle del participante
            </span>
          </div>
          <Badge variant="secondary" className="gap-1.5">
            <ShieldCheck className="size-3.5 text-emerald-600" />
            Historial de participación de ejemplo
          </Badge>
        </div>

        {/* Ficha principal del estudiante */}
        <Card className="border-primary/20 bg-gradient-to-br from-card via-card to-muted/30">
          <CardContent className="pt-6">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="flex items-start gap-4">
                <Avatar className="size-16 border-2 border-primary/20 text-lg font-semibold">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {selectedStudent.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold tracking-tight">{selectedStudent.name}</h2>
                    {selectedStudent.participantType === "student" ? (
                      <>
                        <Badge>{selectedStudent.faculty}</Badge>
                        <Badge variant="outline">{selectedStudent.currentSemesterLabel}</Badge>
                      </>
                    ) : (
                      <Badge variant="secondary">Beneficiario externo</Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                    {selectedStudent.participantType === "student" && (
                      <span>
                        <strong className="font-medium text-foreground">Código:</strong>{" "}
                        {selectedStudent.studentCode}
                      </span>
                    )}
                    <span>
                      <strong className="font-medium text-foreground">DNI:</strong>{" "}
                      {selectedStudent.dni}
                    </span>
                    <span>
                      <strong className="font-medium text-foreground">Correo:</strong>{" "}
                      {selectedStudent.email}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 rounded-xl border bg-background/80 p-4 sm:min-w-88">
                <div>
                  <p className="text-xs text-muted-foreground">Horas Totales</p>
                  <p className="text-2xl font-bold text-primary">{studentTotalHours} h</p>
                  <p className="text-[11px] text-muted-foreground">
                    {selectedStudent.participantType === "student" ? `Meta asignada: ${selectedStudent.assignedGoalHours} h` : "Sin meta académica"}
                  </p>
                </div>
                <div className="border-x px-3">
                  <p className="text-xs text-muted-foreground">Periodos con horas</p>
                  <p className="text-2xl font-bold">{ALL_CYCLES.filter((cycle) => selectedStudent.cycles[cycle].hours > 0).length} periodos</p>
                  <p className="text-[11px] text-muted-foreground">Con horas registradas</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Actividades</p>
                  <p className="text-2xl font-bold">{studentTotalActs}</p>
                  <p className="text-[11px] text-emerald-600">{selectedStudent.participantType === "student" ? `${overallProgress}% de la meta total` : "Participación externa"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de detalle de actividades y horas realizadas por el estudiante */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock3 className="size-5 text-primary" />
                  Detalle de horas realizadas por {selectedStudent.name}
                </CardTitle>
                <CardDescription>
                  Registro cronológico de participaciones, proyectos, horarios y validación de asistencia.
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <Button
                  size="xs"
                  variant={detailCycleFilter === "ALL" ? "default" : "outline"}
                  onClick={() => setDetailCycleFilter("ALL")}
                >
                  Todos ({selectedStudent.activities.length})
                </Button>
                {ALL_CYCLES.map((cycle) => (
                  <Button
                    key={cycle}
                    size="xs"
                    variant={detailCycleFilter === cycle ? "default" : "outline"}
                    onClick={() => setDetailCycleFilter(cycle)}
                  >
                    {cycle} ({selectedStudent.cycles[cycle].hours} h)
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead>Ciclo</TableHead>
                  <TableHead>Actividad / Proyecto Social</TableHead>
                  <TableHead>Lugar y Fecha</TableHead>
                  <TableHead>Supervisor / Validador</TableHead>
                  <TableHead className="text-right">Horas Acreditadas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {log.cycle}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs whitespace-normal">
                      <p className="font-medium text-foreground">{log.title}</p>
                      <p className="text-xs text-muted-foreground">{log.schedule}</p>
                    </TableCell>
                    <TableCell className="whitespace-normal">
                      <p className="flex items-center gap-1 text-sm">
                        <MapPin className="size-3.5 text-muted-foreground" />
                        {log.place}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <CalendarDays className="size-3" />
                        {log.date}
                      </p>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm font-medium">{log.supervisor}</p>
                      <p className="flex items-center gap-1 text-xs text-emerald-700">
                        <QrCode className="size-3" />
                        {log.validationMethod} · {log.status}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">
                        +{log.hours} h
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    );
  }

  // ============================================================================
  // BLOQUE REUTILIZABLE: TABLA DE REPORTE DE TODOS LOS ALUMNOS
  // ============================================================================
  const studentReportSection = (
    <Card id="reporte-alumnos-card" className="border-border/80 shadow-xs">
      <CardHeader className="space-y-4">
        {/* Barra de filtros del reporte */}
        <div className="grid gap-3 pt-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <Input
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar alumno por nombre, código universitario o DNI…"
            />
          </div>

          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <Filter className="size-3.5 shrink-0" />
            <span className="shrink-0 font-medium">Escuela:</span>
            <LabeledSelect label="Filtrar por escuela profesional" className="w-full" value={selectedFaculty} onValueChange={setSelectedFaculty} options={faculties.map((faculty) => ({ value: faculty, label: faculty }))} />
          </label>

          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="size-3.5 shrink-0" />
            <span className="shrink-0 font-medium">Ciclos:</span>
            <LabeledSelect label="Filtrar columnas de ciclos por año" className="w-full" value={selectedYearFilter} onValueChange={setSelectedYearFilter} options={[{ value: "ALL", label: "2025 y 2026 (4 ciclos)" }, { value: "2026", label: "Año 2026 (2026-I y 2026-II)" }, { value: "2025", label: "Año 2025 (2025-I y 2025-II)" }]} />
          </label>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-1.5">
            <span>Avance académico:</span>
            {(["Todos", "Meta cumplida", "Al día", "Observado", "No aplica"] as const).map(
              (statusOption) => (
                <Button
                  key={statusOption}
                  size="xs"
                  variant={selectedStatusFilter === statusOption ? "default" : "outline"}
                  onClick={() => setSelectedStatusFilter(statusOption)}
                >
                  {statusOption}
                </Button>
              )
            )}
          </div>
          <span>
            Mostrando <strong>{filteredStudents.length}</strong> de{" "}
            <strong>{participants.length}</strong> participantes registrados
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/60">
              <TableHead className="min-w-52">Nombre</TableHead>
              <TableHead>Código / DNI</TableHead>
              <TableHead className="text-right">Horas totales</TableHead>
              {visibleAcademicYears.flatMap((yearGroup) =>
                yearGroup.cycles.map((cycleCode) => (
                  <TableHead key={cycleCode} className="text-right">
                    {cycleCode}
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell>
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => openStudentDetail(student.id, "ALL")}
                    className="h-auto justify-start whitespace-normal p-0 text-left font-semibold hover:text-primary hover:underline"
                    aria-label={"Ver detalle de " + student.name + (student.participantType === "student" ? ", estudiante" : ", beneficiario externo")}
                    title={student.participantType === "student" ? "Estudiante" : "Beneficiario externo"}
                  >
                    {student.participantType === "student" ? (
                      <GraduationCap aria-hidden="true" className="size-4 shrink-0 text-sky-600 dark:text-sky-400" />
                    ) : (
                      <HeartHandshake aria-hidden="true" className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                    )}
                    {student.name}
                  </Button>
                </TableCell>
                <TableCell className="font-mono text-xs">
                  {student.participantType === "student" ? student.studentCode : student.dni}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {getStudentTotalHours(student)}{student.participantType === "student" ? `/${student.assignedGoalHours}` : ""} h
                </TableCell>
                {visibleAcademicYears.flatMap((yearGroup) =>
                  yearGroup.cycles.map((cycleCode) => (
                    <TableCell key={cycleCode} className="text-right tabular-nums">
                      {student.cycles[cycleCode].hours} h
                    </TableCell>
                  ))
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredStudents.length === 0 && (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No se encontraron participantes con los filtros seleccionados.
          </div>
        )}
      </CardContent>
    </Card>
  );

  return <section className="flex flex-col gap-6"><ParticipantActions />{studentReportSection}</section>;
}
