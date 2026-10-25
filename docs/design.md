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
| Mi QR | `mi-qr` | Estudiante, asistente |
| Registrar asistencia | `asistencia` | Asistente, administrador |
| Resumen general | `resumen` | Administrador |
| Reporte de alumnos | `reportes` | Administrador |

Ejemplo: `/workspace/asistente/actividades`. Cada vista admite acceso directo, navegación con enlaces y atrás/adelante. El sidebar identifica la página activa y las migas muestran rol y vista. Una dirección desconocida o combinación no disponible muestra un mensaje en español.

Los datos de actividades se conservan durante la navegación cliente, incluso al cambiar de rol, pero vuelven a los ejemplos iniciales al recargar. Los filtros locales pueden reiniciarse al abandonar su página.

Esta tabla describe las vistas disponibles, no el catálogo completo de la aplicación. Perfil, usuarios/roles y programación completa de sesiones requieren iteraciones posteriores. No inferir permisos efectivos a partir de botones visibles.

Crear/editar una actividad abre el drawer derecho; guardar actualiza los datos durante la sesión y lo cierra. Cancelar descarta el borrador. Eliminar abre la confirmación y solo retira la actividad de memoria al aceptar. Sin actividades, registro presenta un estado vacío. Los identificadores estables permiten actividades con nombres iguales sin afectar otra al editar/eliminar.

Las cards de consulta, indicadores y detalles siguen siendo válidas. El mapa es un selector de ubicación dentro del formulario; cámara, QR y horarios siguen sujetos a las decisiones funcionales pendientes en [OpenSpec](../openspec/changes/establecer-bases/questions.md).
