# Revisión humana

## Commit autorizado de los ajustes visuales actuales

Fuente: mensaje humano «comitea todos los cambios realizados actualmente». Autoriza un commit local de todos los cambios pendientes en main: simplificación del reporte, códigos sin sufijos, iconos por tipo, beneficiarios y voluntariados de ejemplo, retirada del área en cards y su documentación/OpenSpec. Modalidad Ship en el checkout actual. No autoriza push, despliegue ni cierre/archivo del cambio; el commit no sustituye la aceptación final del resultado.

## Identificación visual y ejemplos de voluntariado

Fuente: mensaje humano «no entiendo esto · EST-00482 quitalo tambien» y solicitud de datos de ejemplo de voluntariados e iconos de colores en Nombre para diferenciar estudiantes y beneficiarios. Autoriza retirar sufijos internos de los códigos, añadir dos ejemplos locales de beneficiarios con voluntariados, distinguir tipos con iconos azul/verde y adaptar su detalle y contadores sin inventar datos académicos. Modalidad Ship sobre el checkout actual, conservando los cambios previos. No autoriza backend, dependencias, commit, push ni despliegue. Resultado y cierre pendientes de aceptación.

## Retirada de área en cards de actividades

Fuente: mensaje humano que pide quitar «Comunidad · Servicio» de las cards porque no aparece en el input y por ahora resulta innecesario. Autoriza retirar la etiqueta de área de las cards compartidas, actualizar documentación y verificar localmente en modalidad Ship, en el checkout actual. Se preservan los cambios pendientes del reporte. Aceptación del resultado y cierre pendientes; no autoriza commit, push ni despliegue.

## Simplificación autorizada del reporte administrativo

Fuente: mensaje humano que pide simplificar la tabla, retirar la acción de detalle duplicada porque ya existe en el nombre, no añadir padding al nombre, omitir carrera/ciclo/correo, mostrar código para estudiantes o DNI para beneficiarios externos, conservar realizadas/totales, limitar cada ciclo a horas realizadas y mantener los filtros propuestos.

Autoriza este ajuste visual local, su modelo de presentación, documentación y comprobaciones en modalidad Ship en el checkout actual. Se conservan los ejemplos existentes de estudiantes; admitir el identificador externo en la presentación no autoriza backend ni acceso de personas externas. Aceptación del resultado y cierre pendientes; sin autorización nueva de commit, push, PR ni despliegue.

## Alcance aceptado y autorizado

Fuente: mensaje humano de esta conversación: «primero lo manejaremos de manera visual los modulos y acciones que tendra cada rol» y «comenzamos a separar por componentes y vistas y modulos».

Autoriza la separación local del frontend y su documentación en esta etapa visual. Confirma controles no nativos salvo indicación expresa, drawer derecho incluso cuando diga «modal», creación/edición siempre dentro del drawer y alerta roja para eliminar.

El siguiente mensaje humano pide «separar las vistas» dentro de app, «algo navegable», reutilizar la presentación de `app/workspace/page.tsx`, modificar sus componentes internos para hacerlos reutilizables y pasar la aplicación a español, permitiendo código en inglés. Esta instrucción autoriza rutas locales por vista y rol, layout compartido y adaptación/traducción de los componentes del scaffold. El «okey» da continuidad a la entrega, con estas ampliaciones solicitadas; no se interpreta como aceptación final de sus resultados ni autorización de cierre.

## Límites

No autoriza backend, dependencias nuevas, cambios de datos reales, autenticación/RLS, operaciones remotas, push, PR o despliegue. Amplía la etapa documental previa únicamente para este trabajo visual. Las decisiones funcionales pendientes no se dan por aceptadas.

El mensaje humano «okey comitea todo» autoriza crear un commit local con todos los cambios pendientes del checkout actual, incluidos código, documentación y OpenSpec. No autoriza push ni cierre o archivo del cambio.

## Resultado y cierre

Aceptación del resultado y autorización de cierre pendientes. No sincronizar ni archivar automáticamente.

