# Modularizar la interfaz por roles

## Why

El usuario solicita pasar de la demo a una aplicación, empezando por organizar visualmente módulos y acciones por rol. La pantalla monolítica dificulta revisar y ampliar los flujos.

## What Changes

- Separar composición del portal, navegación por rol y vistas de actividades, asistencia, progreso/QR y reportes.
- Dar a cada vista una página en `app/workspace/[role]/` y enlaces navegables, reutilizando el layout de sidebar, contenido y breadcrumbs de `/workspace`.
- Adaptar los componentes del scaffold para recibir datos reutilizables y presentar toda la interfaz en español, incluidas etiquetas accesibles y errores de navegación.
- Mantener datos de ejemplo explícitos durante esta etapa visual.
- Documentar y aplicar controles del sistema de componentes, drawers derechos para altas/ediciones y confirmación destructiva roja para eliminar.

## Capabilities

### New Capabilities

- `role-based-interface`: navegación visual por rol y reglas de interacción compartidas.

### Modified Capabilities

Ninguna. No existe una baseline consolidada; las capacidades del cambio de bases siguen pendientes de aceptación.

## Impact

Código cliente y organización local de archivos, documentación y OpenSpec. Sin dependencias nuevas, backend, autenticación/RLS, migraciones de datos, operaciones remotas, commits o despliegue. Modalidad Show en el checkout actual.
