## ADDED Requirements

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
