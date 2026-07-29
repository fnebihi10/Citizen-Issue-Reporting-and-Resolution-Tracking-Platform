# Official dashboard — completion pass before Sprint 7

Ky dokument përmbledh panelin operativ të zyrtarit që plotëson workflow-n e
Sprintit 6 pa hyrë në administrimin ose analitikën e Sprintit 7–8.

## Fusha e implementuar

| Kriteri | Implementimi |
|---|---|
| Faqe hyrëse sipas rolit | `/official` për `official` dhe `admin`; qytetari bllokohet |
| Scope i autorizuar | query-t e panelit lexojnë `reports` vetëm përmes RLS-së ekzistuese |
| Përmbledhje operative | për verifikim, caktuar zyrtarit aktual, në proces dhe prioritet `high`/`urgent` |
| Radhë vëmendjeje | renditje deterministike sipas prioritetit, statusit, pronësisë dhe afatit fillestar |
| Puna personale | deri në tri caktimet aktive me afatin fillestar më të afërt |
| Përditësime | njoftimet e palexuara dhe destinacioni direkt te raporti |
| Vazhdimësi navigimi | login-i, logoja, Account dhe header-i çojnë te paneli; inbox-i mbetet route më vete |
| Gjendje të plota | loading, error dhe empty për ngarkesën operative |

## Kufijtë

- Paneli nuk ndryshon RLS, state machine-in ose të dhënat e workflow-t.
- Përmbledhja llogaritet mbi maksimumi 200 raportimet e fundit që lejon RLS.
- Afatet paraqiten si afate fillestare; monitorimi/eskalimi i plotë SLA mbetet
  pjesë e Sprintit 7.
- Administrimi, audit UI, eksportet dhe analitika nuk përfshihen këtu.

## Verifikimi

- helper-at e panelit mbulohen nga tri teste Vitest;
- `npm test` — 56 teste passed;
- `npm run typecheck` — passed;
- `npm run lint` — passed;
- `npm run build` — passed;
- production route smoke — passed për SSR refresh, signed-out redirects,
  qasjen citizen/official dhe bllokimet ndërmjet roleve.
