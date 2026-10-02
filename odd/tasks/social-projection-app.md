# Build Social Projection Attendance App

## Objective
Build a responsive application that records social-projection attendance and credited hours for students using institutional accounts.

## Problem and Why
The repository currently provides Clerk authentication but still shows a starter home page. Students, assistants, and administrators need distinct, usable workflows for activities, attendance, and cycle totals.

## Scope
- Student: cumulative hours across all cycles, attended activities grouped by cycle with subtotals, published activities with individual detail pages, and a student-code QR.
- Assistant: all student views plus QR lookup and explicit identity confirmation before attendance is recorded.
- Administrator: activity scheduling/location/credit rules, users and roles, and a cycle-hours table with student detail.
- Responsive navigation inspired by shadcn `sidebar-07`, adapted to one project, with profile access always available.
- Authorized visual-only slice: replace `/` starter experience with a polished Spanish-language app shell and local demo student, assistant, and administrator dashboard flows. No persistence is implied.

## Constraints
- Only institutional `@upeu.edu.pe` accounts can access the app, including the initial administrator. No personal address belongs in code or Git history.
- No remote InsForge/Clerk operations or credential/session discovery without separate authorization.
- Preserve the existing Clerk implementation and read installed Next.js 16 documentation before code changes.
- TDD is explicitly deferred by the user until backend/database integration. For this visual-only slice, do not add or run tests; test runner is none until that integration. Run `npm run lint` and `npm run build`.
- Work on `codex/social-projection-visual`; use Conventional Commits without AI attribution. Do not push or create a PR.
- Delivery strategy: one local work-unit commit on the authorized feature branch; no remote delivery.
- The ~400-line ODD task heuristic is advisory, not a code-golf constraint.

## Tasks
- [ ] SOCIAL-1 — Establish the responsive role-aware shell and student read views with local typed fixture data; prove cumulative and cycle subtotals with tests. Route: delegated direct (multiple non-trivial UI/test files and preparatory reading).
- [ ] SOCIAL-2 — Add activity detail, student QR, and assistant scan/identity-confirmation flow with focused tests. Route: delegated direct (multiple routes/components and camera behavior).
- [ ] SOCIAL-3 — Add administrator activity, user-role, cycle-hours, and student-detail views with responsive table behavior and focused tests. Route: delegated direct (multiple routes/components and business forms).
- [ ] SOCIAL-4 — Add secure persisted domain data and authorization boundaries, then replace fixtures; validate against the authorized backend environment. Route: delegated direct (cross-cutting auth/data work). Remote validation requires separate authorization.
- [ ] SOCIAL-5 — Replace the `/` starter experience with an editorial, responsive Spanish-language dashboard shell and role-aware student/assistant/admin demo flows; explicitly label local fixture/demo state and do not imply persistence. Route: delegated direct (multiple non-trivial UI files; preparatory reading and writing handled together).

## Acceptance Criteria
- Each role sees only its authorized navigation and actions; assistants retain student capabilities.
- Student totals span every cycle; attendance history shows cycle subtotals and activity details.
- QR scan does not record attendance until the assistant confirms the matched student.
- Activity configuration supports multiple day/time ranges, map-selected location/radius, and explicit attendance/credit rules.
- Administrative cycle totals are newest-first; student name remains visible during horizontal table scrolling, while sensitive identifiers are not displayed in the table.
- Institutional email restrictions and server-side authorization are enforced before persisted data is exposed or changed.
- Desktop and mobile layouts are usable; relevant checks and exact outcomes are recorded per task.
- SOCIAL-5: `/` has a distinctive institutional visual identity, responsive navigation, usable role switching and local dashboard navigation, meaningful headings, visible keyboard focus, reduced-motion support, and a clear demo-only/non-persistent notice. Existing Clerk code remains untouched.

## Checks and Evidence
- Initial state: clean `main` at `174af53`; created `codex/social-projection-visual` before source changes.
- Project inspection: Next.js 16.3.8 App Router; `/` was Create Next App starter; `app/layout.tsx` has no Clerk provider or Clerk package reference; no feature data layer.
- Next.js docs read before implementation: `01-app/01-getting-started/03-layouts-and-pages.md`, `11-css.md`, `13-fonts.md`, and `05-server-and-client-components.md`.
- `npm test`: intentionally not run; user explicitly deferred TDD until backend/database integration and this visual-only scope has no test runner.
- `npm run lint`: exit 0; no errors. Three existing warnings remain in `.agents/skills/tailwind-v4-shadcn/templates/theme-provider.tsx` at lines 35, 65, and 69 (`no-unused-vars`).
- `npm run build`: exit 0; Next.js 16.3.8 production build and TypeScript passed; `/`, `/_not-found`, and `/workspace` prerendered as static routes.
- Runtime smoke test: not requested/pending.
- Work-unit commit identity and RDD assessment: pending; delegated parent handles RDD verification gate. Do not start native RDD here.

## Progress
- Previous recovered plan #2159 had SOCIAL-1 through SOCIAL-4 unchecked; this checkout has only the starter `/` and no app feature flows. Preserved all existing tasks and progress without claiming earlier work exists in this checkout.
- Added SOCIAL-5 as the current user-authorized visual-only scope before source changes. Route: delegated direct.
- TDD/test runner was updated to match the user's explicit deferral: no test additions or execution for this visual slice; lint and build are the required checks.
- Engram mirror write failed before source implementation with `unknown_session` for a runtime-supplied unregistered session ID; no session ID was passed by this worker. Local progress retained; mirror pending.
- SOCIAL-5 implementation is complete locally; commit identity and task checkbox update are pending.

## Next Step
Commit SOCIAL-5, record the commit identity here, then mirror the full updated document when Engram session identity is available.
