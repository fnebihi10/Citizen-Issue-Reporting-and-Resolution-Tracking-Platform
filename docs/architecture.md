# Arkitektura teknike

## Vendimi kryesor

Platforma përdor një aplikacion të vetëm Next.js App Router me TypeScript. Supabase ofron Auth, PostgreSQL/PostGIS dhe Object Storage. Ky kufi mban implementimin e përshtatshëm për Bachelor, por pa sakrifikuar autorizimin në nivel databaze.

```text
Browser / Mobile Web
        |
        v
Next.js 16 (Vercel planifikohet në Sprintin 10)
  public UI | auth UI | protected workspace
        |
        +------ Supabase ------+
        | Auth | PostgreSQL/PostGIS | Storage
        |
        +-- OpenStreetMap + React Leaflet
```

## Organizimi i aplikacionit

- `app/(marketing)` — faqja publike dhe chrome publik.
- `app/(auth)` — Login, Register, reset password dhe PKCE callback; nuk trashëgon navbar/footer publik.
- `app/(workspace)` — route-t e mbrojtura `/account`, `/citizen/report` dhe `/citizen/reports`.
- `components/` — UI e ripërdorshme, harta Leaflet dhe format; pa SQL ose privilegje databaze.
- `lib/auth` — validimi i fjalëkalimit, mesazhet e kontrolluara dhe redirect-et e sigurta.
- `lib/supabase` — klientë browser/server të tipizuar nga
  `types/supabase.ts` dhe rifreskimi i session-it.
- `lib/reports` — validimi, sanitizimi fail-closed i fotografive dhe
  normalizimi i të dhënave publike.
- `supabase/migrations` — burimi i vetëm autoritativ për skemën, RLS dhe Storage.

## Kufijtë e sigurisë

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` lejohet në browser; RLS është mbrojtja reale.
- Asnjë secret key nuk përdoret në Sprintin 3.
- Roli ruhet te `profiles`, jo te user metadata e kontrollueshme nga klienti.
- Views publike nxjerrin vetëm të dhëna të sanitizuara të raporteve të
  publikuara; koordinata publike llogaritet nga trigger-i, jo nga browser-i.
- `proxy.ts` prek vetëm route-t e mbrojtura dhe zbaton matricën e roleve nga
  `profiles`; faqet publike dhe format e autentikimit nuk bëjnë thirrje të
  panevojshme te Auth në çdo ngarkim.
- Kontrolli server-side me `auth.getUser()` mbetet i detyrueshëm edhe kur Proxy ka bërë redirect.
- Headers bazë të sigurisë vendosen për çdo përgjigje; HSTS shtohet vetëm në production HTTPS.

## Vendime të qëllimshme

- Nuk përdorim NestJS në këtë fazë; do të shtonte një backend të dytë pa vlerë për fushëveprimin aktual.
- Harta publike dhe zgjedhja e lokacionit përdorin OpenStreetMap + React Leaflet; geocoding dhe cache nuk janë pjesë e Sprintit 5.
- Të dhënat e demo-s janë 120 raporte deterministike sintetike; JSON-i dhe SQL
  seed-i gjenerohen bashkë dhe nuk mbajnë adresa ose foto reale.
- Projekti përdor Next.js `16.2.11`; Turbopack është default për `next dev`
  dhe `next build`.

## Definition of Done

Një modul mbyllet vetëm kur ka UI responsive, validim klient/server, autorizim me RLS, loading/error state, dokumentim, lint/typecheck/build të suksesshëm dhe test funksional të dokumentuar.

Diagramet që përputhen me implementimin aktual ruhen te
[`diagrams/README.md`](../diagrams/README.md). Eksportet e hershme PNG/Draw.io
trajtohen si drafte historike kur devijojnë nga ky burim.
