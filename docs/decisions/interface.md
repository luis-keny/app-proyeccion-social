# Interacciones de la aplicación

## Estado

Aceptada por instrucción humana para la etapa visual. El alcance local y la fuente están registrados en [review de interfaz](../../openspec/changes/modularizar-interfaz-por-roles/review.md).

## Decisión y motivo

Usar controles del sistema de componentes, drawers derechos para crear/editar y confirmación destructiva roja para eliminar. El humano solicita consistencia entre módulos y evitar formularios abiertos dentro de las vistas.

## Alternativas y consecuencias

Se descartan controles nativos visibles sin autorización expresa, formularios de alta/edición en cards y modales centrados para esos flujos. La excepción confirmada es AlertDialog para eliminar. Las primitivas conservan HTML semántico y accesibilidad.

El contrato completo y la matriz visual se mantienen en [diseño de interfaz](../design.md), sin duplicarlos aquí. La decisión no autoriza persistencia ni cambios de permisos.

Por ampliación humana, la presentación reutiliza el scaffold de workspace mediante un layout compartido y componentes parametrizados. Cada vista tiene una página en `app/` y una URL, con navegación cliente y textos en español. Se sustituye la conmutación de pantallas por estado local para admitir enlaces directos e historial del navegador.
