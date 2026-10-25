# Monolito y acceso a datos

**Estado:** monolito Next.js e InsForge aceptados; estructura modular y mecanismo de acceso propuestos.

El proyecto necesita límites de negocio claros sin operar varios servicios. Se propone organizar módulos por capacidades y mantener rutas/composición en Next.js. La alternativa de microservicios añade operación sin una necesidad demostrada.

Para datos, se recomienda SDK InsForge encapsulado y un solo mecanismo de migraciones SQL. Drizzle es alternativa si el acceso directo aporta una ventaja concreta; habría que revisar conexiones y autorización.

Ver [arquitectura](../architecture.md). La aprobación de la reorganización documental no autoriza mover código ni integrar backend.
