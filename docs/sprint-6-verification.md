# Sprint 6 verification

Ky dokument mban kriteret e pranimit dhe provat e ekzekutuara për workflow-n
zyrtar. Sprinti nuk konsiderohet i mbyllur derisa migration-i të aplikohet në
projektin `dev`, smoke test-i remote të kalojë dhe pgTAP të kalojë lokalisht ose
në GitHub Actions.

## Fusha e Sprintit 6

| Kriteri | Implementimi | Prova |
|---|---|---|
| Inbox i filtrueshëm dhe i autorizuar | `/official/reports`, RLS sipas rolit/departamentit | Typecheck, lint dhe build kalojnë |
| Panel operativ zyrtar | `/official`, metrika dhe radhë vëmendjeje vetëm mbi scope-in RLS | Unit tests + route smoke |
| Detaj privat i raportit për stafin | `/official/reports/[id]` | Query-t lexojnë vetëm përmes RLS |
| State machine i detyrueshëm | `transition_report_workflow` + trigger-i ekzistues | Unit tests + `sprint6_workflow.test.sql` |
| Verifikim, caktim dhe prioritet | Workflow panel + RPC atomike | Validim aplikacion/databazë |
| Zgjidhje/refuzim me shënim | Kufij 10–2000 karaktere në aplikacion dhe DB | Unit tests + pgTAP |
| Komente publike/interne immutable | `add_report_comment`, RLS dhe pa privilegj `UPDATE` | Citizen nuk lexon shënimet interne |
| Histori e plotë | Trigger server-side me aktor dhe shënim tranzicioni | Timeline për qytetarin dhe stafin |
| Njoftime | Trigger-a për status dhe komente + `/notifications` | Përmbajtja immutable; marrësi ndryshon vetëm `read_at` |
| Detaj i qytetarit | `/citizen/reports/[id]` | Pronari lejohet nga RLS; përdoruesit e tjerë marrin zero rreshta |
| Rihapje e kontrolluar | `reopen_resolved_report` + arsye 10–1000 karaktere | Vetëm pronari dhe vetëm nga `resolved` |
| Përfundimi i UX-it qytetar | `/citizen`, filtra/kërkim te `/citizen/reports`, navigim aktiv | Unit tests + typecheck, lint dhe build |

## Kontrollet lokale të ekzekutuara

- `npm run typecheck` — passed
- `npm run lint` — passed
- `npm test` — 56 teste passed pas paneleve, hyrjes sipas rolit dhe session-it njëorësh
- `npm run check:dataset` — passed
- `npm run build` — passed
- `npm audit --omit=dev` — 0 vulnerabilities
- `node --check scripts/verify-sprint6-remote.mjs` — passed
- `npm run verify:local-auth -- --allow-dev` — passed më 2026-07-29 për
  redirect-et pa session, route-t citizen/official dhe ndalimet cross-role

## Kontrollet e databazës

- `supabase/tests/database/pre_sprint6_hardening.test.sql` — 21 assertions;
- `supabase/tests/database/sprint6_workflow.test.sql` — 18 assertions;
- GitHub Actions nisi një Supabase të izoluar me Docker dhe ekzekutoi
  `npx supabase test db`; run-i `30468252040` kaloi 39/39 assertions;
- `npm run verify:sprint6 -- --allow-dev` kontrollon projektin e hostuar `dev`
  me llogari vetëm sintetike — passed më 2026-07-29;
- `npx supabase db lint --linked --schema public --level warning
  --fail-on error` — passed pa gabime në skemën e aplikacionit më 2026-07-29;
- `npx supabase test db --linked` nuk përdoret si provë sepse CLI kërkon
  Docker edhe për runner-in linked; job-i `database` në GitHub Actions është
  prova autoritative dhe kaloi.

## Gate para Sprintit 7 — kaluar më 2026-07-29

Para fillimit të Sprintit 7 u verifikuan:

1. migration history lokale/remote të sinkronizuar;
2. pgTAP 39/39 assertions të kaluara;
3. remote Sprint 6 verification të kaluar;
4. typecheck, lint, Vitest, dataset dhe production build të gjelbra;
5. route smoke për `/citizen`, listën/detajin qytetar, official, admin dhe
   përdorues pa session;
6. dokumentim dhe diagram state/sequence të sinkronizuar me implementimin.

Shënimet e veçuara të completion pass-it për panelet qytetar/zyrtar u
konsoliduan këtu; dokumentet e dyfishta u hoqën gjatë pastrimit të Sprintit 7.
