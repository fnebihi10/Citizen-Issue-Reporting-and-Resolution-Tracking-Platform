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
- `SignOutButton` — mbyll session-in dhe jep feedback në rast gabimi.

`@supabase/ssr` përdor PKCE dhe cookie-based sessions. Callback-i ruan përgjigjet e autentikimit me `Cache-Control: private, no-store`, për të shmangur cache të session cookie-ve.

## Rolet

Signup-i krijon gjithmonë `citizen` në trigger-in e databazës. `official` dhe `admin` nuk mund të caktohen nga browser-i; do të menaxhohen në panelin administrativ në Sprintin 7.

## Checklistë para testit të parë

1. `.env.local` ka `NEXT_PUBLIC_SUPABASE_URL` dhe `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
2. Site URL dhe callback URL janë ruajtur në Dashboard.
3. Email confirmations janë aktivizuar.
4. Ke një email testues që mund ta hapësh.
5. Nuk ke dërguar publishable key ose database password në chat/Git.

Dokumentim: [Password-based Auth](https://supabase.com/docs/guides/auth/passwords), [PKCE](https://supabase.com/docs/guides/auth/sessions/pkce-flow), [Redirect URLs](https://supabase.com/docs/guides/auth/redirect-urls).
