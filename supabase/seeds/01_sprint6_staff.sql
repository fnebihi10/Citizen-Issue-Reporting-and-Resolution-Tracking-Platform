-- Synthetic staff accounts for Sprint 6 development/staging verification.
-- This incremental seed never targets non-synthetic users.

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
    '00000000-0000-4000-8000-000000000010',
    'authenticated',
    'authenticated',
    'synthetic.official@example.test',
    extensions.crypt(
      'SyntheticDemoOnly!2026',
      extensions.gen_salt('bf')
    ),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Synthetic Infrastructure Official"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-4000-8000-000000000011',
    'authenticated',
    'authenticated',
    'synthetic.environment.official@example.test',
    extensions.crypt(
      'SyntheticDemoOnly!2026',
      extensions.gen_salt('bf')
    ),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Synthetic Environment Official"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  ),
  (
    '00000000-0000-0000-0000-000000000000',
    '00000000-0000-4000-8000-000000000020',
    'authenticated',
    'authenticated',
    'synthetic.admin@example.test',
    extensions.crypt(
      'SyntheticDemoOnly!2026',
      extensions.gen_salt('bf')
    ),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{"full_name":"Synthetic Demo Administrator"}'::jsonb,
    now(),
    now(),
    '',
    '',
    '',
    ''
  )
on conflict (id) do nothing;

insert into public.profiles (id, email, full_name, role, department_id)
values
  (
    '00000000-0000-4000-8000-000000000010',
    'synthetic.official@example.test',
    'Synthetic Infrastructure Official',
    'official',
    '11111111-1111-1111-1111-111111111111'
  ),
  (
    '00000000-0000-4000-8000-000000000011',
    'synthetic.environment.official@example.test',
    'Synthetic Environment Official',
    'official',
    '22222222-2222-2222-2222-222222222222'
  ),
  (
    '00000000-0000-4000-8000-000000000020',
    'synthetic.admin@example.test',
    'Synthetic Demo Administrator',
    'admin',
    null
  )
on conflict (id) do update set
  email = excluded.email,
  full_name = excluded.full_name,
  role = excluded.role,
  department_id = excluded.department_id;

commit;
