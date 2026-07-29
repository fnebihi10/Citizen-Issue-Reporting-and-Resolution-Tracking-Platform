# Autentikimi dhe RBAC — Sprint 3

## Konfigurimi i detyrueshëm në Supabase Cloud

`supabase/config.toml` dokumenton konfigurimin lokal. Për projektin e hostuar, hap Supabase Dashboard dhe vendos të njëjtat rregulla manualisht.

Në **Authentication → URL Configuration**:

- **Site URL:** `http://localhost:3000`
- **Additional Redirect URLs:** `http://localhost:3000/auth/callback`

Në **Authentication → Providers → Email**:

- Email provider: enabled;
- Allow new users to sign up: enabled;
- Confirm email: enabled.

Në konfigurimin e sigurisë së fjalëkalimit vendos:

- minimumi 10 karaktere;
- së paku shkronjë e madhe, e vogël dhe numër;
- leaked-password protection, nëse plani i Supabase e ofron;
- secure password change: enabled.

Për testim lokal, këto vlera janë pasqyruar edhe te [`supabase/config.toml`](../supabase/config.toml). Për produksion, përdor domain-in HTTPS real në vend të `localhost` dhe mos shto wildcard të pakufizuar.

## Flukset e implementuara

- `/register` — krijon vetëm qytetar; forma nuk pranon rol.
- `/auth/callback` — shkëmben kodin PKCE me session cookie dhe bën redirect të sigurt intern.
- `/login` — përdor `signInWithPassword`, mesazhe gabimi të kontrolluara dhe `next` redirect të sanitizuar.
- `/forgot-password` — dërgon kërkesë për reset pa zbuluar nëse email-i ekziston.
- `/update-password` — kërkon session të vlefshëm dhe vendos fjalëkalimin e ri.
- `/account` — lexon profilin në server; route-i është i mbrojtur edhe me Proxy edhe me kontroll server-side.
- Hyrja pa një destinacion `next` e dërgon qytetarin te `/citizen` dhe stafin
  te `/official`; një destinacion i brendshëm eksplicit ruhet.
- Çdo session i workspace-it ka jetëgjatësi absolute një orë nga
  `last_sign_in_at`. Proxy e zbaton para çdo route-i të mbrojtur, ndërsa
  header-i mban timer-in aktiv edhe kur faqja mbetet e hapur.
- Pas skadimit mbyllet vetëm session-i i browser-it aktual, ruhet destinacioni
  i brendshëm dhe login-i shpjegon pse kërkohet hyrje e re.
- `SignOutButton` — mbyll vetëm session-in lokal dhe jep feedback në rast gabimi.

`@supabase/ssr` përdor PKCE dhe cookie-based sessions. Callback-i ruan përgjigjet e autentikimit me `Cache-Control: private, no-store`, për të shmangur cache të session cookie-ve.

Proxy kontrollon rolin nga `profiles`, jo nga metadata e klientit:

- `/citizen/*` — vetëm `citizen`;
- `/official/*` — `official` ose `admin`;
- `/admin/*` — vetëm `admin`;
- `/account` — çdo përdorues i autentikuar.

Redirect-et e Proxy-t bartin edhe cookie-t/header-at e një session refresh-i, që
kontrolli i rolit të mos ndërpresë rifreskimin e vlefshëm të sesionit.
Rifreskimi automatik i JWT-së nuk e zgjat kufirin absolut njëorësh të
aplikacionit.

## Rolet

Signup-i krijon gjithmonë `citizen` në trigger-in e databazës. `official` dhe `admin` nuk mund të caktohen nga browser-i; do të menaxhohen në panelin administrativ në Sprintin 7.

## Checklistë para testit të parë

1. `.env.local` ka `NEXT_PUBLIC_SUPABASE_URL` dhe `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
2. Site URL dhe callback URL janë ruajtur në Dashboard.
3. Email confirmations janë aktivizuar.
4. Ke një email testues që mund ta hapësh.
5. Nuk ke dërguar publishable key ose database password në chat/Git.

Dokumentim: [Password-based Auth](https://supabase.com/docs/guides/auth/passwords), [PKCE](https://supabase.com/docs/guides/auth/sessions/pkce-flow), [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).
