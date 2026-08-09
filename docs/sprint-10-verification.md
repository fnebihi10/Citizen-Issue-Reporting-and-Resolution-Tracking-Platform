# Sprint 10 — Release dhe paketa e tezës

## Statusi

**Release candidate i verifikuar lokalisht.** Kodi është gati për import në
Vercel pasi commit-i i release-it të jetë në `main`. Sprinti 10 mbyllet vetëm
pasi URL-ja HTTPS të verifikohet dhe të plotësohen provat e deployment-it.

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

- [ ] Commit-i i release candidate është në `main`.
- [ ] Vercel Production dhe Preview kanë vetëm environment variables publike.
- [ ] `NEXT_PUBLIC_SITE_URL` është domain-i final HTTPS.
- [ ] Supabase Site URL dhe `/auth/callback` përputhen me domain-in.
- [ ] Custom SMTP/CAPTCHA është konfiguruar ose signup-u real nuk prezantohet si
      production-ready.
- [ ] Build dhe GitHub Actions kalojnë në commit-in e release-it.
- [ ] `/`, `/map`, `/robots.txt`, `/sitemap.xml` dhe 404 kalojnë smoke test-in.
- [ ] Citizen, official dhe admin kalojnë smoke test-in në deployment.
- [ ] Header-at e sigurisë dhe `private, no-store` verifikohen në HTTPS.
- [ ] Screenshot-et finale dhe video-demo përdorin vetëm të dhëna sintetike.

## Prova e deployment-it

| Fusha | Vlera |
|---|---|
| URL production | Në pritje |
| Commit SHA | Në pritje |
| Data/ora | Në pritje |
| GitHub Actions | Në pritje |
| Smoke test publik | Në pritje |
| Smoke test me role | Në pritje |
| Vendimi final | Në pritje |
