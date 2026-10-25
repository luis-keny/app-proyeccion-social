# Diseño de las bases

## Context

La demo ofrece UI, cámara, mapa y reportes de ejemplo; no demuestra persistencia ni permisos. Ver [producto](../../../docs/product.md).

## Goals / Non-Goals

Ofrecer documentación humana breve y navegación clara para agentes. Fuera del alcance: implementar backend, migrar código, instalar dependencias o desplegar.

## Decisions

- README explica propósito y arranque; AGENTS concentra navegación, autorizaciones y SDD.
- Docs explica estado vigente: [arquitectura](../../../docs/architecture.md), [datos](../../../docs/database.md), [desarrollo](../../../docs/development.md), [operación](../../../docs/operations.md) y [decisiones](../../../docs/decisions/README.md).
- Producto absorbe reglas y vocabulario del prompt histórico. Retirar originales después de preservar contenido útil.
- Preguntas viven en [questions.md](questions.md); autorizaciones en [review.md](review.md); trabajo y evidencia en tasks.
- Sin numeración de lectura, versiones documentales ni diarios en docs. Un documento por tema y enlaces para ampliar.

El modelo de datos, mecanismo SDK/ORM y estructura de código siguen propuestos.

## Risks / Trade-offs

Reducir contenido puede perder reglas o romper referencias. Contrastar fuentes, conservar escenarios y comprobar enlaces y rutas retiradas. No confundir aceptación de la documentación con autorización de infraestructura.

## Migration Plan

Crear documentos consolidados, actualizar consumidores y retirar originales redundantes. Conservar bloques administrados de AGENTS. No mover archivos de aplicación. Si se detecta una omisión, recuperar el contenido desde Git o las fuentes conservadas y corregir el documento responsable.

## Open Questions

Ver [preguntas pendientes](questions.md). Resolver identidad, ciclos, permisos y correcciones antes de fijar DDL/RLS.
