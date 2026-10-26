## ADDED Requirements

### Requirement: Gráficos administrativos comparables

Resumen general SHALL presentar barras de avance por escuela al 100%, dona de estados excluyentes y barra de participación del periodo. SHALL usar los agregados actuales, excluir beneficiarios del avance académico y conservar indicadores/accesos. SHALL mostrar cantidades/leyendas y estados vacíos, sin evolución por ciclos ni eje social.

#### Scenario: Distribución sin doble conteo

- **WHEN** se consulta la dona de situación académica
- **THEN** Meta completa, Al día sin completar y Observados suman exactamente el total de estudiantes sin solaparse

#### Scenario: Comparar escuelas

- **WHEN** se consulta una barra de escuela
- **THEN** al día y observados completan el 100% de su población y el tooltip conserva nombre completo, cantidades y brecha media entre observados; una tabla para lectores de pantalla ofrece los mismos datos

#### Scenario: Participación y ausencia de datos

- **WHEN** se consulta participación del periodo o no hay estudiantes
- **THEN** se cuentan personas únicas con/sin asistencia validada y se excluyen beneficiarios; sin estudiantes se muestra un estado vacío sin inventar un porcentaje

### Requirement: Metas con vigencia continua

El administrador SHALL configurar una meta total vigente desde un año de ingreso en un drawer derecho desde Reporte de alumnos. Una regla SHALL aplicar a todos los años posteriores hasta el año anterior al inicio de la siguiente regla. Alta individual e importación SHALL elegir la regla con mayor año inicial que no exceda el año de ingreso. Agregar o editar reglas MUST NOT modificar metas individuales ya asignadas. Sin regla aplicable, SHALL bloquearse el alta del estudiante.

#### Scenario: Mantener una meta entre cambios de requisito

- **GIVEN** reglas desde 2023 con 50 h y desde 2026 con 120 h
- **WHEN** se agrega un estudiante de 2024, 2025, 2026 o 2027
- **THEN** se le asignan respectivamente 50, 50, 120 o 120 h sin configurar reglas por cada año

#### Scenario: Insertar una nueva vigencia

- **GIVEN** las reglas anteriores y estudiantes ya registrados con su meta individual
- **WHEN** se configura otra meta desde 2028
- **THEN** nuevas altas de 2026 y 2027 conservan la regla de 2026, desde 2028 usan la nueva y ningún estudiante previo cambia su meta

### Requirement: Alta de estudiantes y beneficiarios

Reporte de alumnos SHALL ofrecer Agregar participante en drawer derecho. Ambos tipos SHALL requerir nombre y DNI de ocho dígitos. Estudiantes SHALL requerir código, escuela, año de ingreso y ciclos actual/de carrera enteros positivos con actual no mayor al total. Beneficiarios MUST NOT recibir datos académicos ni clasificación Observado.

#### Scenario: Agregar sin acreditar horas

- **WHEN** se confirma una persona válida con identificadores no repetidos
- **THEN** aparece con cero horas, sin asistencias y con meta vigente solo si es estudiante; se conserva al navegar y se reinicia al recargar

### Requirement: Identificadores únicos de participantes

El DNI SHALL ser único entre participantes y el código entre estudiantes sin distinguir mayúsculas. Alta individual e importación SHALL compartir esta validación y conservar los identificadores como texto.

#### Scenario: Identificador repetido

- **WHEN** una persona tiene el DNI de otro participante o un estudiante repite código
- **THEN** se rechaza el alta y se identifica el campo repetido sin modificar datos existentes

### Requirement: Importación local revisable de XLSX

Reporte de alumnos SHALL ofrecer Importar Excel con plantilla, selección de XLSX, vista previa de personas/metas/errores por fila y confirmación. SHALL aplicar las reglas del alta individual e invalidar todas las apariciones de identificadores repetidos. SHALL agregar el archivo completo solo cuando todas las filas sean válidas. MUST NOT sobrescribir registros, acreditar horas ni enviar el archivo a un servidor.

#### Scenario: Revisar archivo con errores o duplicados

- **WHEN** una fila tiene datos inválidos, falta una meta vigente o repite un identificador
- **THEN** la vista previa muestra su número de fila y errores, bloquea confirmar y no agrega ninguna persona hasta corregir y volver a cargar el archivo

