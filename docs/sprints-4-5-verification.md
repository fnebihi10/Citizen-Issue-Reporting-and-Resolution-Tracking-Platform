# Sprint 4–5 verification

Ky dokument mban kriteret e pranimit dhe provat e verifikimit për Sprintin 4 dhe Sprintin 5. Build-i ose dokumentimi i planifikuar nuk konsiderohet provë e një rrjedhe të kaluar.

## Sprint 4 — Core UI & public shell

| Kriteri | Implementimi | Prova aktuale |
|---|---|---|
| Navigim publik desktop/mobile | `components/layout/Navbar.tsx`, `Footer.tsx` | `npm run lint`, `npm run build`, route smoke |
| Harta publike bazë | `/map`, `PublicIssueMap`, `public_reports` view | `/map` përgjigjet me HTTP 200; tile-t, marker-at dhe lista u verifikuan vizualisht me të dhënat remote |
| Privatësi publike | Harta lexon vetëm `public_reports`, jo `reports` | Query/view/RLS të kontrolluara; lokacioni publik gjenerohet vetëm nga trigger-i |
| Loading/empty/error states | `FeedbackState`, route `loading.tsx` dhe `error.tsx` | Typecheck/build kalojnë |
| Responsive behavior | Layout-e mobile-first dhe breakpoint-e Tailwind | Ballina, auth-i dhe harta u kontrolluan në viewport desktop dhe mobile 500 px, pa overflow horizontal |

## Sprint 5 — Citizen reporting

| Kriteri | Implementimi | Prova aktuale |
|---|---|---|
| Titull, përshkrim dhe kategori | `ReportForm` + validim i përbashkët | Typecheck/lint/build kalojnë |
| Validim server-side | `createCitizenReport` server action + DB constraints/RLS | Insert me të njëjtën formë payload-i u ekzekutua me llogari sintetike në remote dev |
| Lokacion në hartë | `LocationPicker` + PostGIS geography insert | Insert-i i autentikuar me geography kalon në remote dev |
| Fotografi prove | MIME/size validation, canvas re-encode pa EXIF/GPS, private Storage, attachment row, cleanup pas dështimit | Testet Vitest kalojnë; upload/download real kalon, anon-i refuzohet dhe prova e regjistruar nuk fshihet |
| Raportimet e mia | `/citizen/reports`, RLS sipas `citizen_id` | Route redirect pa session verifikohet me HTTP 307 |
| Privatësia | Lokacioni i saktë dhe identiteti nuk shfaqen në listën/hartën publike | Trigger-i përgjithëson çdo pikë publike; minimumi remote i matur është 54 m |
| Rate limiting | 5 raporte për qytetar brenda 5 minutave | Kontroll transaksional remote me rollback kalon |
| Raportime të ngjashme | Kategori + distancë + 90 ditë, vetëm public generalized/own private | RPC refuzohet për anon dhe kthen rezultate për qytetarin e autentikuar |

## Kontrollet e ekzekutuara

- `npm run typecheck` — passed
- `npm run lint` — passed
- `npm test` — 37 teste passed
- `npm run check:dataset` — passed
- `npm run build` — passed
- `npm run verify:remote -- --allow-dev` — passed
- `npm run verify:local-auth -- --allow-dev` — passed
- `git diff --check` — passed
- `/map` — HTTP 200 pa session
- `/citizen/report` dhe `/citizen/reports` — HTTP 307 drejt login-it pa session
- Supabase remote dev — të gjitha migration-et dhe seed-i janë të aplikuara
- databaza dev — 120 raporte të dataset-it, 104 publike, plus raportet e verifikimit/përdoruesit
- public location — minimumi i matur 54 m larg pikës private
- Storage privat — upload/download i një PNG-je sintetike kalon; anon download dhe delete pas regjistrimit refuzohen
- UI — kontroll vizual desktop/mobile për ballinën, login/register/recovery dhe hartën publike

## Çfarë nuk deklarohet ende si e kaluar

- suita e plotë e së paku 25 skenarëve funksionalë, të skajeve dhe të sigurisë është dorëzim i Sprintit 9; 26 unit tests nuk paraqiten si zëvendësim i saj;
- pgTAP suite lokale nuk është ekzekutuar sepse Supabase lokal kërkon Docker, i cili nuk është aktiv në këtë pajisje;
- testimi i përdorshmërisë me 5–10 persona dhe pajisjet fizike mbeten pjesë e vlerësimit të mëvonshëm, jo kusht i Sprintit 5.
