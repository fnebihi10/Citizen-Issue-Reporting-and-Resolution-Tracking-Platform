# Roadmap i riformuluar

Plani fillestar përmend 10 sprintë, por liston vetëm 8. Për të mos përzier arkitekturën me implementimin, projekti ndahet në 10 sprintë të vogla dhe të verifikueshme.

## Sprint 1 — Foundation & product system

Repository, standardet e kodit, arkitektura, design system, layout publik, dokumentimi i vendimeve dhe konfigurimi i deploy-it pa të dhëna reale.

## Sprint 2 — Database & Supabase

Krijimi i projektit Supabase, PostgreSQL/PostGIS, migrations, seed sintetik, Storage buckets dhe dizajni i RLS.

## Sprint 3 — Authentication & RBAC

Regjistrimi, hyrja, verifikimi i email-it, reset i fjalëkalimit, profiles, role dhe mbrojtja e route-ve.

## Sprint 4 — Core UI & public shell

Navigimi i plotë, komponentët e përbashkët, harta publike bazë, gjendjet empty/loading/error dhe responsive behavior.

## Sprint 5 — Citizen reporting

Krijimi i raportit, kategoritë, validimi, fotografia, lokacioni, raportimet e mia dhe privatësia e të dhënave.

## Sprint 6 — Official workflow

Inbox-i i zyrtarit, verifikimi, caktimi i departamentit, tranzicionet e statusit, komentet, historia dhe rihapja.

## Sprint 7 — Administration & SLA

Përdoruesit, departamentet, kategoritë, SLA, vonesat, audit log dhe eksportet CSV/JSON.

## Sprint 8 — Public transparency & analytics

Faqja publike e raportit, filtrat, cluster/heatmap, statistika dhe redaktimi i lokacionit publik.

## Sprint 9 — Quality, security & evaluation

Minimum 25 teste, testet e RLS/RBAC, rate limiting, accessibility, performance, dataset 100+ dhe usability test me 5–10 persona.

## Sprint 10 — Release & thesis package

Deploy në Vercel, llogari demo, README, `.env.example`, diagramet, screenshot-et, raporti i testimit, video-demo dhe përditësimi i kapitujve.

## Rregull për kalimin në sprintin tjetër

Nuk kalojmë përpara nëse sprinti aktual nuk ka build të suksesshëm, dokumentim të përditësuar dhe një kriter pranimi të verifikueshëm. Kjo parandalon kthimin e vazhdueshëm te sprintet e vjetra.
