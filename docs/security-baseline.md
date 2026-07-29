# Baza aktuale e sigurisë

## E implementuar në kod

- Next.js `16.2.11` dhe dependency audit pa vulnerabilitete të raportuara.
- Proxy i kufizuar te route-t e mbrojtura, me role nga `profiles`: `citizen`,
  `official`/`admin` dhe `admin`.
- PKCE callback, session cookies dhe përgjigje auth me `no-store`.
- Session-et e workspace-it skadojnë absolutisht një orë pas hyrjes;
  kontrolli server-side fail-closed plotësohet nga timer-i në browser dhe
  dalja prek vetëm session-in aktual.
- JWT-ja verifikohet server-side me `auth.getClaims()`; RPC-ja
  `current_request_context()` kontrollon session-in e nënshkruar te
  `auth.sessions`, rolin autoritativ te `profiles` dhe numrin e njoftimeve në
  një round trip. Header-at e kontekstit nga klienti hiqen para përdorimit.
- Redirect-e vetëm drejt path-eve të brendshme të validuara.
- Fjalëkalim minimal 10 karaktere me shkronja të mëdha/vogla dhe numër.
- Security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` dhe HSTS në production.
- Header-i identifikues `X-Powered-By` është çaktivizuar.
- RLS për profile, raporte, komente, attachments, njoftime dhe audit logs.
- Views publike të kufizuara vetëm te raporte të publikuara; bucket i provave është privat dhe immutable.
- Lokacioni publik gjenerohet server-side në grid 500 m dhe nuk pranon
  koordinatë publike të kontrolluar nga klienti.
- Fotografitë dekodohen dhe ri-enkodohen në browser para upload-it; nëse
  metadata EXIF/GPS nuk mund të hiqet, upload-i bllokohet.
- Krijimi i raportit kufizohet në 5 raporte për qytetar brenda 5 minutave në
  nivel databaze.
- RPC-ja e raporteve të ngjashme ekspozon vetëm lokacione publike të
  përgjithësuara ose raportet private të vetë qytetarit, me distancë të
  rrumbullakuar.
- Supabase clients përdorin tipe të gjeneruara nga skema remote; query-t nuk
  mbështeten më në `as Report[]`.
- `report_number`, pronari dhe `created_at` kontrollohen nga serveri; një
  timestamp i falsifikuar nuk anashkalon rate limit-in.
- Qytetari nuk ka policy për ndryshimin direkt të raportit pas dorëzimit dhe
  insert-i kërkon rolin autoritativ `citizen`; qytetari nuk mund të
  regjistrojë provë me llojin `resolution`.
- Storage path-i duhet të përputhet me `report_id`; objekti mund të pastrohet
  nga uploader-i vetëm para regjistrimit të metadata-s. Pas regjistrimit prova
  është immutable, përveç ndërhyrjes administrative.
- SECURITY DEFINER functions përdorin `search_path` bosh dhe rolet e Data API
  nuk kanë privilegj `CREATE` në schema `public`.
- Route-t `/admin/*` kërkojnë rolin autoritativ `admin`; ndryshimet e
  roleve/departamenteve/kategorive auditohen nga trigger-at e databazës.
- Administratori nuk mund ta ulë vetë rolin, një zyrtar kërkon departament
  aktiv dhe departamenti me zyrtarë nuk mund të çaktivizohet para ricaktimit.
- Eksportet administrative përdorin allowlist fushash operative, përjashtojnë
  të dhënat personale/private dhe regjistrohen para shkarkimit.

## Konfigurime manuale para deploy-it

1. Vendos URL-në HTTPS të Vercel-it si Site URL dhe callback URL në Supabase.
2. Konfiguro SMTP të personalizuar; shërbimi standard i Supabase është vetëm për testim dhe ka kufizime të ulëta të email-eve.
3. Aktivizo CAPTCHA për signup/reset kur aplikacioni bëhet publik.
4. Aktivizo leaked-password protection nëse plani e mbështet.
5. Vendos environment variables në Vercel; kurrë secret key në `NEXT_PUBLIC_*`.
6. Kryej testet RLS/RBAC dhe raportin e 25+ testeve në Sprintin 9.

## Nuk bëjmë ende

- Nuk shtojmë `service_role`/secret key; operacionet administrative përdorin
  session-in e adminit, RLS dhe RPC/trigger-a të guard-uar.
- Nuk vendosim Content Security Policy me `unsafe-inline`; CSP me nonce do të shtohet në Sprintin 10 pasi të përfshihen harta dhe provider-at e jashtëm.
- Nuk bëjmë ndryshime direkte në Supabase Cloud pa migration të commit-uar.
