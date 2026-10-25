# Diseño de la interfaz modular

## Context

La demo concentra estado, navegación y vistas en `social-projection-dashboard.tsx`; reportes mezcla fixtures y presentación. Hay selectores HTML y eliminación inmediata. No existe baseline consolidada.

## Goals / Non-Goals

Organizar la primera etapa visual de la aplicación y aplicar las reglas humanas de interacción. No implementar todavía persistencia, permisos efectivos ni reglas institucionales pendientes.

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