#### Scenario: Archivo compatible

- **WHEN** se carga un XLSX de hasta 5 MB y 1000 personas, sin fórmulas ni macros y con la hoja Participantes y columnas tipo, nombre, dni, codigo, escuela, anio_ingreso, ciclo_actual, ciclos_carrera en ese orden
- **THEN** se revisan sus valores y se conservan ceros iniciales de DNI/códigos almacenados como texto; se rechazan formatos XLS/XLSM, columnas adicionales con datos y libros no compatibles

### Requirement: Resumen administrativo orientado al seguimiento

Resumen general SHALL omitir tabla de estudiantes, eje social y evolución de horas por ciclos. SHALL mostrar al día, observados, meta total cumplida, último ciclo pendiente, avance por escuela, atención prioritaria y oportunidades. Participación SHALL contar estudiantes únicos con asistencia de ejemplo validada en el periodo indicado, sin afirmar validación real de QR/GPS.

#### Scenario: Consultar el dashboard

- **WHEN** se abre Resumen general
- **THEN** aparecen indicadores y agrupación por escuela sin tabla individual, eje social ni evolución por ciclos

### Requirement: Avance esperado individual

Las horas esperadas SHALL ser meta individual dividida entre ciclos de carrera y multiplicada por ciclo actual, sin ajuste por ingreso posterior ni prorrateo del ciclo. Observado SHALL significar acumulado estrictamente menor al esperado. Beneficiarios SHALL quedar excluidos del cálculo académico.

#### Scenario: Observar por avance individual

- **GIVEN** meta de 50 h, carrera de diez ciclos y estudiante en octavo con 35 h
- **WHEN** se consulta su avance
- **THEN** se esperan 40 h, está observado con brecha de 5 h y deja de estar observado al alcanzar exactamente 40 h

### Requirement: Reporte administrativo compacto

La tabla SHALL mostrar nombre, código de estudiante o DNI externo, realizadas/meta asignada para estudiantes, solo realizadas para beneficiarios y horas por ciclo. SHALL omitir carrera, ciclo actual, correo y métricas auxiliares. El nombre SHALL abrir detalle sin padding adicional ni columna/acción separada. SHALL conservar búsqueda, escuela, año y estado.

#### Scenario: Consultar horas y abrir detalle

- **WHEN** el administrador consulta la tabla y selecciona un nombre
- **THEN** ve solo las columnas resumidas y abre el detalle existente de esa persona

#### Scenario: Identificador de participante

- **WHEN** se presenta un estudiante o un beneficiario externo
- **THEN** su celda muestra respectivamente código universitario o DNI, sin mostrar ambos identificadores

#### Scenario: Filtrar columnas por año

- **WHEN** se elige un año en el filtro existente
- **THEN** solo se muestran sus ciclos con horas realizadas y el acumulado sigue incluyendo todos los ciclos

### Requirement: Reporte y detalle sin bloques redundantes

La vista Reporte de alumnos SHALL mostrar un único título general y una descripción breve que explique horas por ciclo, total acumulado y apertura del detalle. SHALL omitir las cards de indicadores superiores y la cabecera de reporte consolidado dentro de la card de filtros y tabla. El detalle SHALL conservar ficha e historial con filtros por ciclo y SHALL omitir el resumen anual/por ciclo y la columna Eje de impacto.

#### Scenario: Consultar el reporte simplificado

- **WHEN** se abre Reporte de alumnos
- **THEN** el encabezado general precede a filtros y tabla, sin indicadores ni cabecera repetida dentro de la card

#### Scenario: Consultar historial por ciclo

- **WHEN** se abre un participante y se selecciona un ciclo del historial
- **THEN** se muestran sus actividades de ese ciclo sin resumen anual/por ciclo ni columna Eje de impacto; Todos restaura el historial completo

### Requirement: Identificación visual de participantes

El reporte SHALL mostrar códigos universitarios sin sufijos internos. Nombre SHALL incluir un birrete azul para estudiante o un icono de voluntariado verde para beneficiario externo, con identificación accesible del tipo.

#### Scenario: Identificar estudiantes

