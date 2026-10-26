# Diseño de la interfaz modular

## Context

La demo concentra estado, navegación y vistas en `social-projection-dashboard.tsx`; reportes mezcla fixtures y presentación. Hay selectores HTML y eliminación inmediata. No existe baseline consolidada.

## Goals / Non-Goals

Organizar la primera etapa visual de la aplicación y aplicar las reglas humanas de interacción. No implementar todavía persistencia, permisos efectivos ni reglas institucionales pendientes.

## Reporte administrativo simplificado

Tabla compacta con nombre como única apertura del detalle y botón compartido sin padding adicional. Identificador según tipo explícito del participante visual: código de estudiante sin sufijos internos o DNI de beneficiario externo. Birrete azul e icono de voluntariado verde distinguen tipos con etiquetas accesibles. Horas acumuladas realizadas/totales y una celda de horas realizadas por ciclo, con encabezado único. Se retiran avatar, información académica/contacto, métricas auxiliares y columna de detalle. Se conservan búsqueda, escuela, año y estado; Personas externas permite filtrar beneficiarios sin contarlos como escuela. Dos ejemplos externos tienen historial coherente de voluntariados, DNI ficticios y detalle sin campos académicos ni código vacío. Los contadores incluyen ambos tipos como participantes. El tipo externo no define autenticación ni reglas de acreditación.

## Decisions

- El portal compone vistas; cada capacidad reúne sus componentes en `modules/<capacidad>/ui`. Datos de ejemplo y tipos se separan de la presentación.
- Conservar la estética institucional actual y los componentes instalados. Evitar capas de dominio/infraestructura vacías.
- La navegación centraliza visibilidad por rol. Es una ayuda visual, no una autorización de servidor.
- Usar `Drawer` con `swipeDirection="right"`; no sustituirlo por Sheet ni convertirlo en panel inferior en móvil.
- Crear/editar dentro del drawer. Eliminar mediante AlertDialog con acción `destructive`; cancelar conserva los datos.
- «No nativos» significa controles visibles mediante componentes compartidos, conservando HTML semántico y accesibilidad en su implementación.
- Reutilizar `SidebarProvider`, `AppSidebar`, `SidebarInset` y breadcrumbs del scaffold `/workspace` en un layout persistente. `AppSidebar`, `NavMain` y `NavUser` reciben datos y enlaces, sin marca ni acciones comerciales ficticias.
- Cada vista tiene `page.tsx` en `app/workspace/[role]/`; roles y segmentos de vista están en español. `Link` y el router sustituyen la selección interna de pantallas. `/` y `/workspace` conducen al progreso del estudiante; cada entrada de rol conduce a su inicio.
- Mantener las actividades en un proveedor del layout de `/workspace`: se conservan al navegar con enlaces, atrás/adelante o cambiar de rol; recargar reinicia los datos de ejemplo.
- Validar combinaciones visuales de rol/vista en las páginas. Una combinación no disponible muestra una página en español; esto no implementa autorización real.
- En móvil, conservar la composición del sidebar pero usar Drawer derecho y cierre tras elegir un enlace. Todas las etiquetas visibles/accesibles del layout se presentan en español.

## Risks / Trade-offs

La extracción puede alterar estado entre vistas y dejar imports rotos. Conservar los datos de actividades en el portal durante la sesión, comprobar TypeScript, lint y build, y revisar flujos visuales cuando el entorno lo permita. El selector de rol y los datos siguen siendo de ejemplo.

## Migration Plan

Extraer capacidades sin backend, sustituir el portal conmutado por rutas de vistas y actualizar imports y documentación. Mantener los componentes de biblioteca no utilizados para evitar cambios ajenos al alcance.

## Open Questions

Las reglas de identidad, sesiones, crédito y roles pendientes siguen en el cambio de bases. Perfil, gestión de usuarios/roles y programación completa se definirán en siguientes iteraciones visuales; no inventar sus acciones.

## Formulario, programación y horas

Ordenar nombre, descripción, lugar y mapa antes de Programación y Validación de horas. Encabezados con fondo tenue, mayor altura e iconos; campos relacionados en dos columnas y etiquetas cortas. Preservar la estética y las primitivas instaladas.

Separar centro del mapa y coordenadas seleccionadas. Pointer Events con captura distinguen arrastre de clic usando umbral técnico de 6 píxeles. Proyectar con Web Mercator, envolver longitud y limitar latitud; representar un círculo de 50 metros convertido según zoom/latitud. Zoom y atribución no seleccionan puntos. Flechas y Enter permiten explorar y seleccionar con teclado. El radio solo es referencia visual, sin permisos GPS ni regla de acreditación.

Guardar regla de recurrencia junto con fechas derivadas: día único, diaria, semanal y personalizada con intervalo y días de lunes a domingo. Fechas DD/MM/AAAA sin Calendar visible. Fin inclusivo por fecha, cantidad o sin terminación. Calcular saltando a coincidencias, con hasta 366 jornadas finitas o una muestra de 366 en series abiertas, sin presentarla como total. Conservar una regla abierta permite backend futuro sin enumeración infinita.

Horas por asistencia o total de bloque condicionado a mínimo/completo. Asistencia completa necesita una serie con fin; el mínimo no supera el total finito, y en series abiertas se limita a 366 para esta vista previa. La serie abierta por asistencia muestra valor unitario y no un máximo inventado. Correcciones, sesiones reales y efectos retroactivos quedan pendientes del backend. El horario HH:mm admite sugerencias de 15 minutos y escritura libre; las ruedas móviles se posponen.

Usar transiciones de Base UI, duración CSS compartida y movimiento reducido. Montar raíz cerrada, abrir y desmontar solo al completar la salida, sin temporizadores de cierre.

## Cards y consulta de actividad

Omitir en las cards la etiqueta de área procedente de fixtures: no corresponde a un campo del editor actual. Conservar el resto de la información y acciones.

Crear `/workspace/[role]/actividades/[activityId]` con parámetros asíncronos y un componente cliente que resuelve por ID desde el proveedor. Centralizar URLs en navegación y formato de programación en presentation.ts. La referencia temporal del servidor evita diferencias de hidratación; la siguiente jornada se evalúa en Lima y para series abiertas se busca en la regla, incluso fuera de la muestra inicial.

Cards con descripción recortada, badge unitario/total, lugar, siguiente fecha/horario, recurrencia y condición de horas. Footer con enlace de detalles y acción de registro según rol. El detalle presenta descripción sin recorte, metadatos, jornadas expandibles y mapa solo de consulta. Las series abiertas identifican su lista como muestra inicial. Mantener sidebar y migas coherentes y un estado recuperable para IDs ausentes tras recargar datos en memoria. Los ejemplos se completan con reglas/fechas deterministas, sin inventar datos de una actividad real.
