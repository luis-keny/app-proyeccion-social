## Purpose

Definir cómo se publican actividades con sesiones finitas y cómo se cancelan ocurrencias sin perder la programación restante.

## ADDED Requirements

### Requirement: Actividades publicadas sin inscripción
El sistema SHALL permitir que un estudiante consulte actividades publicadas sin inscripción previa ni reserva de cupo.

#### Scenario: Consulta de actividad
- **WHEN** un estudiante autorizado consulta una actividad publicada
- **THEN** puede ver la actividad sin que exista inscripción o reserva a su nombre

### Requirement: Programación finita
El sistema SHALL exigir fin de horario para cada sesión y fecha límite o cantidad de ocurrencias para toda recurrencia.

#### Scenario: Serie sin condición de finalización
- **WHEN** un administrador intenta publicar una recurrencia sin fecha límite ni cantidad
- **THEN** el sistema rechaza la publicación e informa el dato requerido

### Requirement: Cancelación independiente
El sistema SHALL permitir al administrador cancelar una sesión sin cancelar las demás sesiones de la actividad.

#### Scenario: Cancelar una ocurrencia
- **WHEN** el administrador cancela una sesión de una serie publicada
- **THEN** las demás conservan su programación y la sesión cancelada deja de aceptar nuevas asistencias

### Requirement: Estado temporal calculado
El sistema SHALL separar estado administrativo de actividad y estado temporal calculado a partir de su programación.

#### Scenario: Fin de la última sesión
- **WHEN** termina la última sesión no cancelada de una actividad publicada
- **THEN** la actividad se muestra finalizada sin intervención manual

Decisiones sin resolver: [preguntas del cambio](../../questions.md).