- **WHEN** se consulta una fila de estudiante
- **THEN** el nombre tiene birrete azul e identificación accesible y el código no incluye un sufijo EST

### Requirement: Voluntariados externos de ejemplo

Los datos de ejemplo SHALL incluir beneficiarios con DNI ficticio e historial de voluntariados coherente con las horas por ciclo. El detalle externo MUST NOT mostrar código vacío ni datos académicos inventados. Los filtros SHALL permitir consultar Personas externas; los contadores SHALL incluir ambos tipos como participantes sin contar el grupo externo como escuela.

#### Scenario: Consultar beneficiarios de ejemplo

- **WHEN** se filtra Personas externas y se abre el nombre de un beneficiario
- **THEN** aparece su icono verde, DNI e historial de voluntariados con horas coincidentes con sus ciclos y sin código universitario

### Requirement: Navegación visual por rol

El portal SHALL mostrar las vistas existentes según el rol seleccionado: progreso, actividades y QR para estudiante; además registro de asistencia para asistente; resumen general, reporte, actividades y registro para administrador. Este selector SHALL identificarse como una herramienta de revisión visual, sin representar autenticación efectiva.

#### Scenario: Cambiar de rol

- **WHEN** se selecciona otro rol
- **THEN** se muestra su vista inicial y no quedan abiertos formularios del rol anterior

### Requirement: Vistas navegables en app

Cada vista SHALL tener un `page.tsx` bajo `app/workspace/[role]/` y una URL propia. Los enlaces SHALL permitir navegación cliente, acceso directo y atrás/adelante. `/` y `/workspace` SHALL conducir al progreso del estudiante. Los datos de ejemplo SHALL conservarse durante la navegación cliente y reiniciarse al recargar.

#### Scenario: Navegar entre vistas

- **WHEN** se crea una actividad, se navega a otra vista y se vuelve con el historial del navegador
- **THEN** la URL identifica la vista y la actividad continúa disponible durante la sesión

#### Scenario: Abrir una combinación no disponible

- **WHEN** se abre el registro de asistencia bajo estudiante o los reportes bajo asistente
- **THEN** se presenta una página no disponible en español sin montar el flujo restringido visualmente

### Requirement: Layout compartido en español

Las páginas SHALL reutilizar la presentación de workspace mediante sidebar, contenido y breadcrumbs compartidos. Sus componentes SHALL recibir datos y enlaces reutilizables. La interfaz visible y sus etiquetas accesibles SHALL estar en español; los identificadores de código pueden estar en inglés.

#### Scenario: Usar navegación móvil

- **WHEN** se abre el menú en móvil y se selecciona una vista
- **THEN** aparece un Drawer derecho con etiquetas en español y se cierra después de navegar

### Requirement: Controles del sistema de componentes

Las vistas SHALL utilizar componentes compartidos para controles visibles. Controles nativos sin personalizar y diálogos del navegador MUST requerir instrucción humana expresa. Se conserva HTML semántico dentro de las primitivas.

#### Scenario: Seleccionar filtros

- **WHEN** se abre un selector de rol, actividad o reporte
- **THEN** se presenta el componente Select del sistema visual

### Requirement: Creación y edición en drawer derecho

Toda creación o edición SHALL abrirse en Drawer desde la derecha, también en móvil y cuando el humano use la palabra «modal». Los formularios MUST NOT mostrarse en cards dentro de la vista.

#### Scenario: Editar una actividad

- **WHEN** el administrador pulsa editar
- **THEN** se abre un drawer derecho con sus datos y acciones de guardar y cancelar

### Requirement: Confirmación destructiva

La eliminación SHALL requerir AlertDialog con título, descripción y acción roja de eliminación. Cancelar SHALL conservar el registro.

#### Scenario: Cancelar eliminación

- **WHEN** se solicita eliminar una actividad y luego se cancela
- **THEN** la actividad continúa visible sin cambios

#### Scenario: Confirmar eliminación visual

- **WHEN** se confirma eliminar una actividad
- **THEN** se retira solo de los datos en memoria y se cierra la alerta

### Requirement: Transiciones de drawers

