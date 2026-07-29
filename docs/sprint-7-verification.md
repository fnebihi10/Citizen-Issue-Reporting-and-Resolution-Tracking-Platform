# Sprint 7 verification

Ky dokument lidh kriteret e pranimit të administrimit me implementimin dhe
provat e ekzekutueshme. Migration-et dhe testet historike ruhen sepse një
databazë e re dhe CI i ekzekutojnë në rend; dokumenti i përkohshëm
`pre-sprint6-hardening.md` u hoq pasi gjetjet e tij janë tashmë pjesë e
`security-baseline.md`, regression tests dhe historisë së migration-eve.

## Fusha e Sprintit 7

| Kriteri | Implementimi | Prova |
|---|---|---|
| Panel administrativ | `/admin`, metrika dhe veprime kryesore | Route vetëm për `admin`; responsive UI |
| Role dhe departamente | `/admin/users` + RLS `profiles_admin_update` | Validim aplikacioni, constraint dhe pgTAP |
| Mbrojtje nga lockout | Admini nuk e ul vetë rolin | Trigger + unit/pgTAP |
| Strukturë komunale | `/admin/structure` | CRUD i kontrolluar për departamente/kategori |
| Integritet organizativ | Official kërkon departament aktiv; departamenti me zyrtarë nuk çaktivizohet | Trigger + pgTAP |
| SLA fillestare | `categories.default_sla_hours` | Kufiri 1–8760 në UI dhe DB |
| Monitorim afatesh | `/admin/sla` | Metrika exact + radhë e filtruar |
| Audit log | `/admin/audit` | Trigger-a server-side, RLS read-only |
| CSV/JSON | `/admin/exports` | Hartëzim allowlist, CSV escaping, unit tests |
| Privatësia e eksportit | Pa identitet, kontakt, përshkrim/adresë private ose koordinata | Unit test + fushat e route-it |
| Auditimi i eksportit | `record_admin_export()` para shkarkimit | RPC e guard-uar + pgTAP |
| Navigimi sipas rolit | Admin login/home -> `/admin` | Unit test i redirect-it + Proxy RBAC |
| Shpejtësia e workspace-it | JWT lokale + `current_request_context()` dhe query paralele | 8 assertions pgTAP + 3 unit tests të header-ave |

## Kontrollet

- `npm run typecheck` — passed;
- `npm run lint` — passed pa warnings;
- `npm test` — 69/69 teste passed;
- `npm run check:dataset` — passed;
- `npm run build` — passed dhe gjeneroi të gjitha route-t `/admin/*`;
- `npx supabase test db` — testet e Sprintit 7 janë shkruar me 30 assertions
  (22 governance + 8 request context), por
  ekzekutimi lokal u bllokua nga Docker Desktop që ktheu API `500` para
  lidhjes me PostgreSQL. Ky gate nuk shënohet si passed pa një run real.

GitHub Actions mbetet gate-i autoritativ për databazën e izoluar. Para
aplikimit në projektin dev/staging, kontrollohen `supabase migration list`,
`supabase db push --dry-run`, pastaj rigjenerohen tipet nga skema e aplikuar.

## Kufiri me Sprintin 8

Sprinti 7 ofron metrika administrative dhe monitorim SLA. Faqja e plotë
publike e raportit, filtrat publikë, heatmap dhe analitika e transparencës
mbeten qëllimisht në Sprintin 8.
