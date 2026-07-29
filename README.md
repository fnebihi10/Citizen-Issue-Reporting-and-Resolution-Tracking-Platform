# Raporto Qytetin

Platformë web për raportimin, ndjekjen dhe zgjidhjen e problemeve qytetare. Projekti zhvillohet si punim Bachelor me të dhëna sintetike dhe nuk trajton raste emergjente.

Titulli i punimit: **Zhvillimi i një platforme për raportimin, ndjekjen dhe zgjidhjen e problemeve qytetare**

## Gjendja aktuale

Sprintet 1–7 janë të implementuara në nivel aplikacioni dhe databaze:

- arkitekturë, standarde të kodit dhe design system responsive;
- Supabase me PostgreSQL/PostGIS, migrations, RLS, private Storage dhe views publike të sanitizuara;
- autentikim me email/password, konfirmim email-i, PKCE callback, reset password, profil qytetari dhe mbrojtje të route-ve;
- shell publik responsive me hartë publike, gjendje loading/empty/error dhe navigim për desktop/mobile;
- panel qytetar responsive me përmbledhje, veprimin e radhës, njoftime të
  palexuara, kërkim/filtra dhe listën “raportimet e mia”;
- krijim raportimi qytetar me kategori, validim, lokacion në hartë dhe
  fotografi prove në Storage privat;
- heqje fail-closed e EXIF/GPS para upload-it, rate limit databaze dhe sugjerim
  privatësi-safe të raportimeve të ngjashme;
- inbox dhe detaj privat për zyrtarët, workflow atomik i statuseve, caktim
  departamenti/zyrtari, prioritet, komente publike/interne, histori e plotë,
  njoftime dhe rihapje e kontrolluar nga qytetari;
- panel zyrtar responsive me ngarkesën operative, radhën e vëmendjes,
  caktimet personale, afatet fillestare dhe njoftimet e palexuara;
- panel administrativ responsive me menaxhim rolesh/departamentesh, kategori
  dhe SLA, monitorim të vonesave, audit log vetëm për lexim dhe eksporte
  CSV/JSON pa të dhëna personale;
- dataset dhe seed databaze të sinkronizuar me 120 raporte sintetike, prej të
  cilave 104 publike me lokacion server-side të përgjithësuar;
- Next.js 16.2.11, React 19, Turbopack default, TypeScript strict dhe ESLint flat config;
- audit i dependency-ve pa vulnerabilitete të njohura në kohën e verifikimit.
- GitHub Actions quality gate për `typecheck`, lint, teste, dataset, build dhe
  pgTAP në një Supabase të izoluar.

Migrations dhe RLS janë burimi autoritativ për databazën. Gjendja e projektit Supabase remote duhet të verifikohet me `supabase migration list` dhe `supabase db push --dry-run` para përdorimit me të dhëna reale.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS dhe komponentë UI të ripërdorshëm
- Supabase: Auth, PostgreSQL/PostGIS dhe Storage privat
- OpenStreetMap + React Leaflet për hartën publike dhe zgjedhjen e lokacionit në raportim
- Vercel për deploy

## Nisja lokale

Kërkohet Node.js `20.9+` (projekti është verifikuar me Node `20.20.0`).

```bash
npm install
copy .env.example .env.local
npm run dev
```

Hape [http://localhost:3000](http://localhost:3000). Në Next.js 16, `npm run dev` përdor tashmë Turbopack; `npm run dev:turbo` është alias i së njëjtës komandë.

Kontrollet e cilësisë:

```bash
npm run typecheck
npm run lint
npm test
npm run check:dataset
npm run build
npm audit --omit=dev
```

Kontrolli remote lejohet vetëm kundër projektit dev/staging të seed-uar:

```powershell
npm run verify:remote -- --allow-dev
npm run verify:local-auth -- --allow-dev
npm run verify:sprint6 -- --allow-dev
```

Pas një migration-i të ri të aplikuar në projektin `dev`, rigjenero tipet me
`npm run generate:types`.

## Konfigurimi i Supabase

Vendos në `.env.local` vetëm vlerat publike:

```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Për kompatibilitet të përkohshëm, kodi lexon edhe `NEXT_PUBLIC_SUPABASE_ANON_KEY`, por emri i preferuar është `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Pas një `git pull` ose pas ndryshimeve në migration, apliko skemën:

```bash
npx supabase migration list
npx supabase db push --dry-run
npx supabase db push
```

Për zhvillim lokal me Supabase CLI, `npx supabase db reset` aplikon migrations
dhe seed-et e renditura në `supabase/config.toml`; kjo krijon vetëm të dhëna
sintetike demo. Mos e përdor seed-in në production.

Lexo [udhëzuesin e Supabase](docs/supabase-setup.md) dhe [checklistën e autentikimit](docs/auth-setup.md) para testimit të parë.

## Siguria

- Publishable key lejohet në browser vetëm sepse RLS është aktiv; nuk është secret.
- Asnjë `secret`/`service_role` key nuk kërkohet nga implementimi aktual dhe nuk
  duhet të shtohet në browser, Git ose chat.
- Fotografitë ruhen në bucket privat; views publike nuk nxjerrin identitet, email, telefon ose lokacion privat.
- EXIF/GPS hiqet para upload-it dhe lokacioni publik llogaritet gjithmonë nga
  trigger-i në databazë.
- Route-t e autentikimit dhe ato të mbrojtura përdorin cookies SSR dhe `proxy.ts` të kufizuar vetëm te route-t që e kërkojnë atë.

## Dokumentim

- [Arkitektura](docs/architecture.md)
- [Modeli i databazës](docs/database-design.md)
- [Konfigurimi i Supabase](docs/supabase-setup.md)
- [Konfigurimi i autentikimit](docs/auth-setup.md)
- [Baza e sigurisë](docs/security-baseline.md)
- [Verifikimi i Sprintit 6](docs/sprint-6-verification.md)
- [Verifikimi i Sprintit 7](docs/sprint-7-verification.md)
- [Diagramet autoritative](diagrams/README.md)
- [Roadmap](docs/roadmap.md)

## Kufijtë e projektit

Platforma nuk zëvendëson shërbimet e emergjencës; nuk përdor identitet elektronik shtetëror, pagesa, aplikacion native ose AI për klasifikimin e fotografive. Dataset-i nuk përmban emra, email, fotografi, adresa ose raporte të personave realë.
