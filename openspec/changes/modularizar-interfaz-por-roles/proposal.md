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

## Ampliación visual de actividades

Añadir transiciones compartidas de entrada y salida, y esperar su finalización antes de desmontar el editor. El formulario recoge nombre, descripción, lugar y mapa con arrastre independiente de la selección y radio de 50 metros. Programación y Validación de horas se distinguen con encabezados de fondo tenue y textos breves.

Sustituir Calendar visible por opciones Día único, Todos los días, Cada semana y Personalizado, con campos de fecha, intervalo y días semanales. Permitir fin por fecha, cantidad o sin terminación. Ofrecer sugerencias de horario y guardar configuración y descripción en memoria. Las tres políticas son total condicionado a todas las jornadas, total condicionado a un mínimo o valor por asistencia; asistencia completa requiere fin. Las cards explican la condición sin mostrar una muestra de una serie abierta como total.

Sin integración de calendario externo ni crédito real. Las ruedas de reloj móviles y la vista propia de calendario quedan pendientes.

## Cards y detalle navegable

Resumir en cards datos de participación y enlazar Ver detalles a una ruta por actividad. La nueva consulta reúne descripción completa, programación y jornadas, condición de horas y mapa de ubicación sin edición, con navegación por rol y vuelta al listado. Los ejemplos representan las tres reglas de horas. Se conserva estado en memoria y registro para roles operadores, sin inscripción, backend ni dependencias nuevas.

## Limpieza del reporte y detalle

La vista Reporte de alumnos presenta un único título general y una descripción breve sobre horas por ciclo, acumulado y apertura del detalle por nombre. La card comienza en los filtros: no repite título, distintivo ni descripción de reporte consolidado. Se omiten las cuatro cards de indicadores superiores. El detalle conserva la ficha del participante y el historial filtrable por ciclo, sin el bloque de resumen anual/por ciclo ni la columna Eje de impacto.
