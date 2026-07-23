# Raporto Qytetin

Platformë web për raportimin, ndjekjen dhe zgjidhjen e problemeve qytetare. Projekti zhvillohet si punim Bachelor me të dhëna sintetike dhe nuk trajton raste emergjente.

Titulli i punimit: **Zhvillimi i një platforme për raportimin, ndjekjen dhe zgjidhjen e problemeve qytetare**

## Gjendja aktuale

Sprintet 1–3 janë të implementuara dhe në rishikim final:

- arkitekturë, standarde të kodit dhe design system responsive;
- Supabase me PostgreSQL/PostGIS, migrations, RLS, private Storage dhe views publike të sanitizuara;
- autentikim me email/password, konfirmim email-i, PKCE callback, reset password, profil qytetari dhe mbrojtje të route-ve;
- Next.js 16 Active LTS, React 19, Turbopack default, TypeScript strict dhe ESLint flat config;
- audit i dependency-ve pa vulnerabilitete të njohura në kohën e verifikimit.

Nuk ka ende krijim raporti real; ai fillon në Sprintin 5.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS dhe komponentë UI të ripërdorshëm
- Supabase: Auth, PostgreSQL/PostGIS dhe Storage privat
- OpenStreetMap + React Leaflet (implementohet me hartën në sprintet e ardhshme)
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
npm run build
npm audit --omit=dev
```

## Konfigurimi i Supabase

Vendos në `.env.local` vetëm vlerat publike:

```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Për kompatibilitet të përkohshëm, kodi lexon edhe `NEXT_PUBLIC_SUPABASE_ANON_KEY`, por emri i preferuar është `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Pas një `git pull` ose pas ndryshimeve në migration, apliko skemën:

```bash
npx supabase migration list
npx supabase db push --dry-run
npx supabase db push
```

Lexo [udhëzuesin e Supabase](docs/supabase-setup.md) dhe [checklistën e autentikimit](docs/auth-setup.md) para testimit të parë.

## Siguria

- Publishable key lejohet në browser vetëm sepse RLS është aktiv; nuk është secret.
- Asnjë `secret`/`service_role` key nuk kërkohet në Sprintin 3 dhe nuk duhet të shtohet në browser, Git ose chat.
- Fotografitë ruhen në bucket privat; views publike nuk nxjerrin identitet, email, telefon ose lokacion privat.
- Route-t e autentikimit dhe ato të mbrojtura përdorin cookies SSR dhe `proxy.ts` të kufizuar vetëm te route-t që e kërkojnë atë.

## Dokumentim

- [Arkitektura](docs/architecture.md)
- [Modeli i databazës](docs/database-design.md)
- [Konfigurimi i Supabase](docs/supabase-setup.md)
- [Konfigurimi i autentikimit](docs/auth-setup.md)
- [Baza e sigurisë](docs/security-baseline.md)
- [Roadmap](docs/roadmap.md)

## Kufijtë e projektit

Platforma nuk zëvendëson shërbimet e emergjencës; nuk përdor identitet elektronik shtetëror, pagesa, aplikacion native ose AI për klasifikimin e fotografive. Dataset-i nuk përmban emra, email, fotografi, adresa ose raporte të personave realë.
