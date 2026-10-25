# Revisión humana

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