Los drawers SHALL animar entrada y salida del panel y fondo desde el borde correspondiente, respetando movimiento reducido. El editor MUST permanecer montado hasta completar la salida al guardar, cancelar, cerrar con Escape, fondo o botón.

#### Scenario: Cerrar un editor

- **WHEN** el administrador cancela o guarda un formulario
- **THEN** el panel sale hacia la derecha antes de desmontarse y devuelve el foco al origen

### Requirement: Datos y ubicación de actividad

El editor SHALL ordenar nombre, descripción, lugar y mapa, seguidos de Programación y Validación de horas. Nombre, descripción y lugar SHALL ser obligatorios y conservarse en memoria al guardar/editar. Las subsecciones SHALL tener encabezados distinguibles, etiquetas breves y ayuda concisa.

#### Scenario: Explorar y seleccionar ubicación

- **WHEN** se arrastra el mapa con ratón o un dedo y después se hace clic/toque sin arrastrar
- **THEN** el arrastre solo mueve la vista y el clic selecciona la ubicación; el marcador y círculo de radio predeterminado 50 metros permanecen anclados geográficamente al desplazar y ampliar

#### Scenario: Navegar el mapa con teclado

- **WHEN** el mapa tiene foco y se usan flechas, Enter o espacio
- **THEN** las flechas desplazan la vista y Enter/espacio seleccionan el centro; los controles de zoom y recentrado no cambian el punto elegido

### Requirement: Programación visual por opciones

El editor SHALL ofrecer Día único, Todos los días, Cada semana y Personalizado sin Calendar visible. Las fechas SHALL usar campos DD/MM/AAAA con formato automático. Día único SHALL representar una jornada y ocultar la terminación. Semanal SHALL repetir el día de la fecha inicial.

#### Scenario: Día único

- **WHEN** se selecciona Día único y una fecha válida
- **THEN** se guarda una jornada sin controles de terminación ni Calendar visible

### Requirement: Repetición personalizada y terminación

Personalizado SHALL permitir intervalo positivo en días/semanas y selección múltiple de lunes a domingo para frecuencia semanal. Una serie SHALL terminar por fecha inclusiva, cantidad de jornadas o sin fecha de fin. Guardar SHALL conservar la regla en memoria al navegar/editar; cancelar SHALL descartarla.

#### Scenario: Intervalo semanal personalizado

- **WHEN** se configura inicio un lunes, cada dos semanas, lunes y miércoles, y cuatro jornadas
- **THEN** se generan lunes/miércoles de la primera semana y lunes/miércoles dos semanas después, sin incluir jornadas anteriores al inicio

#### Scenario: Fin por fecha

- **WHEN** se selecciona un rango válido con terminación por fecha
- **THEN** solo se incluyen coincidencias desde el inicio hasta el fin inclusive; una fecha final anterior al inicio o un rango sin coincidencias no se guarda

### Requirement: Límites de programación visual

Las series finitas SHALL admitir de 1 a 366 jornadas como límite técnico. Las abiertas SHALL guardar su regla y una muestra de hasta 366 fechas sin presentarla como total. Esta solicitud sustituye para la interfaz la restricción anterior de recurrencia siempre finita; no implementa sesiones reales.

#### Scenario: Serie sin terminación

- **WHEN** se guarda una serie Sin fecha de fin con horas por asistencia
- **THEN** se conserva su regla abierta, se indica sin fecha de fin y se muestran horas unitarias sin un máximo calculado sobre la muestra

### Requirement: Horarios con sugerencias

El horario común SHALL usar HH:mm, hora de Lima, con fin posterior al inicio en el mismo día. Los campos SHALL sugerir horas cada 15 minutos, admitir escritura entre sugerencias y normalizar una hora simple al salir del campo.

#### Scenario: Completar hora

- **WHEN** se escribe 8 y se abandona el campo, o se elige una sugerencia de horario
- **THEN** se muestra 08:00 o la hora elegida; se permite escribir una hora válida entre sugerencias

### Requirement: Configuración visual de horas por actividad

El editor SHALL ofrecer total condicionado a todas las jornadas, total condicionado a un mínimo o cantidad por asistencia, con horas positivas. El mínimo SHALL ser entero entre 1 y el total finito; en series abiertas se limita a 366 en esta vista previa. Asistencia completa SHALL exigir fin. El resumen y las cards SHALL describir la condición de forma breve.

