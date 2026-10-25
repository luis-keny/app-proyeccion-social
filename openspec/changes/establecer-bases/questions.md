# Preguntas por resolver

Estas decisiones condicionan la implementación. El humano aporta o valida las respuestas; no se deducen de los datos de la demo.

| Referencia | Decisión pendiente | Bloquea |
|---|---|---|
| P-01 | Proveedor y flujo de autenticación institucional | Identidad e integración |
| P-02 | Padrón, código y validación de estudiante vigente | Alta y QR |
| P-03 | Fechas de ciclos y sesión que cruza su límite | Datos y reportes |
| P-04 | Asistentes asignados o globales; registro de su propia asistencia | Permisos y RLS |
| P-05 | Ventana, tardanzas y regularización | Registro de asistencia |
| P-06 | Quién anula/restaura y qué ocurre al cancelar sesiones con asistencias | Historial y crédito |
| P-07 | Minutos por sesión, redondeo, límites y cambios retroactivos | Acreditación |
| P-08 | QR estático/temporal y datos visibles al operador | Identificación |
| P-09 | GPS informativo/obligatorio y dispositivo medido | Ubicación y privacidad |
| P-10 | Límite de recurrencias, edición de series y zona institucional | Sesiones |
| P-11 | Carga, presupuesto, hosting y recuperación | Dimensionamiento y piloto |
| P-12 | Retención y acceso a datos/ubicación; exportaciones | Privacidad |
| P-13 | Primer administrador y revocación de acceso | Puesta en marcha |
| P-14 | Meta de horas por ciclo y variaciones por programa/estudiante | Progreso |

Resolver primero identidad, ciclos, permisos y correcciones. Acordar también estado temporal cuando todas las sesiones se cancelan y entre sesiones de una serie.

Monolito e InsForge están confirmados. La separación de módulos visuales está autorizada en el [cambio de interfaz](../modularizar-interfaz-por-roles/review.md). El mecanismo SDK/ORM, modelo físico y capas de negocio/infraestructura siguen pendientes antes de implementarlos.
