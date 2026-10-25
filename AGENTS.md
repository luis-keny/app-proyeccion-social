# Instrucciones para agentes de código

## Navegación

1. Leer la tarea humana, este archivo, [README.md](README.md) y [docs/README.md](docs/README.md).
2. Revisar `git status --short` y los AGENTS más específicos de las rutas afectadas. Preservar cambios ajenos.
3. Localizar el cambio OpenSpec y revisar propuesta, specs, diseño, tareas, preguntas y autorización antes de editar. Declarar si falta una baseline consolidada.
4. Consultar solo los documentos relevantes de la tabla siguiente, decisiones relacionadas y código afectado/consumidores. Usar `rg --files` y `rg`.
5. Antes de código Next.js, leer guías relevantes de `node_modules/next/dist/docs/`. Consultar las skills aplicables; no adivinar APIs.

| Tarea | Fuente |
|---|---|
| Propósito, estado y arranque | [README](README.md) |
| Alcance, actores y vocabulario | [Producto](docs/product.md) y specs de la capacidad |
| Módulos, dependencias, servidor/cliente | [Arquitectura](docs/architecture.md) |
| Componentes, drawers, confirmaciones y vistas por rol | [Diseño de interfaz](docs/design.md) |
| Modelo, integridad, RLS y migraciones | [Base de datos](docs/database.md) y skill InsForge correspondiente |
| Convenciones, números mágicos, pruebas y estrategia Git | [Desarrollo](docs/development.md) |
| Entornos, secretos, despliegue y recuperación | [Operación](docs/operations.md) |
| Elecciones duraderas y su estado | [Decisiones](docs/decisions/README.md) |
| Requisitos verificables | `openspec/specs/` y delta specs del cambio |
| Trabajo en curso | `openspec/changes/<cambio>/`: proposal, design, tasks, questions y review |
| Estado realmente implementado | Código y comprobaciones; no una propuesta ni un fixture |

Usar el índice vigente, no nombres de documentos supuestos. Si fuentes se contradicen, registrar la discrepancia y resolver la decisión faltante; no inventar una regla de negocio. Distinguir confirmado, observado, propuesto y pendiente.

## Autoridad humana

El humano especifica requerimientos, acepta propuestas, autoriza impactos y acepta resultados. El agente investiga, propone, documenta y ejecuta alcance autorizado; no se autoaprueba.

- Preparar una propuesta concreta antes de pedir aprobación. La investigación local y documentación solicitadas pueden avanzar dentro del encargo.
- Una petición directa y concreta puede aceptar y autorizar ese alcance. No repetir autorizaciones vigentes; el silencio no constituye aceptación.
- Dependencias, migraciones de código o datos, auth/RLS/roles, operaciones remotas, publicación, despliegues y acciones destructivas deben estar explícitamente cubiertos. Una aprobación documental no los autoriza.
- Si aparece un impacto no cubierto, documentar alternativas y pedir la decisión necesaria; continuar trabajo independiente autorizado.
- Commit, push y PR solo cuando el encargo los autorice.

Registrar en `review.md` del cambio: alcance aceptado, fuente humana, tareas/entorno/condiciones autorizados, aceptación del resultado y autorización de cierre. Son decisiones distintas, aunque una instrucción pueda cubrir varias. No inventar referencias o firmas. Este registro complementa OpenSpec; su CLI no comprueba aprobaciones humanas.

## Flujo SDD

1. **Entender:** contrastar necesidad, estado real, restricciones y decisiones pendientes.
2. **Proponer:** preparar proposal, delta specs, design y tasks. Registrar preguntas bloqueantes. En cambios puramente documentales/tooling, usar las opciones soportadas por la CLI sin inventar requisitos funcionales.
3. **Revisar:** presentar alcance, alternativas, impacto y validación; comprobar aceptación y autorización.
4. **Ejecutar:** realizar tareas pequeñas del alcance autorizado y actualizar documentos mientras se trabaja.
5. **Verificar:** ejecutar checks adecuados; registrar comandos, resultados y límites en tasks. No marcar tareas por intención.
6. **Entregar:** explicar cambios, evidencia y pendientes; identificar documentos actualizados y aceptación faltante.
7. **Consolidar:** con resultado aceptado y cierre autorizado, sincronizar specs y archivar conforme a OpenSpec. Artefactos completos no significan software implementado.