#### Scenario: Mínimo de asistencias

- **WHEN** se configuran cinco jornadas, mínimo tres y diez horas
- **THEN** el resumen exige tres de cinco para diez horas totales sin crédito parcial

#### Scenario: Completar una serie abierta

- **WHEN** se intenta guardar Todas las jornadas con Sin fecha de fin
- **THEN** se solicita definir cuándo termina y no se guarda

#### Scenario: Rechazar mínimo imposible

- **WHEN** el mínimo supera las jornadas finitas o es fraccionario
- **THEN** no se guarda y se presenta un error comprensible

### Requirement: Límites de la configuración visual

La configuración MUST NOT acreditar horas reales ni modificar progreso, reportes o asistencias. El radio del mapa MUST NOT considerarse validación GPS. Integración Google Calendar, calendario propio y ruedas móviles quedan fuera de esta iteración.

#### Scenario: Guardar una configuración visual

- **WHEN** se guarda una actividad con radio y regla de horas
- **THEN** solo se modifica su configuración en memoria, sin acreditar horas ni aplicar geolocalización

### Requirement: Cards de participación resumidas

Las cards SHALL mostrar nombre, descripción de hasta dos líneas, lugar, próxima jornada/horario, recurrencia y condición breve de horas. El distintivo SHALL diferenciar valor por asistencia de total condicionado. Las series abiertas MUST NOT mostrar un máximo basado en su muestra. Todas SHALL ofrecer un enlace Ver detalles.

#### Scenario: Consultar la condición antes de participar

- **WHEN** se muestra una actividad de cinco jornadas que exige tres asistencias
- **THEN** la card resume esa condición y sus horas sin desplegar la programación completa

#### Scenario: Omitir área sin campo de edición

- **WHEN** se presenta una card de actividad para cualquier rol
- **THEN** no muestra la etiqueta de área de los datos de ejemplo, como «Comunidad · Servicio»

### Requirement: Próxima jornada en hora de Lima

La siguiente jornada SHALL calcularse con la referencia temporal del render de la página en hora de Lima. Una jornada de hoy SHALL seguir incluida hasta su fin; después SHALL excluirse. En series abiertas la búsqueda SHALL usar la regla más allá de la muestra. Si terminó una programación finita SHALL indicarse sin jornadas pendientes. No se requiere actualización como reloj en tiempo real.

#### Scenario: Serie abierta posterior a su muestra

- **WHEN** la referencia está después de todas las fechas de muestra de una serie abierta
- **THEN** se calcula la siguiente coincidencia de la regla sin declarar terminada la actividad

### Requirement: Detalle navegable por actividad

Los tres roles SHALL poder consultar `/workspace/[role]/actividades/[activityId]`. La vista SHALL mostrar descripción completa, programación, jornadas y condición de horas. Las series finitas SHALL permitir expandir todas las fechas; las abiertas SHALL identificar la lista como muestra inicial. Un ID ausente SHALL mostrar un estado recuperable con enlace al listado.

#### Scenario: Navegar a detalle y volver

- **WHEN** se abre Ver detalles y se vuelve mediante enlace o historial
- **THEN** la URL identifica la actividad y se conservan los datos en memoria, con Actividades activa y migas de detalle

#### Scenario: Recargar una actividad creada en memoria

- **WHEN** se recarga el detalle de una actividad que no forma parte de los ejemplos iniciales
- **THEN** se indica que no está disponible en la sesión y se permite volver al listado

### Requirement: Ubicación de consulta y acción por rol

El mapa del detalle SHALL permitir explorar, ampliar y ver el radio guardado sin cambiar el punto mediante clic o teclado. Asistente/administrador SHALL poder iniciar registro con la actividad seleccionada; estudiante SHALL consultar sin esa acción. El detalle MUST NOT montar formularios de edición ni acreditar horas.

#### Scenario: Explorar ubicación sin editar

- **WHEN** se desplaza o hace clic en el mapa del detalle
- **THEN** las coordenadas guardadas y el radio de la actividad permanecen sin cambios
