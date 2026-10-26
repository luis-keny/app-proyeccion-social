"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  Award,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Filter,
  GraduationCap,
  HeartHandshake,
  MapPin,
  QrCode,
  Search,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ACADEMIC_YEARS, ALL_CYCLES, STUDENTS_DATA, type CycleCode, type StudentReportItem } from "../fixtures";
import { LabeledSelect } from "@/components/ui/labeled-select";

export function getStudentTotalHours(student: StudentReportItem): number {
  return ALL_CYCLES.reduce((acc, cycle) => acc + student.cycles[cycle].hours, 0);
}

export function getStudentTotalActivities(student: StudentReportItem): number {
  return ALL_CYCLES.reduce((acc, cycle) => acc + student.cycles[cycle].activitiesCount, 0);
}

interface AdminDashboardAndReportProps {
  mode: "dashboard" | "report";
}

export function AdminDashboardAndReport({
  mode,
}: AdminDashboardAndReportProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYearFilter, setSelectedYearFilter] = useState<"ALL" | "2026" | "2025">("ALL");
  const [selectedFaculty, setSelectedFaculty] = useState<string>("Todas");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<"Todos" | "Meta cumplida" | "En curso" | "Observado">("Todos");
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [detailCycleFilter, setDetailCycleFilter] = useState<"ALL" | CycleCode>("ALL");

  const faculties = useMemo(
    () => ["Todas", ...Array.from(new Set(STUDENTS_DATA.map((s) => s.faculty)))],
    []
  );

  const visibleAcademicYears = useMemo(() => {
    if (selectedYearFilter === "ALL") return ACADEMIC_YEARS;
    return ACADEMIC_YEARS.filter((item) => item.year === selectedYearFilter);
  }, [selectedYearFilter]);

  const filteredStudents = useMemo(() => {
    return STUDENTS_DATA.filter((student) => {
      const matchesSearch =
        `${student.name} ${student.studentCode ?? ""} ${student.dni} ${student.faculty}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      const matchesFaculty = selectedFaculty === "Todas" || student.faculty === selectedFaculty;
      const currentCycleStatus = student.cycles["2026-II"].status;
      const matchesStatus =
        selectedStatusFilter === "Todos" || currentCycleStatus === selectedStatusFilter;
      return matchesSearch && matchesFaculty && matchesStatus;
    });
  }, [searchQuery, selectedFaculty, selectedStatusFilter]);

  const selectedStudent = useMemo(
    () => STUDENTS_DATA.find((s) => s.id === selectedStudentId) ?? null,
    [selectedStudentId]
  );

  // Aggregate institutional KPIs for the Admin Dashboards
  const institutionalMetrics = useMemo(() => {
    const totalStudents = STUDENTS_DATA.length;
    const totalHoursAllCycles = STUDENTS_DATA.reduce(
      (sum, student) => sum + getStudentTotalHours(student),
      0
    );
    const totalActivitiesAllCycles = STUDENTS_DATA.reduce(
      (sum, student) => sum + getStudentTotalActivities(student),
      0
    );

    const cycleStats = ALL_CYCLES.map((cycle) => {
      const totalHours = STUDENTS_DATA.reduce((sum, s) => sum + s.cycles[cycle].hours, 0);
      const totalGoal = STUDENTS_DATA.reduce((sum, s) => sum + s.cycles[cycle].goalHours, 0);
      const totalActs = STUDENTS_DATA.reduce((sum, s) => sum + s.cycles[cycle].activitiesCount, 0);
      const completedStudents = STUDENTS_DATA.filter(
        (s) => s.cycles[cycle].hours >= s.cycles[cycle].goalHours * 0.9
      ).length;
      const avgHours = totalHours / totalStudents;
      const completionRate = Math.round((totalHours / totalGoal) * 100);
      return {
        cycle,
        year: cycle.startsWith("2025") ? "2025" : "2026",
        semester: cycle.endsWith("-I") ? "Ciclo I (Mar–Jul)" : "Ciclo II (Ago–Dic)",
        totalHours,
        totalGoal,
        totalActs,
        completedStudents,
        avgHours,
        completionRate,
      };
    });

    const areaBreakdown: Record<string, { hours: number; count: number }> = {
      "Bienestar y Salud": { hours: 0, count: 0 },
      "Educación y Voluntariado": { hours: 0, count: 0 },
      "Comunidad y Servicio": { hours: 0, count: 0 },
      "Medio Ambiente": { hours: 0, count: 0 },
    };

    STUDENTS_DATA.forEach((student) => {
      student.activities.forEach((act) => {
        areaBreakdown[act.area].hours += act.hours;
        areaBreakdown[act.area].count += 1;
      });
    });

    const currentCycleCompleted = STUDENTS_DATA.filter(
      (s) => s.cycles["2026-II"].status === "Meta cumplida"
    ).length;
    const currentCycleInProgress = STUDENTS_DATA.filter(
      (s) => s.cycles["2026-II"].status === "En curso"
    ).length;
    const currentCycleObserved = STUDENTS_DATA.filter(
      (s) => s.cycles["2026-II"].status === "Observado"
    ).length;

    return {
      totalStudents,
      totalHoursAllCycles,
      totalActivitiesAllCycles,
      cycleStats,
      areaBreakdown,
      currentCycleCompleted,
      currentCycleInProgress,
      currentCycleObserved,
    };
  }, []);

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
      Math.round((studentTotalHours / selectedStudent.annualGoalHours) * 100)
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
                    Meta: {selectedStudent.annualGoalHours} h
                  </p>
                </div>
                <div className="border-x px-3">
                  <p className="text-xs text-muted-foreground">Ciclos cursados</p>
                  <p className="text-2xl font-bold">4 ciclos</p>
                  <p className="text-[11px] text-muted-foreground">2 por año (2025–2026)</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Actividades</p>
                  <p className="text-2xl font-bold">{studentTotalActs}</p>
                  <p className="text-[11px] text-emerald-600">{overallProgress}% completado</p>
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
            <span>Estado en Ciclo 2026-II:</span>
            {(["Todos", "Meta cumplida", "En curso", "Observado"] as const).map(
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
            <strong>{STUDENTS_DATA.length}</strong> participantes registrados
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
                  {getStudentTotalHours(student)}/{student.annualGoalHours} h
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

  if (mode === "report") {
    return <section className="space-y-6">{studentReportSection}</section>;
  }

  // ============================================================================
  // VISTA PRINCIPAL DEL ADMINISTRADOR: DASHBOARDS PROPUESTOS + REPORTE DE ALUMNOS
  // ============================================================================
  return (
    <section className="space-y-8">
      {/* 1. Tarjetas KPI Ejecutivas (sin horas personales del administrador) */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>HORAS INSTITUCIONALES ACREDITADAS</span>
              <TrendingUp className="size-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              {institutionalMetrics.totalHoursAllCycles}{" "}
              <span className="text-base font-normal text-muted-foreground">h totales</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs text-muted-foreground">
            <p className="font-medium text-emerald-700">
              +{institutionalMetrics.cycleStats.find((item) => item.cycle === "2026-II")?.totalHours} h registradas en el ciclo actual 2026-II
            </p>
            <p>Suma global de todos los participantes (2025-I a 2026-II)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>PARTICIPANTES EN PROYECCIÓN SOCIAL</span>
              <Users className="size-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              {institutionalMetrics.totalStudents}{" "}
              <span className="text-base font-normal text-muted-foreground">participantes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">
              Promedio global:{" "}
              {(
                institutionalMetrics.totalHoursAllCycles /
                institutionalMetrics.totalStudents
              ).toFixed(1)}{" "}
              h / alumno
            </p>
            <p>Estudiantes y beneficiarios externos de ejemplo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>AVANCE META SEMESTRAL (2026-II)</span>
              <Award className="size-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              {institutionalMetrics.cycleStats[3].completionRate}%{" "}
              <span className="text-base font-normal text-muted-foreground">de meta</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs text-muted-foreground">
            <Progress
              value={institutionalMetrics.cycleStats[3].completionRate}
              locale="es-PE"
            />
            <p>
              Promedio 2026-II:{" "}
              {institutionalMetrics.cycleStats[3].avgHours.toFixed(1)} h de 40 h requeridas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center justify-between">
              <span>PARTICIPACIONES VALIDADAS QR/GPS</span>
              <QrCode className="size-4 text-primary" />
            </CardDescription>
            <CardTitle className="text-3xl font-bold">
              {institutionalMetrics.totalActivitiesAllCycles}{" "}
              <span className="text-base font-normal text-muted-foreground">asistencias</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-xs text-muted-foreground">
            <p className="font-medium text-emerald-700">
              {institutionalMetrics.cycleStats[3].totalActs} participaciones en 2026-II
            </p>
            <p>Auditoría geolocalizada en campo sin incidencias</p>
          </CardContent>
        </Card>
      </div>

      {/* 2. Dashboards Analíticos Propuestos: Comparativa por Ciclos (2 por año) + Ejes de Impacto */}
      <div className="grid gap-6 lg:grid-cols-[1.25fr_.95fr]">
        {/* Dashboard 1: Rendimiento comparativo por Año y Ciclo Académico (2 ciclos por año) */}
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="size-5 text-primary" />
                  Evolución de Horas por Ciclo Académico (2 ciclos por año)
                </CardTitle>
                <CardDescription>
                  Comparativa semestral de horas acreditadas, promedio por alumno y cumplimiento de la meta de 40 h por ciclo.
                </CardDescription>
              </div>
              <Badge variant="outline">Meta: 40 h / ciclo</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {ACADEMIC_YEARS.map((yearGroup) => {
                const statsForYear = institutionalMetrics.cycleStats.filter(
                  (c) => c.year === yearGroup.year
                );
                const yearTotalHours = statsForYear.reduce(
                  (acc, item) => acc + item.totalHours,
                  0
                );
                return (
                  <div
                    key={yearGroup.year}
                    className="space-y-3 rounded-xl border bg-muted/20 p-4"
                  >
                    <div className="flex items-center justify-between border-b pb-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Año Académico {yearGroup.year}
                        </p>
                        <p className="text-sm font-bold">
                          Total anual: {yearTotalHours} h colectivas
                        </p>
                      </div>
                      <Badge variant="secondary">2 Ciclos</Badge>
                    </div>

                    <div className="space-y-3">
                      {statsForYear.map((stat) => (
                        <div
                          key={stat.cycle}
                          className="space-y-1.5 rounded-lg border bg-background p-3"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-semibold text-sm">
                                Ciclo {stat.cycle}
                              </span>
                              <span className="ml-2 text-xs text-muted-foreground">
                                {stat.semester}
                              </span>
                            </div>
                            <Badge
                              variant={stat.completionRate >= 90 ? "secondary" : "outline"}
                            >
                              {stat.completionRate}% meta
                            </Badge>
                          </div>
                          <Progress value={stat.completionRate} locale="es-PE" />
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-muted-foreground">
                            <span>
                              <strong className="text-foreground">
                                {stat.totalHours} h
                              </strong>{" "}
                              totales ({stat.avgHours.toFixed(1)} h/alumno)
                            </span>
                            <span>{stat.totalActs} asistencias</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Semáforo de estado de cumplimiento del ciclo vigente */}
            <div className="grid gap-3 rounded-xl border bg-muted/30 p-3.5 sm:grid-cols-3">
              <Button variant="ghost"
                type="button"
                onClick={() => setSelectedStatusFilter("Meta cumplida")}
                className="h-auto whitespace-normal flex items-center justify-between rounded-lg border bg-background p-3 text-left transition hover:border-emerald-500"
              >
                <div>
                  <p className="text-xs text-muted-foreground">Meta cumplida (2026-II)</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {institutionalMetrics.currentCycleCompleted} participantes
                  </p>
                </div>
                <CheckCircle2 className="size-5 text-emerald-600" />
              </Button>
              <Button variant="ghost"
                type="button"
                onClick={() => setSelectedStatusFilter("En curso")}
                className="h-auto whitespace-normal flex items-center justify-between rounded-lg border bg-background p-3 text-left transition hover:border-primary"
              >
                <div>
                  <p className="text-xs text-muted-foreground">En progreso regular</p>
                  <p className="text-xl font-bold text-primary">
                    {institutionalMetrics.currentCycleInProgress} alumnos
                  </p>
                </div>
                <Clock3 className="size-5 text-primary" />
              </Button>
              <Button variant="ghost"
                type="button"
                onClick={() => setSelectedStatusFilter("Observado")}
                className="h-auto whitespace-normal flex items-center justify-between rounded-lg border bg-background p-3 text-left transition hover:border-amber-500"
              >
                <div>
                  <p className="text-xs text-muted-foreground">Requiere seguimiento</p>
                  <p className="text-xl font-bold text-amber-600">
                    {institutionalMetrics.currentCycleObserved} alumno
                  </p>
                </div>
                <Activity className="size-5 text-amber-600" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard 2: Distribución de Horas por Eje de Impacto Social y Escuelas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HeartHandshake className="size-5 text-primary" />
              Impacto por Eje Social y Escuela Profesional
            </CardTitle>
            <CardDescription>
              Distribución de las horas ejecutadas según la línea de intervención comunitaria.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(institutionalMetrics.areaBreakdown).map(([area, info]) => {
              const pct = Math.round(
                (info.hours / institutionalMetrics.totalHoursAllCycles) * 100
              );
              return (
                <div key={area} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{area}</span>
                    <span className="font-mono text-xs text-muted-foreground">
                      <strong className="text-foreground">{info.hours} h</strong> ({pct}%) ·{" "}
                      {info.count} jornadas
                    </span>
                  </div>
                  <Progress value={pct} locale="es-PE" />
                </div>
              );
            })}

            <div className="border-t pt-4">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Participación por Escuela Profesional
              </p>
              <div className="grid grid-cols-2 gap-2">
                {STUDENTS_DATA.map((student) => {
                  const total = getStudentTotalHours(student);
                  return (
                    <Button variant="ghost"
                      key={student.id}
                      type="button"
                      onClick={() => openStudentDetail(student.id, "ALL")}
                      className="h-auto whitespace-normal flex items-center justify-between rounded-lg border bg-muted/20 px-3 py-2 text-left text-xs transition hover:border-primary/50 hover:bg-muted/50"
                    >
                      <span className="truncate font-medium">{student.faculty}</span>
                      <Badge variant="secondary" className="ml-2 shrink-0">
                        {total} h
                      </Badge>
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Vista de Reporte de todos los alumnos integrada directamente en la vista del administrador */}
      {studentReportSection}
    </section>
  );
}
