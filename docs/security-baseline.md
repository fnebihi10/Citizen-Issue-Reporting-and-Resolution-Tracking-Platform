# Baza e sigurisë — Sprint 3

## E implementuar në kod

- Next.js 16 Active LTS dhe dependency audit pa vulnerabilitete të raportuara.
- Proxy i kufizuar vetëm te route-t autentikuese dhe të mbrojtura.
- PKCE callback, session cookies dhe përgjigje auth me `no-store`.
- Redirect-e vetëm drejt path-eve të brendshme të validuara.
- Fjalëkalim minimal 10 karaktere me shkronja të mëdha/vogla dhe numër.
- Security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` dhe HSTS në production.
- RLS për profile, raporte, komente, attachments, njoftime dhe audit logs.
- Views publike të kufizuara vetëm te raporte të publikuara; bucket i provave është privat dhe immutable.

## Konfigurime manuale para deploy-it

1. Vendos URL-në HTTPS të Vercel-it si Site URL dhe callback URL në Supabase.
2. Konfiguro SMTP të personalizuar; shërbimi standard i Supabase është vetëm për testim dhe ka kufizime të ulëta të email-eve.
3. Aktivizo CAPTCHA për signup/reset kur aplikacioni bëhet publik.
4. Aktivizo leaked-password protection nëse plani e mbështet.
5. Vendos environment variables në Vercel; kurrë secret key në `NEXT_PUBLIC_*`.
6. Kryej testet RLS/RBAC dhe raportin e 25+ testeve në Sprintin 9.

## Nuk bëjmë ende

- Nuk shtojmë `service_role`/secret key, sepse nuk ka operacion administrativ server-side që e kërkon.
- Nuk vendosim Content Security Policy me `unsafe-inline`; CSP me nonce do të shtohet në Sprintin 10 pasi të përfshihen harta dhe provider-at e jashtëm.
- Nuk bëjmë ndryshime direkte në Supabase Cloud pa migration të commit-uar.
