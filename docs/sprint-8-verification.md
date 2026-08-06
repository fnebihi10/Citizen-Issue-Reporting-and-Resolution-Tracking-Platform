# Verifikimi i Sprintit 8

Ky dokument lidh kriteret e transparencës publike dhe analitikës me
implementimin dhe provat e ekzekutuara. Verifikimi përfundimtar u krye më
2026-08-06.

## Fusha e Sprintit 8

| Kriteri | Implementimi | Prova |
|---|---|---|
| Hartë publike e filtrueshme | `/map` me kërkim, kategori, status dhe periudhë | Unit tests, browser smoke dhe filtri `resolved` |
| Statistika publike | Total, aktive, të zgjidhura dhe kohë mesatare | Funksione të pastra + unit tests |
| Pika/dendësia | `PublicIssueMap` me agregim të koordinatave publike | Unit tests + toggle real në Chrome |
| Detaj publik | `/reports/[id]` | Raporti publik renderohet; private/unknown japin të njëjtin fallback |
| Histori dhe komente publike | `PublicReportActivity` | Pa aktorë, shënime ose komente interne |
| Moszbulim i raportit privat | Private dhe unknown japin të njëjtën gjendje | Query vetëm ndaj view + pgTAP + browser smoke |
| Analitikë administrative | `/admin/analytics` | Admin guard + hyrje me administratorin sintetik lokal |
| Kontratë databaze | Tre views `security_barrier` | Migration + 14 assertions pgTAP të Sprintit 8 |
| Performancë publike | Cache 30 sekonda + indeks parcial | Cache tag revalidation + migration |
| Responsive/accessibility | Grid adaptiv, controls 44 px, fokus i dukshëm | Pesë viewport-e reale + matje DOM |

## Rezultatet automatike

- `npm run typecheck` — passed;
- `npm run lint` — passed pa warnings;
- `npm test` — 77/77 teste passed në 15 skedarë;
- `npm run check:dataset` — passed; JSON-i dhe SQL seed-i janë të
  sinkronizuara;
- `npm run build` — passed dhe gjeneroi `/map`, `/reports/[id]` dhe
  `/admin/analytics`;
- `npx supabase test db` — **PASS**, 5 skedarë dhe **83/83 assertions**;
- pgTAP për Sprintin 8 — 14/14 assertions passed;
- `npx supabase migration list` — migration-i
  `20260730100000_sprint8_public_transparency.sql` është i pranishëm lokalisht
  dhe në remote;
- `npx supabase db push --dry-run` — `Remote database is up to date`.

## Kontrollet e privatësisë dhe funksionimit

- `/map` u renderua me 105 raportime sintetike në dev-in e lidhur;
- filtri `status=resolved` uli pamjen nga 105 në 24 raportime dhe ruajti
  vlerën e zgjedhur;
- toggle-i **Pikat/Dendësia** ndryshoi `aria-pressed` saktë dhe tregoi 30 zona
  të agreguara; të dy kontrollet ishin 44 px të larta;
- raporti publik sintetik `...0002` renderoi titullin dhe përmbajtjen publike;
- raporti privat sintetik `...0001` dhe UUID-ja e panjohur dhanë të njëjtin
  fallback 51,535-byte, pa titull ose përmbajtje të raportit;
- administratori sintetik lokal hyri te `/admin/analytics`; faqja renderoi 104
  raportime publike nga seed-i lokal, filtrat, statistikat, hartën e
  përgjithësuar dhe shpërndarjet sipas kategorisë/statusit;
- të dhënat e shfaqura në kontrollet manuale ishin vetëm sintetike dhe views
  publike nuk ekspozuan identitet, adresë ose koordinatë private.

## Kontrollet responsive

Chrome u ekzekutua me device metrics reale në viewport-et 390×844, 430×932,
768×1024, 1366×768 dhe 1440×900. Në të pesta rastet:

- `document.documentElement.scrollWidth === clientWidth`;
- titulli, filtrat, kartat dhe harta qëndruan brenda viewport-it;
- navigimi mobile u shfaq në viewport-et e vogla;
- nuk u gjet horizontal overflow.

## GitHub Actions dhe statusi i mbylljes

- commit-i i implementimit: `919506b` (`feat: complete Sprint 8 public transparency`);
- branch-i: `agent/sprint-8-closure`;
- draft PR: `#2` drejt `main`;
- workflow run `31100700433`:
  - `validate` — passed në 1m01s;
  - `Database security tests` — passed në 2m41s.

Sprinti 8 është i mbyllur teknikisht dhe gati për review/merge. Të gjitha
provat lokale, migration-i remote dhe të dy job-et e GitHub Actions janë green.
