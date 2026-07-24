# Supabase setup — Sprint 2

Ky dokument përdoret vetëm për projektin e zhvillimit të temës. Krijo një projekt të veçantë `dev`; mos përdor një projekt production për testime destruktive.

## 1. Krijo projektin

1. Hyr në [Supabase Dashboard](https://supabase.com/dashboard).
2. Zgjidh organizatën tënde dhe kliko **New project**.
3. Vendos emrin, për shembull `citizen-issue-reporting-dev`.
4. Zgjidh një region në Evropë sa më afër përdoruesve tanë, nëse është i disponueshëm.
5. Gjenero një database password të fortë dhe ruaje në password manager. Mos e commit-o në repository.
6. Prit derisa projekti të përfundojë provisioning.

## 2. Merr vetëm çelësat që duhen tani

Në **Project Settings → API / API Keys** merr:

- **Project URL**;
- çelësin **publishable** për klientin publik.

Vendosi lokalisht në `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=PASTE_PUBLISHABLE_KEY_HERE
```

Mos e vendos `service_role` key në chat, GitHub, `.env.example` ose në ndonjë
komponent React. Nuk kërkohet nga Sprintet 1–5; nëse një operacion i ardhshëm
administrativ e kërkon realisht, përdoret vetëm server-side dhe dokumentohet
veçmas.

## 3. Aktivizo PostGIS

Hap **Database → Extensions**, kërko `postgis` dhe aktivizoje në schema `extensions` nëse Dashboard-i ta kërkon. Migration-i i projektit e përdor `extensions.geography(Point, 4326)` dhe e kontrollon edhe vetë aktivizimin.

PostGIS është i nevojshëm për lokacionet, spatial index, filtrat e hartës dhe sugjerimin e raportimeve të afërta. Dokumentimi zyrtar: [PostGIS në Supabase](https://supabase.com/docs/guides/database/extensions/postgis).

## 4. Apliko migrations

Migrations janë burimi autoritativ. Mos i krijo tabelat manualisht në Table Editor dhe mos e përdor migration-in e vjetër `01_schema_and_rls.sql`.

Supabase CLI është i fiksuar si development dependency në repository. Përdore
përmes `npx`:

```bash
npx supabase login
npx supabase link --project-ref PROJECT_REF
npx supabase migration list
npx supabase db push --dry-run
npx supabase db push
```

Pas çdo ndryshimi të skemës remote, rigjenero tipet:

```bash
npm run generate:types
```

Nëse CLI kërkon database password, përdor password-in që vendose gjatë krijimit të projektit. Migrations aplikohen sipas rendit:

1. `20260723180000_foundation.sql` — tabela, trigger-a, views, domain rules dhe RLS;
2. `20260723180100_reference_data.sql` — departamentet dhe kategoritë fillestare;
3. `20260723180200_storage.sql` — bucket-i privat dhe politikat fillestare të Storage;
4. `20260723213000_security_hardening.sql` — filtrimi i views publike, privatësia e profilit dhe provat e brendshme;
5. `20260724120000_align_attachment_uuid_constraint.sql` — sinkronizimi i
   formatit UUID mes metadata-s relacionale dhe Storage path-it;
6. `20260724213000_pre_sprint6_critical_hardening.sql` — përgjithësimi i
   lokacionit publik, rate limit, admin RBAC, komentet immutable dhe RPC-ja e
   raporteve të ngjashme;
7. `20260724230000_sprint5_integrity_hardening.sql` — mbyllja e bypass-eve
   direkte për timestamp/rate-limit, fushat operative të raportit dhe
   immutable evidence;
8. `20260724231500_fix_similarity_rpc.sql` — korrigjimi runtime i RPC-së së
   sugjerimeve dhe verifikimi i saj me smoke test remote;
9. `20260724233000_fix_public_reference_rls.sql` — ndarja e policy-ve anon dhe
   authenticated për kategoritë/departamentet aktive;
10. `20260724234500_secure_report_trigger_execution.sql` — ekzekutimi i sigurt
    i trigger-it të raportit kur llogarit lokacionin publik me helper-in privat;
11. `20260724235000_enforce_citizen_report_role.sql` — kontrolli i rolit
    autoritativ edhe për insert-et direkte të raportit qytetar.

Dokumentimi zyrtar: [Supabase database migrations](https://supabase.com/docs/guides/deployment/database-migrations).

Nëse nuk e ke CLI-në, për këtë projekt mund t’i ekzekutosh SQL files në SQL Editor në të njëjtin rend, por më pas duhet ta regjistrojmë gjendjen me CLI që migration history të mos dalë jashtë sinkronizimit.

Për zhvillim lokal, seed-et e renditura në `supabase/config.toml` krijojnë tre
qytetarë sintetikë dhe 120 raportime nga `dataset/synthetic_dataset.json`.
Prej tyre, 104 janë publike dhe lokacioni publik llogaritet nga trigger-i.
`supabase/seed.sql` ruhet si entry point konvencional; të dhënat janë në
`supabase/seeds/00_synthetic_users.sql` dhe skedarin e gjeneruar
`supabase/seeds/synthetic_reports.sql`.
Seed-i nuk është për production dhe nuk ngarkohet në Supabase Cloud nga një
`db push` standard. Vetëm në projektin e lidhur `dev` ose `staging`, pasi
`--dry-run` të kalojë, ngarkoje në mënyrë eksplicite:

```bash
npx supabase db push --include-seed
```

## 5. Çfarë duhet të shohësh pas migrimit

Në Database → Tables duhet të shfaqen `departments`, `categories`, `profiles`, `reports`, `report_status_history`, `report_comments`, `report_attachments`, `notifications` dhe `audit_logs`.

Në Database → Views duhet të shfaqen vetëm views publike të sanitizuara:

- `public_reports`;
- `public_report_comments`;
- `public_report_status_history`.

Në Storage duhet të ekzistojë bucket-i `report-evidence` dhe të jetë **private**. Storage kontrollohet me RLS në `storage.objects`; një bucket publik nuk është i pranueshëm për fotografitë e raportimeve.

Pas një `npx supabase db reset` lokal, `/map` duhet të tregojë raportimet
sintetike të seed-it. Nëse përdor Supabase Cloud, përdor `--include-seed` vetëm
në projektin e zhvillimit pasi të kesh verifikuar projektin e lidhur.

Verifiko sinkronizimin e dataset-it dhe seed-it me:

```bash
npm run check:dataset
```

Për një smoke test read-only/deny-path kundër projektit të seed-uar dev:

```powershell
npm run verify:remote -- --allow-dev
```

Ky kontroll lexon hartën publike, verifikon që RPC-ja refuzohet për anon,
autentikohet me qytetarin sintetik dhe siguron që ndryshimi direkt i prioritetit
kthehet me zero rreshta. Mos e ekzekuto kundër production.

## 6. Rregulla që nuk thyhen

- Mos e ndrysho rolin nga `raw_user_meta_data`; signup-i krijon gjithmonë `citizen`.
- Mos bëj `db reset --linked`; ai fshin databazën remote dhe lejohet vetëm për një projekt disposable.
- Mos e bëj `npx supabase db push --include-seed` në production.
- Mos bëj ndryshime direkte në remote pa migration të commit-uar.
- Para se të dërgosh rezultat, më jep vetëm `PROJECT_REF` ose konfirmo që `db push` kaloi. Mos dërgo asnjë secret.
