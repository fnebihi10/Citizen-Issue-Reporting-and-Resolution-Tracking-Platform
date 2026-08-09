# Deploy në Vercel

Ky udhëzues publikon release candidate-in e verifikuar pa futur secret key ose
të dhëna reale. Git branch-i autoritativ është `main`.

## 1. Krijo projektin

1. Në Vercel zgjidh **Add New → Project**.
2. Importo repository-n GitHub
   `Citizen-Issue-Reporting-and-Resolution-Tracking-Platform`.
3. Lëre framework-un **Next.js** dhe Root Directory `./`.
4. Mos ndrysho Build Command (`npm run build`) ose Install Command (`npm ci`).
5. Te **Settings → Environment Variables**, mbaje aktiv opsionin për ekspozimin
   automatik të Vercel System Environment Variables.

## 2. Environment variables

Vendosi për **Production** dhe **Preview**:

```text
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
NEXT_PUBLIC_SITE_URL=https://PROJECT_NAME.vercel.app
```

`NEXT_PUBLIC_SITE_URL` duhet të jetë vetëm origin-i HTTPS, pa path ose slash-e
shtesë. Në deploy-in e parë mund të lihet përkohësisht pa vlerë; aplikacioni
përdor domain-in production që Vercel ekspozon. Sapo Vercel ta caktojë domain-in
final, vendose vlerën eksplicite dhe bëj redeploy.

Mos shto `service_role`, secret key, database password ose token personal.

## 3. Konfiguro URL-të në Supabase Auth

Në **Authentication → URL Configuration**:

- Site URL: `https://PROJECT_NAME.vercel.app`
- Redirect URL production: `https://PROJECT_NAME.vercel.app/auth/callback`
- Redirect URL lokal: `http://localhost:3000/auth/callback`

Për preview deployments mund të shtohet modeli zyrtar i Vercel-it
`https://*-TEAM_OR_ACCOUNT_SLUG.vercel.app/**`. Production duhet të mbetet me
URL ekzakte.

## 4. Email-et e autentikimit

SMTP-ja standarde e Supabase është vetëm për zhvillim, lejon shumë pak email-e
dhe pa custom SMTP zakonisht dërgon vetëm te adresat e autorizuara të ekipit.
Për demo përdor llogari sintetike të konfirmuara paraprakisht. Para një release-i
publik me signup/reset real, konfiguro custom SMTP, template-t, CAPTCHA dhe
leaked-password protection sipas planit të Supabase.

## 5. Verifikimi pas deploy-it

1. Hape `/`, `/map`, `/robots.txt`, `/sitemap.xml` dhe një URL të panjohur.
2. Kontrollo signup/callback, login/logout dhe reset-password me një llogari
   testuese të autorizuar.
3. Hyr si citizen, official dhe admin; verifiko role boundaries dhe `no-store`.
4. Ekzekuto Playwright me `baseURL` e deployment-it ose përsërit checklist-ën
   manuale të `docs/test-plan.md`.
5. Kontrollo që harta publike nuk shfaq pikën private ose identitetin.
6. Ruaj URL-në, commit-in dhe rezultatet te `docs/sprint-10-verification.md`.

## 6. Rollback

Nëse një kontroll kritik dështon, mos ndrysho databazën direkt. Promovo në
Vercel deployment-in e fundit të verifikuar ose revert-o commit-in problematik,
pastaj korrigjo me migration/kod të review-uar dhe përsërit quality gate-in.
