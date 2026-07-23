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
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Mos e vendos `service_role` key në chat, GitHub, `.env.example` ose në ndonjë komponent React. Për Sprintin 2 nuk na duhet fare; do të përdoret vetëm server-side kur të kemi route handlers administrative.

## 3. Aktivizo PostGIS

Hap **Database → Extensions**, kërko `postgis` dhe aktivizoje në schema `extensions` nëse Dashboard-i ta kërkon. Migration-i i projektit e përdor `extensions.geography(Point, 4326)` dhe e kontrollon edhe vetë aktivizimin.

PostGIS është i nevojshëm për lokacionet, spatial index, filtrat e hartës dhe sugjerimin e raportimeve të afërta. Dokumentimi zyrtar: [PostGIS në Supabase](https://supabase.com/docs/guides/database/extensions/postgis).

## 4. Apliko migrations

Migrations janë burimi autoritativ. Mos i krijo tabelat manualisht në Table Editor dhe mos e përdor migration-in e vjetër `01_schema_and_rls.sql`.

Pasi të kesh Supabase CLI të instaluar:

```bash
supabase login
supabase link --project-ref PROJECT_REF
supabase migration list
supabase db push --dry-run
supabase db push
```

Nëse CLI kërkon database password, përdor password-in që vendose gjatë krijimit të projektit. Migrations aplikohen sipas rendit:

1. `20260723180000_foundation.sql` — tabela, trigger-a, views, domain rules dhe RLS;
2. `20260723180100_reference_data.sql` — departamentet dhe kategoritë fillestare;
3. `20260723180200_storage.sql` — bucket-i privat dhe politikat fillestare të Storage;
4. `20260723213000_security_hardening.sql` — filtrimi i views publike, privatësia e profilit dhe provat e brendshme.

Dokumentimi zyrtar: [Supabase database migrations](https://supabase.com/docs/guides/deployment/database-migrations).

Nëse nuk e ke CLI-në, për këtë projekt mund t’i ekzekutosh SQL files në SQL Editor në të njëjtin rend, por më pas duhet ta regjistrojmë gjendjen me CLI që migration history të mos dalë jashtë sinkronizimit.

## 5. Çfarë duhet të shohësh pas migrimit

Në Database → Tables duhet të shfaqen `departments`, `categories`, `profiles`, `reports`, `report_status_history`, `report_comments`, `report_attachments`, `notifications` dhe `audit_logs`.

Në Database → Views duhet të shfaqen vetëm views publike të sanitizuara:

- `public_reports`;
- `public_report_comments`;
- `public_report_status_history`.

Në Storage duhet të ekzistojë bucket-i `report-evidence` dhe të jetë **private**. Storage kontrollohet me RLS në `storage.objects`; një bucket publik nuk është i pranueshëm për fotografitë e raportimeve.

## 6. Rregulla që nuk thyhen

- Mos e ndrysho rolin nga `raw_user_meta_data`; signup-i krijon gjithmonë `citizen`.
- Mos bëj `db reset --linked`; ai fshin databazën remote dhe lejohet vetëm për një projekt disposable.
- Mos e bëj `db push --include-seed` në production.
- Mos bëj ndryshime direkte në remote pa migration të commit-uar.
- Para se të dërgosh rezultat, më jep vetëm `PROJECT_REF` ose konfirmo që `db push` kaloi. Mos dërgo asnjë secret.
