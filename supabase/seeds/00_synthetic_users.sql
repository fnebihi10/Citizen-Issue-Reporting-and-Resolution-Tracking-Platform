-- Synthetic owners for generated development/staging reports.
-- This separate ordered file also works with incremental remote seed tracking.
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
values
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-4000-8000-000000000001',
    'authenticated',
    'authenticated',
    'synthetic.citizen@example.test',
    extensions.crypt(
      'SyntheticDemoOnly!2026',
      extensions.gen_salt('bf')
    ),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Synthetic Demo Citizen"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-4000-8000-000000000002',
    'authenticated',
    'authenticated',
    'synthetic.citizen2@example.test',
    extensions.crypt(
      'SyntheticDemoOnly!2026',
      extensions.gen_salt('bf')
    ),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Synthetic Demo Citizen 2"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-4000-8000-000000000003',
    'authenticated',
    'authenticated',
    'synthetic.citizen3@example.test',
    extensions.crypt(
      'SyntheticDemoOnly!2026',
      extensions.gen_salt('bf')
    ),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Synthetic Demo Citizen 3"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
on conflict (id) do nothing;

insert into public.profiles (id, email, full_name, role)
values
  (
    '00000000-0000-4000-8000-000000000001',
    'synthetic.citizen@example.test',
    'Synthetic Demo Citizen',
    'citizen'
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'synthetic.citizen2@example.test',
    'Synthetic Demo Citizen 2',
    'citizen'
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    'synthetic.citizen3@example.test',
    'Synthetic Demo Citizen 3',
    'citizen'
  )
on conflict (id) do update set
  email = excluded.email,
  full_name = excluded.full_name,
  role = 'citizen',
  department_id = null;

commit;
