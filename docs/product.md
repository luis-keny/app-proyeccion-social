# Producto

El sistema permite a estudiantes de UPeU consultar actividades de proyección social y sus horas acreditadas. Los operadores registran asistencia y coordinación administra actividades y reportes.

## Estado actual

Existe una demo con datos en memoria, selector de roles, cámara, mapa y reportes de ejemplo. Las cifras y metas mostradas no son reglas institucionales. Autenticación, persistencia y permisos reales aún no están verificados.

## Alcance

Una sola sede inicialmente, acceso institucional `@upeu.edu.pe`, sin inscripción ni reserva de cupos. La participación se determina por asistencia válida y acredita una cantidad fija de horas por sesión.

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

Una actividad agrupa sesiones con horario y ubicación. Puede ser de un día o recurrente. Toda recurrencia termina en una fecha o después de una cantidad de ocurrencias; no existe la opción «nunca».

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
