# Monolito y acceso a datos

**Estado:** monolito Next.js e InsForge aceptados; separación modular del frontend autorizada e iniciada. Capas de negocio/infraestructura y mecanismo de acceso propuestos.

El proyecto necesita límites de negocio claros sin operar varios servicios. Se propone organizar módulos por capacidades y mantener rutas/composición en Next.js. La alternativa de microservicios añade operación sin una necesidad demostrada.

Para datos, se recomienda SDK InsForge encapsulado y un solo mecanismo de migraciones SQL. Drizzle es alternativa si el acceso directo aporta una ventaja concreta; habría que revisar conexiones y autorización.

Ver [arquitectura](../architecture.md). La autorización para separar las vistas está en [review de interfaz](../../openspec/changes/modularizar-interfaz-por-roles/review.md); no autoriza integrar backend.