## Ampliación autorizada: programación y horas

Fuente: mensaje humano de esta conversación que solicita animaciones de entrada/salida de drawers y configurar días y validación de horas, con ejemplos de asistencia completa, 3 de 5 días o una hora por asistencia. Autoriza implementar localmente esta ampliación visual y documentarla en el cambio vigente. Se interpreta el mínimo como condición para obtener el total del bloque y el valor por asistencia como configurable. El resultado queda para revisión humana.

Google Calendar y una vista de calendario propia se posponen expresamente. Se conservan los límites: datos en memoria, sin backend, dependencias nuevas, migraciones, operaciones remotas, commit, push, PR o despliegue. El permiso anterior de commit correspondió a aquella entrega, no autoriza uno nuevo. No hay aceptación de este resultado ni autorización de cierre.

## Refinamiento de formulario, mapa y recurrencia

Fuente: mensaje humano que solicita nombre, descripción, lugar y mapa en ese orden, arrastre con selección por clic y radio predeterminado de 50 metros; programación similar a Google Calendar sin componente Calendar visible, día único, diaria, semanal y personalizada, lunes a domingo, intervalo, rango o sin terminación; horarios con autocompletado y texto reducido en secciones diferenciadas.

Autoriza estos cambios visuales locales en modalidad Show, conservando cambios previos del checkout. Acepta las tres opciones de validación de horas y solicita simplificar su presentación. Sustituye expresamente para esta interfaz la restricción de recurrencia siempre finita. Las ruedas móviles pueden quedar pendientes según su mensaje y así se registran. Integración con Google Calendar, backend y calendario propio siguen fuera del encargo; no autoriza commit, push, despliegue ni cierre.

Interpretación implementada para revisión: asistencia completa requiere fin; las series abiertas admiten mínimo o crédito por asistencia y no muestran un máximo basado en la muestra de fechas. No se interpreta la conformidad parcial como aceptación del resultado completo ni autorización de archivo.

## Cards y página de detalle

El mensaje humano «ahora si esta mejor» expresa conformidad con el refinamiento visual anterior. Pide mostrar esa configuración en cards con información relevante y permite generar una vista de detalles. Autoriza implementar localmente cards resumidas y una página navegable de consulta por actividad para los tres roles, con sus pruebas y documentación. Se completan ejemplos locales para revisar las tres reglas de horas; no se modifican datos reales. Modalidad Show en el checkout actual, preservando lo pendiente.

Esta conformidad no autoriza cierre/archivo del cambio completo ni commit, push, backend o despliegue. La nueva entrega sigue pendiente de aceptación humana.

## Autorización de commit del conjunto actual

Fuente: mensaje humano «comitea todo» después de la entrega de cards y detalle. Autoriza crear un commit local con todos los cambios pendientes del checkout actual en main, incluidos programación, horas, mapa, transiciones de drawers, cards, detalle, documentación y OpenSpec. Mantiene la modalidad Show y no requiere crear una rama. No autoriza push, despliegue ni cierre/archivo del cambio; no se interpreta el commit como aceptación final de todos los resultados.

## Limpieza de reporte y detalle de participantes

Fuente: comentarios humanos sobre retirar los indicadores superiores y el resumen por ciclo, y petición directa de cambiar título/descripción general, quitar la cabecera de reporte consolidado y la columna de eje de impacto del detalle porque no existe. Autoriza implementar y verificar esta limpieza visual local y actualizar documentación y delta spec. Modalidad Ship en el checkout actual, inicialmente limpio. Se conservan filtros, ficha e historial. Sin backend, dependencias, commit, push ni despliegue. Aceptación del resultado y cierre pendientes.

## Commit autorizado de la limpieza de reportes

Fuente: mensaje humano «comitea todo» después de la entrega de limpieza del reporte y detalle. Autoriza crear un commit local de todos los cambios pendientes en main, incluidos código, docs y OpenSpec. Modalidad Ship en el checkout actual. No autoriza push, despliegue ni cierre/archivo; la aceptación final del resultado continúa pendiente.
