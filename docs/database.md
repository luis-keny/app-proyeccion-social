# Base de datos

InsForge proporciona PostgreSQL. Este modelo es conceptual: no representa tablas remotas verificadas ni autoriza aplicar migraciones.

## Modelo propuesto

| Entidad | Contenido y restricciones principales |
|---|---|
| Perfiles | Identidad institucional y estado; vínculo con `auth.users(id)` si se adopta ese mapeo |
| Estudiantes | Código institucional único y perfil asociado |
| Roles de usuario | Asignación de capacidades; combinación usuario/rol única |
| Ciclos académicos | Código y fechas explícitas |
| Actividades | Descripción, estado administrativo y responsable |
| Recurrencia | Patrón y condición de finalización |
| Sesiones | Actividad, ciclo, inicio/fin, ubicación, crédito y cancelación |
| Asistencias | Estudiante, sesión, operador, fecha, estado y crédito reconocido |
| Eventos de asistencia | Registro, anulación y restauración con actor y motivo |
| Auditoría administrativa | Cambios de roles, publicación y configuración |

No hay tabla de inscripciones. Asignaciones de asistentes, credenciales QR y evidencias se añadirán solo si las reglas aceptadas lo requieren.

## Integridad

- Identificadores técnicos estables y claves foráneas; el código del estudiante no es la clave primaria.
- Una asistencia por estudiante y sesión, incluso ante solicitudes concurrentes.
- Inicio anterior a fin y crédito no negativo.
- Propuesta: almacenar minutos enteros y copiar el crédito de la sesión a la asistencia al registrarla.
- Totales derivados de asistencias válidas; no mantener un saldo editable en el perfil.
- Registro, crédito e historial confirmados en una operación atómica.
- Anulaciones y correcciones conservan motivo y responsable. Cancelar o editar una actividad no borra asistencias.
- Cambiar configuración futura no recalcula silenciosamente el pasado.

Ejemplo: una sesión acredita 150 minutos. Una asistencia válida suma 2,5 horas; repetir la solicitud no suma más. Una anulación autorizada excluye el crédito y conserva el historial.

## Sesiones y tiempo

Propuesta: materializar ocurrencias finitas con identificadores estables para cancelarlas individualmente. Guardar instantes en `timestamptz` y una zona horaria de negocio explícita. Falta acordar zona institucional, cruces de ciclo y reglas de edición de series.

## Acceso e índices

Definir permisos y RLS por tabla, con acceso propio del estudiante y acceso operativo/administrativo autorizado. Probar peticiones directas y evitar que un cliente privilegiado sustituya el contexto de usuario.

Proponer índices para claves foráneas, sesiones por actividad/fecha y asistencias por estudiante/sesión. Ajustarlos con consultas y carga reales. No usar borrado en cascada para destruir historial de participación.

## Migraciones

Mantener SQL en archivos de migración del repositorio, con un solo responsable de aplicarlos. Las migraciones describen cambios ejecutables; este documento explica el modelo vigente.

Antes de aplicar: resolver reglas bloqueantes, definir tipos/nulabilidad/constraints/RLS, revisar impacto y recuperación, probar con datos sintéticos y obtener autorización del entorno. No modificar esquemas internos de InsForge.

Pendientes: [ciclos, correcciones, crédito y recurrencia](../openspec/changes/establecer-bases/questions.md).
