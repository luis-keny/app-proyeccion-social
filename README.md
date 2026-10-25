# Proyección Social · UPeU

Sistema para consultar actividades, registrar asistencia y acreditar horas de proyección social. El alcance inicial es una sola sede, sin inscripción previa y con crédito fijo por sesión asistida.

**Estado:** demo visual con datos en memoria. Autenticación, persistencia y permisos reales aún no están verificados.

## Organización

Monolito Next.js con InsForge como base de datos. La estructura de módulos por negocio y su integración están descritas en [arquitectura](docs/architecture.md); todavía no se ha migrado el código.

| Ubicación | Contenido |
|---|---|
| [docs/](docs/README.md) | Producto, arquitectura, datos, desarrollo, operación y decisiones |
| [AGENTS.md](AGENTS.md) | Navegación, reglas, autorizaciones y flujo de agentes |
| [CLAUDE.md](CLAUDE.md) | Referencia a AGENTS.md |
| `openspec/specs/` | Requisitos consolidados; todavía sin baseline aceptada |
| [Cambio de bases](openspec/changes/establecer-bases/proposal.md) | Propuesta, escenarios, tareas, preguntas y revisión |
| `app/`, `components/`, `hooks/`, `lib/` | Código actual de la demo |
| `odd/` | Historial de trabajo; no un backlog activo |

## Desarrollo local

Stack: Next.js, React, TypeScript y Tailwind CSS. Las versiones exactas están en `package.json` y el lockfile.

```bash
npm ci
npm run dev
```

Abrir [localhost:3000](http://localhost:3000). La demo usa datos de ejemplo y no necesita una clave administrativa para explorarlos.

Comprobaciones y convenciones: [desarrollo](docs/development.md).

## Cómo trabajamos

Necesidad → propuesta → aceptación y autorización humanas → ejecución → validación → aceptación del resultado → consolidación.

El humano define necesidades y acepta propuestas; los agentes ejecutan el alcance autorizado y mantienen su documentación. Aprobar un diseño no autoriza por sí solo cambios en datos reales o despliegues. Ver [flujo completo](AGENTS.md).

Los documentos describen el estado vigente, sin versiones ni diarios. No incluir secretos ni datos personales reales en código, ejemplos o Git.