La etapa actual es visual: el humano autorizó separar componentes, vistas y módulos en el cambio `modularizar-interfaz-por-roles`. Aplicar [diseño de interfaz](docs/design.md): controles compartidos, drawer derecho para crear/editar (también si dice «modal») y alerta con acción roja para eliminar. No conectar backend, instalar dependencias ni ampliar el alcance por iniciativa propia. ODD es histórico; no mantener otro backlog activo.

## Git y aislamiento

- Aplicar [Ship / Show / Ask](docs/development.md#estrategia-de-git-ship--show--ask) según riesgo e incertidumbre; indicar la modalidad al preparar la tarea y revisar si cambia su alcance.
- Trabajar por defecto en la rama y checkout actuales. Solo considerar una rama o worktree para modificaciones grandes que justifiquen aislamiento; no crearlos por rutina ni por elegir Show o Ask.
- Comprobar cambios pendientes, base y autorizaciones antes de crear o integrar una rama/worktree. Reutilizar un checkout adecuado y preservar trabajo ajeno.
- Ship/Show operan dentro del alcance aceptado; Ask espera la decisión faltante. Ninguna modalidad autoriza por sí sola commits, push, PR o despliegues.

## Documentación obligatoria

**Cada actualización debe incluir la actualización del documento correspondiente de docs en la misma tarea. No declarar terminado un cambio con documentación desactualizada.**

- Identificar el documento afectado antes de editar y describir allí el estado resultante, contrato, regla, límite o procedimiento modificado.
- Si no cambia el comportamiento, documentar la aclaración técnica pertinente de forma breve. No añadir relleno ni un archivo nuevo por ajuste; la evidencia de ejecución pertenece a tasks.
- Actualizar además specs si cambia comportamiento, ADR si cambia una decisión y review si cambia autorización.
- Actualizar el índice y enlaces cuando se creen, fusionen, renombren o retiren documentos, incluida esta tabla.
- Usar español claro, títulos descriptivos, una ubicación principal por tema y enlaces. No mantener versiones, fechas de edición ni diarios en la documentación humana; Git y OpenSpec conservan el historial. Mantener identificadores técnicos solo cuando sean necesarios para la trazabilidad.
- Verificar enlaces, coherencia y OpenSpec cuando corresponda. Indicar comprobaciones no realizadas y bloqueos.
- Seguir [convenciones de desarrollo](docs/development.md), incluida la regla de números mágicos.
- No imprimir secretos para investigar. CLAUDE referencia este archivo; no duplicar políticas.

Conservar los bloques administrados a continuación.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- INSFORGE:START -->
## InsForge backend

This project uses [InsForge](https://insforge.dev): an all-in-one, open-source Postgres-based backend (BaaS) that gives this app a database, authentication, file storage, edge functions, realtime, an AI model gateway, and payments through one platform.

- **Project:** **app-proyeccion-social** (API base `https://yg4zjvzd.us-east.insforge.app`)
- **Skills:** these InsForge skills are installed for supported coding agents. Reach for them before implementing any InsForge feature instead of guessing the API:
  - `insforge`: app code with the `@insforge/sdk` client (database CRUD, auth, storage, edge functions, realtime, AI, email, and Stripe payments).
  - `insforge-cli`: backend and infrastructure via the `insforge` CLI (projects, SQL, migrations, RLS policies, storage buckets, functions, secrets, payment setup, schedules, deploys).
  - `insforge-debug`: diagnosing failures (SDK/HTTP errors, RLS denials, auth and OAuth issues) and running security or performance audits.
  - `insforge-integrations`: wiring external auth providers (Clerk, Auth0, WorkOS, Better Auth, etc.) for JWT-based RLS, or the OKX x402 payment facilitator.
  - `find-skills`: discovering additional skills on demand.
- **Credentials:** app code reads keys from `.env.local`; the CLI reads `.insforge/project.json`. Never hardcode or commit keys.

Key patterns:

- Database inserts take an array: `insert([{ ... }])`.
- Reference users with `auth.users(id)`; use `auth.uid()` in RLS policies.
- For storage uploads, persist both the returned `url` and `key`.
<!-- INSFORGE:END -->
