# Sprint 9 verification

Closure audit date: **9 August 2026**

## Status

Sprint 9 is **complete** based on the automated quality package and the owner's
manual verification with synthetic citizen, official, and administrator
accounts. The mentor specification describes an external usability study only
when feasible; it was not conducted and is not represented as completed.

## Closure work completed

- corrected WCAG AA contrast on public report facts, citizen/official details,
  notifications, account values, dashboards, and administrative helper text;
- removed mobile horizontal overflow from the citizen and official dashboards;
- added authenticated axe and 390 px responsive coverage for citizen, official,
  and administrator workspaces, including report details;
- added public map/report accessibility, overflow, and private-ID equivalence
  regression coverage;
- verified private authenticated routes use production `private`/`no-store`
  cache headers;
- repaired the Sprint 6 remote verifier so it ignores rejected audit fixtures,
  uses unique run evidence, and is safely rerunnable;
- prevented ESLint from scanning generated Playwright reports and test results;
- strengthened CI with a production-dependency audit, fail-on-error application
  schema lint, and authenticated browser tests against isolated local Supabase;
- updated Next.js evidence to 16.3.0 and applied reviewed patch-level type,
  Supabase CLI, and WebSocket development-tool updates;
- recorded the exact automated and owner-verification evidence without claiming
  an external study.

## Actual automated results

| Gate | Result |
|---|---|
| `npm ci` | **PASS — lockfile reproduced from a clean install** |
| `npm run typecheck` | **PASS** |
| `npm run lint` | **PASS** |
| `npm test` | **PASS — 15 files, 77 tests** |
| `npm run check:dataset` | **PASS — dataset and seed synchronized** |
| `npm run build` | **PASS — Next.js 16.3.0 production build** |
| `npm audit --omit=dev --audit-level=high` | **PASS — 0 vulnerabilities** |
| Full `npm audit --audit-level=high` | **PASS — 0 vulnerabilities** |
| Production Playwright run | **PASS — 17/17 tests** |
| Supabase/pgTAP | **PASS — 5 files, 83/83 assertions** |
| `supabase db lint --schema public --fail-on error` | **PASS — no findings** |
| Remote report/storage verifier | **PASS — 104 public synthetic reports and access boundaries** |
| Sprint 6 remote verifier | **PASS twice consecutively** |
| Auth route verifier | **PASS in development and production modes** |
| Migration comparison and push dry-run | **PASS — local/remote synchronized; remote up to date** |
| Supabase CLI version | **2.113.0** |

The initial dev-tooling advisory was resolved without forcing an invalid ESLint
10 peer graph: the supported ESLint 9.39.5 line now resolves fixed `js-yaml`
4.3.1. The production dependency audit remains a blocking CI gate.

`npm outdated` now reports only deliberately deferred breaking-line upgrades:
`@supabase/ssr` 0.12, Node 26 type definitions, ESLint 10, Lucide 1,
`tailwind-merge` 3, Tailwind CSS 4, and TypeScript 7. They require dedicated
migration testing and are not mixed into a Sprint 9 defect-closure change.

## Browser coverage added during closure

- public landing, login, registration, map, and public report detail;
- private report ID and unknown report ID return equivalent public responses;
- citizen dashboard, report creation, report list, report detail,
  notifications, and account;
- official dashboard, report inbox, report detail, notifications, and account;
- administrator dashboard, SLA, analytics, users, structure, audit, exports,
  and account;
- axe WCAG A/AA analysis, horizontal overflow at 390 px, role boundaries,
  authenticated private-cache policy, keyboard focus, and landing performance.

## GitHub Actions evidence

PR #3 was independently verified on commit `c13bc88` by GitHub Actions run
`31107858264` before this closure pass:

- `validate` — **PASS** in 1m20s;
- `Database security tests` — **PASS** in 2m43s, including 83 pgTAP assertions.

The workflow has since been strengthened with the production audit and
authenticated browser suite. Those workflow edits are locally validated but
must not be described as a new GitHub Actions pass until they are pushed and a
new run completes.

## Evaluation boundary

No external participant study was available. The release evidence therefore
consists of the automated suites listed above and the owner's manual role-based
checks. This limitation is stated explicitly rather than replaced with
simulated participant results.
