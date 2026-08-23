# Raporti final i testimit dhe vlerësimit

Ky raport bashkon planin, rastet dhe evidencën e release-it në një burim të
vetëm autoritativ. Ai mbulon kërkesën e mentorit për së paku 25 teste
funksionale, të skajeve dhe të sigurisë. Testet automatike përdorin vetëm
datasetin sintetik; testimi manual nuk duhet të fusë emra, adresa, fotografi
ose lokacione reale.

## Nivelet e testimit

| Niveli | Qëllimi | Mjeti |
|---|---|---|
| Funksione të pastra | Validim, filtra, renditje, serializim dhe llogaritje | Vitest |
| Databazë | RLS/RBAC, triggers, workflow, privatësi dhe integritet | pgTAP + Supabase lokal/CI |
| Integrim | Auth, Storage, RPC dhe deny paths kundër projektit dev | Skriptet `verify:*` |
| UI responsive | Flukset dhe overflow në viewport-et e synuara | Kontroll manual/browser |
| Përdorshmëri | Kuptueshmëria dhe përfundimi i detyrave | Kontroll manual i pronarit + Playwright |

## Rastet minimale që duhet të ruhen

1. Signup krijon vetëm qytetar.
2. Route-t private refuzojnë vizitorin.
3. Qytetari nuk hyn në route zyrtari/admini.
4. Zyrtari nuk hyn në administrim.
5. Session-i i workspace-it skadon pas një ore.
6. Raporti refuzon titull/përshkrim jashtë kufijve.
7. Raporti kërkon kategori aktive dhe lokacion të vlefshëm.
8. Fotografia refuzon MIME/madhësi të palejuar.
9. Fotografia dështon mbyllur nëse EXIF/GPS nuk hiqet.
10. Rate limit-i bllokon raportin e gjashtë në pesë minuta.
11. Lokacioni publik gjenerohet nga serveri dhe ndahet nga pika private.
12. Sugjerimet përdorin kategori, distancë dhe kohë pa ekspozuar privatësi.
13. Inbox-i zyrtar respekton departamentin.
14. State machine bllokon tranzicionet e palejuara.
15. Zgjidhja/refuzimi kërkon shënim.
16. Rihapja lejohet vetëm për pronarin dhe raportin e zgjidhur.
17. Komentet interne nuk i shfaqen qytetarit/publikut.
18. Njoftimet krijohen server-side.
19. Vetëm admini ndryshon role dhe strukturë.
20. Zyrtari kërkon departament aktiv.
21. SLA llogaritet server-side dhe klasifikohet saktë.
22. Audit log është append-only dhe ndryshimet e ndjeshme regjistrohen.
23. Eksportet CSV/JSON nuk përmbajnë identitet ose koordinata private.
24. `/map` lexon vetëm raportet publike dhe koordinatat e përgjithësuara.
25. Filtrat publikë nuk zbulojnë raportet private.
26. Detaji publik nuk dallon mes ID-së private dhe asaj të panjohur.
27. Historiku publik nuk përmban aktorë ose shënime interne.
28. Dendësia agregohet vetëm nga lokacionet e përgjithësuara.
29. Dataset-i ka të paktën 100 raporte sintetike.
30. Faqet kryesore nuk kanë horizontal overflow në viewport-et e synuara.
31. Zyrtari mund të ngarkojë provë fotografie të zgjidhjes vetëm në raport të
    autorizuar; skedari pastrohet nga EXIF/GPS, regjistrohet si `resolution`
    dhe nuk shfaqet në kontratën publike.

## Komandat e quality gate

```bash
npm run typecheck
npm run lint
npm test
npm run check:dataset
npm run build
npm audit --omit=dev --audit-level=high
npm run test:e2e
npx supabase test db
npx supabase db lint --local --schema public --level warning --fail-on error
```

Testet remote ekzekutohen vetëm kundër projektit `dev/staging` të seed-uar dhe
vetëm me flamurin eksplicit `--allow-dev`. Browser suite e autentikuar përdor
Supabase lokal të izoluar në CI; pronari ka kontrolluar manualisht flukset me
llogari sintetike qytetari, zyrtari dhe administratori.

## Evidenca e fundit lokale — 23.08.2026

| Kontrolli | Rezultati |
|---|---|
| TypeScript | PASS |
| ESLint | PASS |
| Vitest | PASS — 16 skedarë, 80/80 teste |
| Dataset | PASS — 120 raporte JSON/SQL të sinkronizuara |
| Build production | PASS — Next.js 16.3.0 |
| Audit production dependencies | PASS — 0 vulnerabilitete |
| pgTAP | PASS — 5 skedarë, 83/83 assertions |
| Supabase DB lint | PASS — pa gjetje në schema `public` |

Playwright-i i autentikuar dhe smoke test-i live regjistrohen në
[`sprint-10-verification.md`](sprint-10-verification.md) pas ekzekutimit të CI-së
mbi commit-in e release-it. Studim i jashtëm me 5–10 persona nuk është
realizuar dhe nuk paraqitet si rezultat.
