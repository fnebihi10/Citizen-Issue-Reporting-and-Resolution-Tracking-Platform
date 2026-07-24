-- Local development/demo seed only.
-- All records below are synthetic and deliberately use a privacy-safe public point.
-- Do not run this seed against a production project.

begin;

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
)
values (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-4000-8000-000000000001',
  'authenticated',
  'authenticated',
  'synthetic.citizen@example.test',
  crypt('SyntheticDemoOnly!2026', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Synthetic Demo Citizen"}'::jsonb,
  now(),
  now(),
  '',
  '',
  '',
  ''
)
on conflict (id) do nothing;

insert into public.profiles (id, email, full_name, role)
values (
  '00000000-0000-4000-8000-000000000001',
  'synthetic.citizen@example.test',
  'Synthetic Demo Citizen',
  'citizen'
)
on conflict (id) do update set
  email = excluded.email,
  full_name = excluded.full_name,
  role = 'citizen';

insert into public.reports (
  id,
  title,
  description,
  category_id,
  citizen_id,
  status,
  priority,
  location,
  is_public,
  public_title,
  public_summary,
  public_location
)
values
  ('10000000-0000-4000-8000-000000000001', 'Shtyllë ndriçimi e dëmtuar — demo 1', 'Raportim sintetik për demonstrim. Nuk përfaqëson problem, person ose adresë reale.', 'b2222222-2222-2222-2222-222222222222', '00000000-0000-4000-8000-000000000001', 'submitted', 'normal', extensions.st_setsrid(extensions.st_makepoint(20.0000, 42.0000), 4326)::extensions.geography, false, 'Shtyllë ndriçimi e dëmtuar — demo 1', 'Raportim sintetik për demonstrim publik.', null),
  ('10000000-0000-4000-8000-000000000002', 'Trotuar i dëmtuar — demo 2', 'Raportim sintetik për demonstrim. Nuk përfaqëson problem, person ose adresë reale.', 'a1111111-1111-1111-1111-111111111111', '00000000-0000-4000-8000-000000000001', 'submitted', 'normal', extensions.st_setsrid(extensions.st_makepoint(20.0120, 42.0090), 4326)::extensions.geography, false, 'Trotuar i dëmtuar — demo 2', 'Raportim sintetik për demonstrim publik.', null),
  ('10000000-0000-4000-8000-000000000003', 'Mbeturina në hapësirë publike — demo 3', 'Raportim sintetik për demonstrim. Nuk përfaqëson problem, person ose adresë reale.', 'c3333333-3333-3333-3333-333333333333', '00000000-0000-4000-8000-000000000001', 'submitted', 'normal', extensions.st_setsrid(extensions.st_makepoint(19.9910, 41.9930), 4326)::extensions.geography, false, 'Mbeturina në hapësirë publike — demo 3', 'Raportim sintetik për demonstrim publik.', null),
  ('10000000-0000-4000-8000-000000000004', 'Sinjalistikë e dëmtuar — demo 4', 'Raportim sintetik për demonstrim. Nuk përfaqëson problem, person ose adresë reale.', 'd4444444-4444-4444-4444-444444444444', '00000000-0000-4000-8000-000000000001', 'submitted', 'normal', extensions.st_setsrid(extensions.st_makepoint(20.0210, 41.9970), 4326)::extensions.geography, false, 'Sinjalistikë e dëmtuar — demo 4', 'Raportim sintetik për demonstrim publik.', null),
  ('10000000-0000-4000-8000-000000000005', 'Asfalt i dëmtuar — demo 5', 'Raportim sintetik për demonstrim. Nuk përfaqëson problem, person ose adresë reale.', 'a1111111-1111-1111-1111-111111111111', '00000000-0000-4000-8000-000000000001', 'submitted', 'normal', extensions.st_setsrid(extensions.st_makepoint(19.9840, 42.0170), 4326)::extensions.geography, false, 'Asfalt i dëmtuar — demo 5', 'Raportim sintetik për demonstrim publik.', null),
  ('10000000-0000-4000-8000-000000000006', 'Zonë publike pa ndriçim — demo 6', 'Raportim sintetik për demonstrim. Nuk përfaqëson problem, person ose adresë reale.', 'b2222222-2222-2222-2222-222222222222', '00000000-0000-4000-8000-000000000001', 'submitted', 'normal', extensions.st_setsrid(extensions.st_makepoint(20.0180, 42.0240), 4326)::extensions.geography, false, 'Zonë publike pa ndriçim — demo 6', 'Raportim sintetik për demonstrim publik.', null),
  ('10000000-0000-4000-8000-000000000007', 'Kontejner i mbushur — demo 7', 'Raportim sintetik për demonstrim. Nuk përfaqëson problem, person ose adresë reale.', 'c3333333-3333-3333-3333-333333333333', '00000000-0000-4000-8000-000000000001', 'submitted', 'normal', extensions.st_setsrid(extensions.st_makepoint(19.9760, 41.9880), 4326)::extensions.geography, false, 'Kontejner i mbushur — demo 7', 'Raportim sintetik për demonstrim publik.', null),
  ('10000000-0000-4000-8000-000000000008', 'Vijëzim i zbehur — demo 8', 'Raportim sintetik për demonstrim. Nuk përfaqëson problem, person ose adresë reale.', 'd4444444-4444-4444-4444-444444444444', '00000000-0000-4000-8000-000000000001', 'submitted', 'normal', extensions.st_setsrid(extensions.st_makepoint(20.0280, 42.0060), 4326)::extensions.geography, false, 'Vijëzim i zbehur — demo 8', 'Raportim sintetik për demonstrim publik.', null)
on conflict (id) do nothing;

update public.reports
set status = 'under_review'
where id in (
  '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000006',
  '10000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000008'
) and status = 'submitted';

update public.reports
set status = 'assigned'
where id in (
  '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000006',
  '10000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000008'
) and status = 'under_review';

update public.reports
set status = 'in_progress'
where id in (
  '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000006',
  '10000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000008'
) and status = 'assigned';

update public.reports
set
  status = 'resolved',
  resolution_notes = 'Zgjidhje sintetike për demonstrim.',
  is_public = true,
  public_location = location
where id in (
  '10000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000002',
  '10000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000004',
  '10000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000006',
  '10000000-0000-4000-8000-000000000007', '10000000-0000-4000-8000-000000000008'
) and status = 'in_progress';

commit;
