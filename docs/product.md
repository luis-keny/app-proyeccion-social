# Producto

El sistema permite a estudiantes de UPeU consultar actividades de proyección social y sus horas acreditadas. Los operadores registran asistencia y coordinación administra actividades y reportes.

## Estado actual

La aplicación se construye primero de manera visual, organizando componentes, vistas, módulos y acciones por rol. Conserva datos de ejemplo en memoria, selector de roles, cámara, mapa y reportes. Las cifras y metas mostradas no son reglas institucionales. Autenticación, persistencia y permisos reales aún no están verificados. La [matriz visual y las reglas de interacción](design.md) describen esta primera entrega; no constituyen la implementación completa del producto.

Las vistas son navegables mediante URLs por rol, enlaces e historial del navegador, con presentación compartida de workspace e interfaz en español. Cambiar el rol de revisión no autentica una cuenta ni concede permisos reales.

## Alcance

Una sola sede inicialmente, acceso institucional `@upeu.edu.pe`, sin inscripción ni reserva de cupos. La participación se determina por asistencia válida. La interfaz configura horas por asistencia o un total condicionado a asistir a todas las jornadas o un mínimo, como se precisa en [configuración visual](#configuración-visual-de-actividades); su aplicación real sigue pendiente del backend.

| Actor | Funciones |
|---|---|
| Estudiante | Consultar actividades y detalles, mostrar QR, revisar progreso, asistencias y horas por ciclo |
| Asistente | Funciones de estudiante y registro de asistencia con confirmación de identidad |
| Administrador | Gestionar actividades, sesiones, usuarios y roles; registrar asistencia y consultar reportes |

El administrador utiliza el mismo flujo de registro que el asistente. Su QR personal es opcional. Cada rol dispone de acceso a su perfil; los permisos efectivos se comprueban en servidor.

## Flujo de participación

Administrador publica actividad → estudiante consulta y asiste → operador selecciona sesión y escanea QR → confirma identidad → registra asistencia → se refleja el crédito.

Escanear por sí solo no acredita horas. El alcance de cada asistente y las ventanas de registro aún deben definirse.

## Actividades y sesiones

Una actividad agrupa sesiones con horario y ubicación. Puede ser de un día o recurrente. La interfaz permite terminar una recurrencia por fecha, por cantidad de jornadas o dejarla sin fecha de fin. Esta ampliación visual sustituye la restricción inicial de recurrencia siempre finita; el tratamiento real de sesiones abiertas requiere definición antes del backend.

El administrador controla borrador, publicada y cancelada. Próxima, en curso y finalizada se calculan a partir de la programación. Puede cancelarse toda la actividad o solo una sesión.

## Vocabulario

| Término | Significado |
|---|---|
| Ciclo | Periodo académico con fechas explícitas |
| Sesión | Ocurrencia concreta de una actividad |
| Asistencia | Participación confirmada de un estudiante en una sesión |
| Crédito | Tiempo reconocido por una asistencia válida |
| Anulación | Invalidación que conserva el historial |

## Límites del alcance

No se contempla por ahora separación multi-sede, entrada/salida, sincronización offline, certificados, pagos ni aplicación móvil nativa. Una cuenta institucional no demuestra por sí sola que su titular sea estudiante vigente.

Los escenarios detallados están en las especificaciones del [cambio de bases](../openspec/changes/establecer-bases/proposal.md). Las reglas sin resolver se mantienen en sus [preguntas](../openspec/changes/establecer-bases/questions.md).

## Configuración visual de actividades

El editor recoge nombre, descripción y lugar con un punto y radio visual de 50 metros en el mapa. Ofrece día único o recurrencia diaria, semanal y personalizada, con intervalo, días semanales y terminación configurable. El [contrato visual](design.md#programación-y-validación-visual-de-horas) detalla controles, límites y condiciones de horas por asistencia completa, mínimo de jornadas o cada asistencia. La asistencia completa requiere una serie con fin.

Esta ampliación reemplaza las restricciones visuales iniciales de crédito fijo por sesión y recurrencia finita; su aplicación real y tratamiento del historial siguen pendientes antes del backend. Integrar Google Calendar o construir una vista propia de calendario queda para después, al igual que las ruedas de reloj móviles.

## Consulta de actividades

Las cards sintetizan ubicación, próxima jornada, recurrencia y condiciones de horas. Ver detalles abre una página por actividad para los tres roles con descripción completa, programación, jornadas y mapa de consulta. El registro conserva la actividad seleccionada para asistente/administrador; no se añaden inscripciones. La disponibilidad del detalle depende del estado en memoria: los ejemplos se recuperan al recargar y las actividades creadas durante la sesión no persisten. Ver [diseño de cards y detalle](design.md#cards-y-detalle-de-actividades).
