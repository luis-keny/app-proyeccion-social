# Diseño de interfaz

## Reglas confirmadas

- Usar los componentes compartidos del sistema visual. No mostrar controles nativos del navegador salvo solicitud humana expresa: selects, campos, botones, fechas y confirmaciones deben componerse con las primitivas correspondientes. El HTML semántico que implementa esas primitivas se conserva.
- Usar `Drawer` desde la derecha para paneles de interacción. Si el humano dice «modal», interpretarlo como drawer derecho, salvo que cambie explícitamente esta regla. No usar un modal centrado ni un drawer inferior como sustituto en móvil.
- Toda creación y edición se presenta dentro de un drawer. Las vistas contienen consultas y acciones de apertura; no formularios de alta/edición en cards visibles.
- Eliminar requiere `AlertDialog` con título, explicación, cancelar y acción roja mediante el token `destructive`. El color acompaña el texto explícito de la acción.
- Los drawers ofrecen título, descripción, cierre, cancelación y desplazamiento del contenido. Conservar navegación por teclado, foco visible y retorno de foco al cerrar.
- Toda la interfaz se presenta en español, incluidos menús, títulos, migas de navegación, etiquetas accesibles y páginas no disponibles. Los identificadores de código pueden estar en inglés.

La implementación usa [Drawer](https://ui.shadcn.com/docs/components/base/drawer), [Select](https://ui.shadcn.com/docs/components/base/select) y [AlertDialog](https://ui.shadcn.com/docs/components/base/alert-dialog) ya instalados sobre Base UI. `LabeledSelect` comparte la composición de filtros y sus etiquetas accesibles. No se añaden librerías.

Los enlaces con apariencia de botón usan `ButtonLink`, que aplica las variantes visuales compartidas sobre `Link` y conserva la semántica de navegación. `Button` se reserva para acciones.

## Primera etapa visual

La presentación común reutiliza el scaffold de workspace: sidebar con identidad y navegación, área de contenido inset, encabezado con migas de navegación y control para alternar el menú. Los componentes reciben marca, enlaces e identidad como datos reutilizables. En móvil, el menú usa Drawer derecho y se cierra al elegir una vista. El selector de rol permite revisar vistas; no representa una sesión autenticada. Los datos de ejemplo y las mutaciones en memoria permanecen identificados como tales.

| Módulo | Estudiante | Asistente | Administrador |
|---|---|---|---|
| Progreso | Consultar horas e historial de ejemplo | Igual que estudiante | — |
| Actividades | Buscar y consultar | Buscar, consultar y abrir registro | Además crear, editar y solicitar eliminación |
| QR personal | Mostrar código visual de ejemplo | Igual que estudiante | — |
| Registro de asistencia | — | Seleccionar actividad, revisar cámara/GPS y simular lectura | Mismo flujo visual |
| Reportes | — | — | Resumen general, filtros y detalle de estudiante/ciclo |

## Navegación

Las páginas se organizan en `app/workspace/[role]/`; las URLs de roles y vistas están en español. `/` y `/workspace` conducen a `/workspace/estudiante/progreso`. La entrada de cada rol conduce a su inicio: progreso para estudiante/asistente y resumen para administrador.

| Vista | Segmento | Roles disponibles |
|---|---|---|
| Mi progreso | `progreso` | Estudiante, asistente |
| Actividades | `actividades` | Los tres roles |
| Detalle de actividad | `actividades/[activityId]` | Los tres roles |
| Mi QR | `mi-qr` | Estudiante, asistente |
| Registrar asistencia | `asistencia` | Asistente, administrador |
| Resumen general | `resumen` | Administrador |
| Reporte de alumnos | `reportes` | Administrador |

Ejemplo: `/workspace/asistente/actividades`. Cada vista admite acceso directo, navegación con enlaces y atrás/adelante. El sidebar identifica la página activa y las migas muestran rol y vista. Una dirección desconocida o combinación no disponible muestra un mensaje en español.

Los datos de actividades se conservan durante la navegación cliente, incluso al cambiar de rol, pero vuelven a los ejemplos iniciales al recargar. Los filtros locales pueden reiniciarse al abandonar su página.

Esta tabla describe las vistas disponibles, no el catálogo completo de la aplicación. Perfil, usuarios/roles y programación completa de sesiones requieren iteraciones posteriores. No inferir permisos efectivos a partir de botones visibles.

Crear/editar una actividad abre el drawer derecho; guardar actualiza los datos durante la sesión y lo cierra. Cancelar descarta el borrador. Eliminar abre la confirmación y solo retira la actividad de memoria al aceptar. Sin actividades, registro presenta un estado vacío. Los identificadores estables permiten actividades con nombres iguales sin afectar otra al editar/eliminar.

Las cards de consulta, indicadores y detalles siguen siendo válidas. El mapa es un selector de ubicación dentro del formulario; cámara y QR siguen sujetos a las decisiones funcionales pendientes en [OpenSpec](../openspec/changes/establecer-bases/questions.md).

## Reporte administrativo simplificado

La vista Reporte de alumnos presenta un único título general y una descripción breve sobre horas por ciclo, acumulado y apertura del detalle por nombre. La card comienza en los filtros: no repite título, distintivo ni descripción de reporte consolidado. Se omiten las cuatro cards de indicadores superiores. El detalle conserva la ficha del participante y el historial filtrable por ciclo, sin el bloque de resumen anual/por ciclo ni la columna Eje de impacto.

La tabla muestra nombre, un solo identificador (código para estudiante o DNI para beneficiario externo), horas realizadas/horas totales y únicamente horas realizadas por ciclo. El nombre abre el detalle mediante el botón compartido sin padding adicional; no hay columna ni botón separado de detalle. Se omiten avatar, carrera, ciclo actual, correo, barras, porcentajes, asistencias, metas y proyectos por ciclo. Los filtros de búsqueda, escuela, año y estado se conservan. El total acumulado mantiene todos los ciclos aunque el filtro de año cambie las columnas visibles.

El nombre incluye un birrete azul para estudiantes o un icono de voluntariado verde para beneficiarios externos, con etiqueta accesible que identifica el tipo sin depender del color. El código universitario se muestra solo, sin sufijos internos como `EST-00482`. Los ejemplos incluyen seis estudiantes y dos beneficiarios externos con DNI ficticios e historial de voluntariados; las horas del historial coinciden con sus resúmenes por ciclo. El filtro de escuela incluye Personas externas y los contadores globales se expresan como participantes, sin contar ese grupo como escuela. El detalle externo muestra DNI sin código ni datos académicos. Esta presentación no incorpora cuentas externas, permisos ni persistencia.

## Programación y validación visual de horas

El drawer ordena nombre, descripción, lugar y mapa; después presenta Programación y Validación de horas con encabezados de fondo tenue, icono y mayor separación. Se usan etiquetas breves, campos relacionados en dos columnas y un resumen de una línea. Nombre, descripción y lugar son obligatorios. La descripción se conserva al editar y se muestra en la card.

El mapa permite arrastrar con ratón o un dedo para explorar sin mover la ubicación elegida. Solo un clic/toque sin arrastre selecciona el punto. El marcador y su círculo permanecen anclados a coordenadas geográficas al desplazar o ampliar. El radio predeterminado de 50 metros se guarda como referencia visual; no implementa una validación GPS. Las flechas desplazan la vista, Enter/espacio seleccionan el centro y un botón vuelve al punto seleccionado. Zoom y atribución no seleccionan ubicaciones.

La programación se inspira en los [eventos periódicos de Google Calendar](https://support.google.com/calendar/answer/37115?hl=es): Día único, Todos los días, Cada semana y Personalizado. No muestra Calendar ni un selector nativo de fecha: usa campos DD/MM/AAAA con formato automático. Día único oculta la terminación y produce una jornada; semanal repite el día de la fecha inicial. Personalizado permite intervalo en días o semanas y, por semana, botones de lunes a domingo con selección múltiple. Una serie termina por fecha inclusiva, cantidad de jornadas o sin fecha de fin. Las jornadas anteriores al inicio se excluyen.

El horario común usa HH:mm, hora de Lima y fin posterior al inicio en el mismo día. Los campos ofrecen sugerencias cada 15 minutos y permiten escribir horas intermedias; al salir, una entrada como 8 se normaliza a 08:00. Las ruedas de reloj para móvil quedan pendientes por indicación humana.

Las series finitas admiten hasta 366 jornadas como límite técnico de esta etapa visual. Las series sin fin conservan la regla abierta y solo generan hasta 366 fechas de vista previa; no se presenta esa muestra como total ni como máximo de horas. El mínimo configurable en la vista previa está entre 1 y 366 para series abiertas. El radio no impone una regla institucional de asistencia.

La validación de horas mantiene total por asistencia completa, total al alcanzar un mínimo o valor por asistencia. Las horas son positivas e independientes de la duración del horario. El mínimo es entero y no supera las jornadas de una serie finita. Asistencia completa exige una terminación: no puede completarse una serie sin fin. Las cards de series abiertas indican horas por asistencia sin inventar un total.

La configuración se conserva al editar y navegar durante la sesión; cancelar descarta el borrador. Los ejemplos sin programación o descripción requieren completarlas al editar. No se acreditan horas reales ni se recalculan progreso, reportes o asistencias. Correcciones y efectos retroactivos requieren definición antes del backend. Integrar Google Calendar o crear una vista propia de calendario sigue pendiente.

Los drawers animan panel y fondo: entrada de 360 ms y salida de 240 ms mediante variables CSS compartidas. El editor permanece montado hasta terminar la salida y respeta movimiento reducido.

## Cards y detalle de actividades

Las cards omiten la etiqueta de área de los datos de ejemplo (como «Comunidad · Servicio»), porque no se recoge en el formulario actual.

Las cards priorizan nombre, descripción de hasta dos líneas, lugar, próxima jornada con horario, recurrencia y condición breve de horas. El distintivo diferencia horas totales de horas por asistencia; las series abiertas no muestran máximos calculados sobre una muestra. La próxima jornada se calcula en hora de Lima con la referencia del render de la página, incluye una jornada de hoy hasta su hora de fin y excluye las que ya terminaron. No es un reloj en tiempo real. Si la programación finita terminó, se indica que no hay jornadas pendientes. Un dato sin programación conserva su fecha textual y no recibe una regla inventada.

Cada card ofrece Ver detalles mediante enlace a `/workspace/[role]/actividades/[activityId]`. Esta página de consulta está disponible para los tres roles y muestra descripción completa, regla de repetición, inicio, terminación, horario, jornadas y condición de horas. Inicialmente presenta hasta seis fechas: en series finitas se pueden expandir todas; en abiertas se identifica explícitamente como muestra inicial, nunca como total. La navegación mantiene Actividades activa, añade la miga Detalle y permite volver al listado o usar atrás/adelante.

El detalle permite explorar y ampliar el mapa con radio de referencia, sin cambiar la ubicación con clic ni teclado. No monta formularios de edición. Asistentes/administradores pueden abrir registro con esa actividad seleccionada; estudiantes consultan sin ese botón. Los ejemplos incluyen descripción y tres configuraciones ilustrativas de horas, sin implicar actividades institucionales reales. Si una actividad no existe en la sesión, se informa y se ofrece volver; recargar una actividad creada en memoria puede llevar a ese estado.
