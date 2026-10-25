# Arquitectura

## Enfoque

Monolito Next.js con InsForge como base de datos PostgreSQL. La organización propuesta combina rutas de Next.js con módulos por capacidades de negocio: Screaming Architecture y responsabilidades internas guiadas por SOLID.

La aplicación actual sigue siendo una demo en `app/` y `components/`. La estructura siguiente es el objetivo propuesto; esta reorganización documental no mueve código.

```text
app/                    # Rutas, layouts y composición
modules/
  identity/
  activities/           # Incluye sesiones y recurrencia
  attendance/           # Incluye crédito e historial
  students/             # Perfil y progreso
  reports/
components/ui/          # Primitivas compartidas
lib/                    # Utilidades e infraestructura transversal mínima
```

Crear dentro de cada módulo solo lo necesario:

| Área | Responsabilidad | Dependencias |
|---|---|---|
| Dominio | Tipos, reglas e invariantes | Sin React, Next.js ni SDK |
| Aplicación | Casos de uso | Dominio y contratos pequeños |
| Infraestructura | Persistencia y servicios externos | Contratos del módulo y SDK |
| UI | Presentación e interacción | Entradas públicas seguras |
| Composición en servidor | Conectar casos de uso y adaptadores | Implementaciones concretas |

Evitar imports profundos entre módulos y dependencias circulares. Separar exports de servidor y cliente; un archivo compartido no debe arrastrar credenciales ni código exclusivo de servidor.

## Next.js

Las rutas componen pantallas y entradas, sin duplicar reglas de negocio. Usar componentes de servidor para lecturas y componentes cliente para cámara, QR, ubicación y formularios interactivos.

Cada mutación valida identidad, permisos y parámetros en servidor. Elegir Server Actions o Route Handlers según el consumidor, sin crear una API adicional por rutina. Las respuestas personales no deben compartirse por caché entre usuarios.

Antes de implementar, consultar las guías de estructura, servidor/cliente, autenticación y mutaciones de Next.js instaladas en el proyecto.

## Acceso a InsForge

Recomendación: SDK oficial encapsulado en adaptadores del servidor y migraciones SQL gestionadas por un único mecanismo. No consultar tablas desde componentes repartiendo reglas entre botones.

`Interfaz → entrada Next.js → caso de uso → adaptador InsForge → PostgreSQL`

Usar contexto de usuario y RLS para operaciones ordinarias. Las credenciales administrativas quedan reservadas a operaciones privilegiadas explícitamente autorizadas. El proveedor de autenticación sigue pendiente.

Para registrar asistencia y crédito de forma atómica, diseñar una operación transaccional de base de datos invocada por RPC. Varias llamadas SDK independientes no forman una transacción.

Drizzle queda como alternativa si se justifica acceso SQL directo. Adoptarlo requeriría revisar conexión, pooling, autorización y propiedad de las migraciones. No añadir SDK y ORM como dos caminos equivalentes sin una responsabilidad definida.

Referencia: [SDK oficial](https://github.com/InsForge/InsForge-sdk-js/blob/main/SDK-REFERENCE.md).

## Seguridad y consistencia

El servidor determina operador, hora y crédito; el cliente no puede asignarse roles ni acreditar horas. El QR identifica, pero no autoriza ni sustituye confirmación humana. Definir formato, expiración y revocación antes de implementarlo.

Los cambios de reglas requieren autorización e historial. La base de datos aplica integridad y permisos; la UI no constituye una frontera de seguridad. Ver [modelo de datos](database.md).
