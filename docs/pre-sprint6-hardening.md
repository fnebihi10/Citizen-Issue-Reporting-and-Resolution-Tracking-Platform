# Pre-Sprint 6 critical hardening

Ky dokument lidh gjetjet P0 me implementimin dhe provat reale. Një skedar ose
test i planifikuar nuk shënohet si provë e kaluar.

| Gjetja | Gjendja | Implementimi / prova |
|---|---|---|
| P0-1 public location | Zgjidhur | `generalize_location`, trigger server-side, constraint ≥50 m; remote dev minimumi i matur 54 m |
| P0-2 EXIF/GPS | Zgjidhur | `stripExif.ts`, ri-enkodim canvas fail-closed, teste Vitest |
| P0-3 report rate limit | Zgjidhur | 5 raporte / 5 minuta me advisory lock; kontroll remote transaksional me rollback |
| P0-4 admin profile update | Zgjidhur | RLS `profiles_admin_update` + official kërkon department; kontroll remote me rollback |
| P0-5 query types | Zgjidhur | `types/supabase.ts` gjeneruar nga remote dhe Supabase clients typed; casts e query-ve u hoqën |
| P0-6 notifications | Sprint 6 | Trigger-i i njoftimeve dhe UI-ja e tyre duhet të implementohen bashkë me workflow-n zyrtar |
| P0-7 mutable comments | Zgjidhur | `updated_at`/trigger u hoqën dhe privilegji UPDATE u revokua |
| P0-8 citizen report detail | Sprint 6 | `/citizen/reports/[id]` është kriter hyrës për historinë, komentet dhe destinacionin e njoftimeve |
| P0-9 database seed 100+ | Zgjidhur | 120 raporte në DB, 104 publike; JSON/SQL kontrollohen me `npm run check:dataset` |
| P0-10 similar reports | Zgjidhur | RPC vetëm authenticated, public generalized/own private, distancë e rrumbullakuar; UI në formular |

## Kontrolli i session refresh-it

`@supabase/ssr` është i fiksuar në versionin `0.10.0`. Në këtë version
`setAll(cookiesToSet, headers)` dërgon edhe header-at `Cache-Control`, `Expires`
dhe `Pragma` kur rifreskon cookie-t e autentikimit. Middleware-i i ruan këta
header-a dhe përdor një objekt bosh si fallback, prandaj nuk thërret
`Object.entries(undefined)`.

## Audit shtesë i integritetit

Migration-i `20260724230000_sprint5_integrity_hardening.sql` mbyll bypass-et që
nuk shfaqen nga UI-ja normale:

- timestamp i falsifikuar nuk anashkalon rate limit-in;
- qytetari nuk ndryshon fushat operative pas dorëzimit;
- `report_id` dhe Storage path duhet të përputhen;
- qytetari regjistron vetëm prova `evidence`;
- prova e regjistruar nuk fshihet nga uploader-i;
- përmbajtja e njoftimit është immutable dhe marrësi ndryshon vetëm `read_at`.

Smoke test-i remote zbuloi dhe migration-i
`20260724231500_fix_similarity_rpc.sql` korrigjoi thirrjen e pavlefshme
`pg_catalog.coalesce(...)`; RPC-ja tani ekzekutohet realisht, jo vetëm
kompilohet gjatë krijimit.

I njëjti test zbuloi që policy e përbashkët `anon, authenticated` për
kategoritë/departamentet mund të thërriste helper-in staff-only edhe në degën
publike të një shprehjeje `OR`. Migration-i
`20260724233000_fix_public_reference_rls.sql` i ndan policy-t sipas rolit.

Auditimi i privilegjeve të trigger-ave identifikoi se një zyrtar i
autentikuar mund të autorizohej për publikim, por `prepare_report()` nuk mund
ta thërriste helper-in privat `generalize_location()` me privilegjet e
invoker-it. Migration-i
`20260724234500_secure_report_trigger_execution.sql` e ekzekuton trigger-in si
`SECURITY DEFINER`, me `search_path` bosh dhe pa privilegj të drejtpërdrejtë
RPC për rolet e API-së.

RBAC-u u forcua edhe jashtë UI-së: Proxy ndan hapësirat `citizen`, `official`
dhe `admin` sipas rolit nga `profiles`, ndërsa migration-i
`20260724235000_enforce_citizen_report_role.sql` kërkon rolin autoritativ
`citizen` në policy-n e insert-it. Server action-i bën të njëjtin kontroll për
një mesazh të kuptueshëm, por DB mbetet kufiri final i autorizimit.

## Sprint 6 entry gate

Sprinti 6 mund të fillojë vetëm pasi validimet e këtij hardening pass-i të
kalojnë. Brenda Sprintit 6, P0-6 dhe P0-8 trajtohen para se workflow-i të
deklarohet i përfunduar.
