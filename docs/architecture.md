# Arquitectura

## Enfoque

Monolito Next.js con InsForge como base de datos PostgreSQL. La organización propuesta combina rutas de Next.js con módulos por capacidades de negocio: Screaming Architecture y responsabilidades internas guiadas por SOLID.

El frontend ya separa la composición del portal y las vistas por capacidad en `modules/`. Los datos siguen en memoria. Las capas de dominio, aplicación e infraestructura son un objetivo posterior; no se crean carpetas vacías ni se considera implementado el backend.

```text
app/                    # Rutas, layouts y composición
modules/
  portal/               # Navegación por rol y composición de vistas
  activities/           # Modelo visual, fixtures, listado, editor y mapa
  attendance/           # Vista de registro y ciclo de cámara/GPS
  students/             # Vistas de progreso y QR de ejemplo
  reports/              # Fixtures y vista de dashboard/reporte
components/ui/          # Primitivas compartidas
lib/                    # Utilidades e infraestructura transversal mínima
```

Crear dentro de cada módulo solo lo necesario:

`app/page.tsx` y `app/workspace/page.tsx` redirigen al progreso del estudiante. `app/workspace/layout.tsx` mantiene el proveedor de datos en memoria y el layout compartido, adaptado desde el scaffold de workspace: `SidebarProvider`, `AppSidebar`, `SidebarInset`, encabezado y breadcrumbs. Recibe las páginas como `children`; no selecciona su contenido con un estado de vista.

Cada capacidad dispone de un `page.tsx` bajo `app/workspace/[role]/`: `progreso`, `actividades`, `mi-qr`, `asistencia`, `resumen` y `reportes`. El segmento de rol admite `estudiante`, `asistente` y `administrador`. Las páginas esperan los parámetros asíncronos de Next.js y validan la matriz visual antes de componer su vista. Combinaciones no disponibles presentan una página en español; no representan un sistema de autorización real.

`modules/portal/navigation.ts` centraliza rutas, nombres, títulos y visibilidad. `Link` resuelve navegación y estado activo; cambiar de rol lleva a su vista inicial. `AppSidebar` recibe marca, navegación e identidad; `NavMain` recibe enlaces y grupos; `NavUser` recibe identidad y accesos existentes, sin acciones ficticias de cuenta o facturación.

El proveedor de workspace conserva actividades y selección al navegar entre vistas o roles y usar el historial del navegador. Recargar reinicia los fixtures. Cada vista conserva sus filtros y estado transitorio solo mientras está montada. Actividades usa identificadores estables, editor en Drawer derecho y AlertDialog para eliminar. Asistencia libera la cámara al salir o cambiar de actividad y muestra estado vacío si no quedan registros. Reportes conserva su presentación con fixtures separados.

Los módulos futuros de identidad, sesiones/recurrencia y la integración real requieren definición específica. La navegación por rol es presentación; no sustituye permisos de servidor. Ver [diseño](design.md).

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
