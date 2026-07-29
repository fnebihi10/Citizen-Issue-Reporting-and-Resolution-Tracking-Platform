begin;

set local search_path = public, extensions;

select plan(22);

select ok(
  pg_catalog.has_function_privilege(
    'authenticated',
    'public.record_admin_export(text,jsonb,integer)',
    'EXECUTE'
  ),
  'authenticated users can invoke the guarded export audit RPC'
);

select ok(
  not pg_catalog.has_function_privilege(
    'anon',
    'public.record_admin_export(text,jsonb,integer)',
    'EXECUTE'
  ),
  'anonymous users cannot invoke the export audit RPC'
);

select has_trigger(
  'public',
  'profiles',
  'profiles_audit_admin_change',
  'profile access changes have an audit trigger'
);

select has_trigger(
  'public',
  'departments',
  'departments_audit_admin_change',
  'department changes have an audit trigger'
);

select has_trigger(
  'public',
  'categories',
  'categories_audit_admin_change',
  'category and SLA changes have an audit trigger'
);

select has_index(
  'public',
  'profiles',
  'profiles_admin_directory_idx',
  'the admin user directory has a supporting index'
);

select ok(
  pg_catalog.has_table_privilege(
    'authenticated',
    'public.departments',
    'INSERT'
  )
  and pg_catalog.has_table_privilege(
    'authenticated',
    'public.departments',
    'UPDATE'
  ),
  'authenticated Data API sessions have grants needed for admin RLS'
);

select ok(
  pg_catalog.has_table_privilege(
    'authenticated',
    'public.categories',
    'INSERT'
  )
  and pg_catalog.has_table_privilege(
    'authenticated',
    'public.categories',
    'UPDATE'
  ),
  'category management has Data API grants guarded by admin RLS'
);

set local role authenticated;
set local "request.jwt.claims" =
  '{"sub":"00000000-0000-4000-8000-000000000020","role":"authenticated"}';

select throws_ok(
  $$
    update public.profiles
    set email = 'changed-by-admin@example.test'
    where id = '00000000-0000-4000-8000-000000000001'
  $$,
  '42501',
  'PROFILE_IDENTITY_MANAGED_BY_AUTH',
  'profile email identity remains managed by Supabase Auth'
);

insert into public.departments (
  id,
  name,
  code,
  description
)
values (
  '90000000-0000-4000-8000-000000000070',
  'Departamenti sintetik i Sprintit 7',
  'SP7',
  'Vetëm për testin transaksional pgTAP.'
);

select is(
  (
    select count(*)
    from public.audit_logs
    where action = 'departments.created'
      and entity_id = '90000000-0000-4000-8000-000000000070'
      and actor_id = '00000000-0000-4000-8000-000000000020'
  ),
  1::bigint,
  'department creation is attributed to the administrator'
);

insert into public.categories (
  id,
  slug,
  name,
  default_sla_hours,
  department_id
)
values (
  '90000000-0000-4000-8000-000000000071',
  'kategori-sintetike-sprint-7',
  'Kategori sintetike Sprint 7',
  36,
  '90000000-0000-4000-8000-000000000070'
);

select is(
  (
    select count(*)
    from public.audit_logs
    where action = 'categories.created'
      and entity_id = '90000000-0000-4000-8000-000000000071'
  ),
  1::bigint,
  'category creation is audited'
);

update public.categories
set default_sla_hours = 12
where id = '90000000-0000-4000-8000-000000000071';

select is(
  (
    select details ->> 'default_sla_hours'
    from public.audit_logs
    where action = 'categories.updated'
      and entity_id = '90000000-0000-4000-8000-000000000071'
    order by created_at desc
    limit 1
  ),
  '12',
  'an SLA change records the new operational value'
);

update public.profiles
set
  role = 'official',
  department_id = '90000000-0000-4000-8000-000000000070'
where id = '00000000-0000-4000-8000-000000000003';

select is(
  (
    select role
    from public.profiles
    where id = '00000000-0000-4000-8000-000000000003'
  ),
  'official'::public.user_role,
  'an administrator can promote a citizen into an active department'
);

select is(
  (
    select count(*)
    from public.audit_logs
    where action = 'profiles.updated'
      and entity_id = '00000000-0000-4000-8000-000000000003'
  ),
  1::bigint,
  'the access change is audited'
);

select throws_ok(
  $$
    update public.departments
    set is_active = false
    where id = '90000000-0000-4000-8000-000000000070'
  $$,
  '23514',
  'DEPARTMENT_HAS_ACTIVE_OFFICIALS',
  'a department with assigned officials cannot be deactivated'
);

update public.profiles
set role = 'citizen'
where id = '00000000-0000-4000-8000-000000000003';

select throws_ok(
  $$
    update public.departments
    set is_active = false
    where id = '90000000-0000-4000-8000-000000000070'
  $$,
  '23514',
  'DEPARTMENT_HAS_ACTIVE_CATEGORIES',
  'a department with active categories cannot be deactivated'
);

select throws_ok(
  $$
    update public.profiles
    set role = 'citizen'
    where id = '00000000-0000-4000-8000-000000000020'
  $$,
  '42501',
  'ADMIN_CANNOT_DEMOTE_SELF',
  'the active administrator cannot demote their own profile'
);

select isnt(
  public.record_admin_export(
    'csv',
    '{"status":"submitted"}'::jsonb,
    17
  ),
  null::uuid,
  'an administrator can record a privacy-safe export event'
);

select is(
  (
    select count(*)
    from public.audit_logs
    where action = 'reports.exported'
      and details ->> 'row_count' = '17'
  ),
  1::bigint,
  'the export audit stores its row count'
);

set local "request.jwt.claims" =
  '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}';

select throws_ok(
  $$
    update public.profiles
    set role = 'admin'
    where id = '00000000-0000-4000-8000-000000000001'
  $$,
  '42501',
  'ADMIN_ROLE_REQUIRED',
  'a citizen cannot elevate their own role'
);

select throws_ok(
  $$
    select public.record_admin_export('json', '{}'::jsonb, 1)
  $$,
  '42501',
  'ADMIN_ROLE_REQUIRED',
  'a citizen cannot create an export audit event'
);

select is(
  (
    select count(*)
    from public.audit_logs
  ),
  0::bigint,
  'a citizen cannot read the administrative audit trail'
);

reset role;

select * from finish();

rollback;
