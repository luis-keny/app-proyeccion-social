# Proyección Social · UPeU

Sistema para consultar actividades, registrar asistencia y acreditar horas de proyección social. El alcance inicial es una sola sede, sin inscripción previa. El editor visual permite programar jornadas y configurar horas por asistencia, asistencia completa o un mínimo de jornadas; la acreditación real sigue pendiente.

**Estado:** aplicación en construcción, en etapa visual por roles y módulos, con datos de ejemplo en memoria. Autenticación, persistencia y permisos reales aún no están implementados/verificados.

## Organización

Monolito Next.js con InsForge previsto como base de datos. El frontend se organiza por capacidades en `modules/`; la integración está descrita en [arquitectura](docs/architecture.md). Las reglas visuales están en [diseño de interfaz](docs/design.md).

Las vistas tienen rutas en `app/workspace/[role]/` y comparten el layout de workspace con sidebar y navegación en español. El acceso inicial conduce a `/workspace/estudiante/progreso`; el selector permite explorar los demás roles.

| Ubicación | Contenido |
|---|---|
| [docs/](docs/README.md) | Producto, arquitectura, datos, desarrollo, operación y decisiones |
| [AGENTS.md](AGENTS.md) | Navegación, reglas, autorizaciones y flujo de agentes |
| [CLAUDE.md](CLAUDE.md) | Referencia a AGENTS.md |
| `openspec/specs/` | Requisitos consolidados; todavía sin baseline aceptada |
| [Cambio de bases](openspec/changes/establecer-bases/proposal.md) | Propuesta, escenarios, tareas, preguntas y revisión |
| [Cambio de interfaz](openspec/changes/modularizar-interfaz-por-roles/proposal.md) | Separación visual, reglas de diseño y validación |
| `app/`, `modules/`, `components/`, `hooks/`, `lib/` | Rutas, capacidades visuales y componentes compartidos |
| `odd/` | Historial de trabajo; no un backlog activo |

## Desarrollo local

Stack: Next.js, React, TypeScript y Tailwind CSS. Las versiones exactas están en `package.json` y el lockfile.

```bash
npm ci
npm run dev
```

Abrir [localhost:3000](http://localhost:3000). La etapa visual usa datos de ejemplo y no necesita una clave administrativa para explorarlos.

Comprobaciones y convenciones: [desarrollo](docs/development.md).

## Cómo trabajamos

Necesidad → propuesta → aceptación y autorización humanas → ejecución → validación → aceptación del resultado → consolidación.

El humano define necesidades y acepta propuestas; los agentes ejecutan el alcance autorizado y mantienen su documentación. Aprobar un diseño no autoriza por sí solo cambios en datos reales o despliegues. Ver [flujo completo](AGENTS.md).

Los documentos describen el estado vigente, sin versiones ni diarios. No incluir secretos ni datos personales reales en código, ejemplos o Git.
