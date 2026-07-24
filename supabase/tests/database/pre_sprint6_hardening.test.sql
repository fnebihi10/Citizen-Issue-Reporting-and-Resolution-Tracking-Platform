begin;

set local search_path = public, extensions;

select plan(21);

select ok(
  extensions.st_distance(
    extensions.st_setsrid(
      extensions.st_makepoint(20.0, 42.0),
      4326
    )::extensions.geography,
    public.generalize_location(
      extensions.st_setsrid(
        extensions.st_makepoint(20.0, 42.0),
        4326
      )::extensions.geography,
      500
    )
  ) >= 50,
  'public locations are displaced from the exact private point'
);

select is(
  extensions.st_astext(
    public.generalize_location(
      extensions.st_setsrid(
        extensions.st_makepoint(20.001, 42.001),
        4326
      )::extensions.geography,
      500
    )::extensions.geometry
  ),
  extensions.st_astext(
    public.generalize_location(
      extensions.st_setsrid(
        extensions.st_makepoint(20.001, 42.001),
        4326
      )::extensions.geography,
      500
    )::extensions.geometry
  ),
  'location generalization is deterministic'
);

select col_not_exists(
  'public',
  'report_comments',
  'updated_at',
  'comments are immutable and have no misleading updated_at column'
);

select ok(
  exists (
    select 1
    from pg_catalog.pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'profiles_admin_update'
  ),
  'administrators have an explicit profile update policy'
);

select ok(
  exists (
    select 1
    from pg_catalog.pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_official_department_required'
  ),
  'official profiles require a department'
);

select ok(
  pg_catalog.has_function_privilege(
    'authenticated',
    'public.suggest_similar_reports(uuid,double precision,double precision,integer)',
    'EXECUTE'
  ),
  'authenticated users can request privacy-safe duplicate suggestions'
);

select ok(
  not pg_catalog.has_function_privilege(
    'anon',
    'public.suggest_similar_reports(uuid,double precision,double precision,integer)',
    'EXECUTE'
  ),
  'anonymous users cannot call the duplicate-suggestion RPC'
);

select ok(
  not pg_catalog.has_function_privilege(
    'authenticated',
    'public.generalize_location(extensions.geography,numeric)',
    'EXECUTE'
  ),
  'clients cannot call the internal location generalizer directly'
);

select ok(
  (
    select p.prosecdef
    from pg_catalog.pg_proc p
    join pg_catalog.pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'prepare_report'
      and p.pronargs = 0
  ),
  'prepare_report can invoke the private location generalizer from its trigger'
);

select is(
  (
    select count(*)
    from public.reports
    where id::text like '10000000-0000-4000-8000-%'
  ),
  120::bigint,
  'database seed contains all 120 deterministic synthetic reports'
);

select ok(
  exists (
    select 1
    from pg_catalog.pg_constraint
    where conrelid = 'public.reports'::regclass
      and conname = 'reports_address_text_length'
  ),
  'report address text has a database boundary'
);

select ok(
  exists (
    select 1
    from pg_catalog.pg_constraint
    where conrelid = 'public.report_attachments'::regclass
      and conname = 'report_attachments_report_path_matches'
  ),
  'attachment metadata must match the report UUID in its Storage path'
);

select ok(
  not exists (
    select 1
    from pg_catalog.pg_policies
    where schemaname = 'public'
      and tablename = 'reports'
      and policyname = 'reports_owner_edit_submitted'
  ),
  'citizens do not have a broad direct report-update policy'
);

select ok(
  exists (
    select 1
    from pg_catalog.pg_policies
    where schemaname = 'public'
      and tablename = 'reports'
      and policyname = 'reports_citizen_insert'
      and pg_catalog.position('current_user_role' in with_check) > 0
  ),
  'citizen report inserts require the authoritative citizen profile role'
);

select ok(
  exists (
    select 1
    from pg_catalog.pg_policies
    where schemaname = 'public'
      and tablename = 'report_attachments'
      and policyname = 'attachments_participant_or_authorized_staff_insert'
      and pg_catalog.position('kind' in with_check) > 0
  ),
  'attachment insert policy constrains the citizen attachment kind'
);

select is(
  (
    select attidentity
    from pg_catalog.pg_attribute
    where attrelid = 'public.reports'::regclass
      and attname = 'report_number'
  ),
  'a'::"char",
  'report_number is generated always by the database'
);

select ok(
  not pg_catalog.has_schema_privilege(
    'authenticated',
    'public',
    'CREATE'
  ),
  'Data API roles cannot create objects in the public schema'
);

select ok(
  exists (
    select 1
    from pg_catalog.pg_policies
    where schemaname = 'public'
      and tablename = 'categories'
      and policyname = 'categories_anon_read'
      and roles = array['anon']::name[]
  ),
  'active categories have a dedicated anonymous read policy'
);

select ok(
  pg_catalog.position(
    'pg_catalog.coalesce'
    in pg_catalog.pg_get_functiondef(
      'public.suggest_similar_reports(uuid,double precision,double precision,integer)'::regprocedure
    )
  ) = 0,
  'similar-report RPC does not schema-qualify the COALESCE SQL expression'
);

insert into auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  raw_user_meta_data,
  created_at,
  updated_at
)
values (
  '00000000-0000-0000-0000-000000000000',
  '90000000-0000-4000-8000-000000000001',
  'authenticated',
  'authenticated',
  'rate-limit-test@example.test',
  '{"full_name":"Rate Limit Test"}'::jsonb,
  now(),
  now()
);

set local role authenticated;
set local "request.jwt.claims" =
  '{"sub":"90000000-0000-4000-8000-000000000001","role":"authenticated"}';

insert into public.reports (
  title,
  description,
  category_id,
  citizen_id,
  location,
  created_at
)
select
  'Raport sintetik ' || series.number,
  'Përshkrim sintetik për testimin e kufirit të raportimeve.',
  'a1111111-1111-1111-1111-111111111111',
  '90000000-0000-4000-8000-000000000001',
  extensions.st_setsrid(
    extensions.st_makepoint(20.0 + series.number / 10000.0, 42.0),
    4326
  )::extensions.geography,
  '2000-01-01 00:00:00+00'::timestamptz
from pg_catalog.generate_series(1, 5) as series(number);

select is(
  (
    select count(*)
    from public.reports
    where citizen_id = '90000000-0000-4000-8000-000000000001'
      and created_at > now() - interval '1 minute'
  ),
  5::bigint,
  'authenticated report timestamps are overwritten by the server'
);

select throws_ok(
  $$
    insert into public.reports (
      title,
      description,
      category_id,
      citizen_id,
      location
    )
    values (
      'Raport sintetik i gjashtë',
      'Përshkrim sintetik që duhet të bllokohet nga rate limit.',
      'a1111111-1111-1111-1111-111111111111',
      '90000000-0000-4000-8000-000000000001',
      extensions.st_setsrid(
        extensions.st_makepoint(20.01, 42.0),
        4326
      )::extensions.geography
    )
  $$,
  'P0001',
  'REPORT_RATE_LIMIT_EXCEEDED',
  'the sixth citizen report within five minutes is rejected'
);

reset role;

select * from finish();

rollback;
