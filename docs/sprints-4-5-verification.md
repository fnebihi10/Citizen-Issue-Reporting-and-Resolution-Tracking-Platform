# Sprint 4–5 verification

Ky dokument mban kriteret e pranimit dhe provat e verifikimit për Sprintin 4 dhe Sprintin 5. Build-i ose dokumentimi i planifikuar nuk konsiderohet provë e një rrjedhe të kaluar.

## Sprint 4 — Core UI & public shell

| Kriteri | Implementimi | Prova aktuale |
|---|---|---|
| Navigim publik desktop/mobile | `components/layout/Navbar.tsx`, `Footer.tsx` | `npm run lint`, `npm run build`, route smoke |
| Harta publike bazë | `/map`, `PublicIssueMap`, `public_reports` view | `/map` përgjigjet me HTTP 200; testimi vizual i tile provider-it mbetet manual |
| Privatësi publike | Harta lexon vetëm `public_reports`, jo `reports` | Kontroll statik i query-t dhe migration/RLS |
| Loading/empty/error states | `FeedbackState`, route `loading.tsx` dhe `error.tsx` | Typecheck/build kalojnë |
| Responsive behavior | Layout-e mobile-first dhe breakpoint-e Tailwind | Duhet kontroll vizual desktop/mobile para mbylljes së sprintit |

## Sprint 5 — Citizen reporting

| Kriteri | Implementimi | Prova aktuale |
|---|---|---|
| Titull, përshkrim dhe kategori | `ReportForm` + validim i përbashkët | Typecheck/lint/build kalojnë |
| Validim server-side | `createCitizenReport` server action + DB constraints/RLS | Kontroll statik; kërkon llogari testuese Supabase për ekzekutim real |
| Lokacion në hartë | `LocationPicker` + PostGIS geography insert | Kontroll statik; kërkon insert të autentikuar për verifikim end-to-end |
| Fotografi prove | MIME/size validation, private Storage, attachment row, cleanup pas dështimit | Kontroll statik; kërkon upload të autentikuar për verifikim end-to-end |
| Raportimet e mia | `/citizen/reports`, RLS sipas `citizen_id` | Route redirect pa session verifikohet me HTTP 307 |
| Privatësia | Lokacioni i saktë dhe identiteti nuk shfaqen në listën/hartën publike | Query-t përdorin view publike ose RLS owner policy |

## Kontrollet e ekzekutuara

- `npm run typecheck` — passed
- `npm run lint` — passed
- `npm run build` — passed
- `git diff --check` — passed
- `/map` — HTTP 200 pa session
- `/citizen/report` dhe `/citizen/reports` — HTTP 307 drejt login-it pa session
- `supabase/seed.sql` — local-only seed me 8 pika publike sintetike për demonstrimin e hartës

## Çfarë nuk deklarohet ende si e kaluar

- krijim raporti me session real Supabase;
- upload dhe lexim i fotografisë në bucket-in privat;
- testimi i migrimeve në Supabase Cloud;
- testim vizual në telefon/desktop;
- 25 testet funksionale/sigurisë të Sprintit 9.
- ekzekutimi i seed-it në Supabase Cloud; browser-i përdor vetëm publishable key dhe nuk duhet të shkruajë të dhëna administrative pa një procedurë të autorizuar.
