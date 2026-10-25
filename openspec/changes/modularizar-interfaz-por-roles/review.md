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
