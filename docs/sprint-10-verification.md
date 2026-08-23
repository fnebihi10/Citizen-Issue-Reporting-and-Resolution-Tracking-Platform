# Sprint 10 — Release dhe paketa e tezës

## Statusi

**I përfunduar.** Release-i i kontrolluar i aplikacionit është aktiv në Vercel
në `https://raporto-qytetin.vercel.app`. Domain-i final HTTPS, konfigurimi i
Supabase Auth dhe smoke test-i i production-it janë verifikuar më 23 gusht 2026.

## Paketa aktuale

- README, `.env.example`, arkitekturë, skemë databaze dhe security baseline;
- diagramet autoritative dhe wireframes;
- raporti i testimit me 80 teste Vitest, 83 assertions pgTAP dhe Playwright;
- metadata canonical/Open Graph, robots, sitemap dhe faqe të personalizuara
  404/global error;
- udhëzuesi i Vercel/Supabase dhe plani i demo-s;
- dataset sintetik me 120 raporte.

## Quality gate i release candidate-it

| Gate | Rezultati |
|---|---|
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm test` | PASS — 16 skedarë, 80 teste |
| `npm run check:dataset` | PASS — JSON/SQL të sinkronizuara |
| `npm audit --audit-level=high` | PASS — 0 vulnerabilitete |
| `npm run build` | PASS — Next.js 16.3.0 production build |
| Playwright production | PASS — 18/18 skenarë |
| pgTAP | PASS — 83/83 assertions |
| DB lint `public` | PASS — pa gjetje |
| Remote migration dry-run | PASS — databaza është up to date |

## Checklist i release-it

- [x] Commit-i i release candidate është në `main`.
- [x] Vercel Production dhe Preview përdorin vetëm environment variables
      `NEXT_PUBLIC_*`; asnjë service-role key nuk është vendosur.
- [x] `NEXT_PUBLIC_SITE_URL` është domain-i final HTTPS.
- [x] Supabase Site URL dhe `/auth/callback` përputhen me domain-in.
- [x] Release-i klasifikohet si demo e kontrolluar; pa custom SMTP/CAPTCHA,
      signup/reset publik nuk prezantohet si shërbim production-ready.
- [x] Build dhe GitHub Actions kalojnë në commit-in e release-it.
- [x] `/`, `/map`, `/login`, `/register`, `/robots.txt`, `/sitemap.xml` dhe 404
      kalojnë smoke test-in live.
- [x] Citizen, official dhe admin janë verifikuar nga suite-a authenticated
      18/18 dhe nga testimi manual i pronarit mbi të njëjtin release/Supabase.
- [x] Header-at e sigurisë verifikohen live; redirect-i i route-it privat dhe
      politika `private/no-store` mbulohen nga testet authenticated.
- [ ] Screenshot-et finale dhe video-demo do të krijohen gjatë dokumentimit të
      tezës dhe duhet të përdorin vetëm të dhëna sintetike.

## Prova e deployment-it

| Fusha | Vlera |
|---|---|
| URL production | `https://raporto-qytetin.vercel.app` |
| Commit SHA i aplikacionit | `38455ad0a82a65c4b9726353b339a2d525db6501` |
| Data | 2026-08-23 |
| GitHub Actions | PASS — validate dhe database security tests |
| Smoke test live | PASS — `npm run verify:production -- https://raporto-qytetin.vercel.app`, 16/16 |
| Metadata | PASS — canonical dhe Open Graph përdorin domain-in final |
| Auth production | PASS — Supabase Site URL/callback korrekt dhe route privat ridrejton në login |
| Smoke test me role | PASS — suite authenticated 18/18 + validimi manual i pronarit; kredenciale reale nuk ruhen në repo |
| Domain-i i vjetër | PASS — ridrejton me 307 te domain-i final |
| Vendimi final | **GO — Sprint 10 i mbyllur për demo dhe dokumentim të tezës** |
