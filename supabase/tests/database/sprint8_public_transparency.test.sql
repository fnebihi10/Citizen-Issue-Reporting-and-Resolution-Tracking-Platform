begin;

set local search_path = public, extensions;

select plan(14);

select has_index(
  'public',
  'reports',
  'reports_public_transparency_idx',
  'public transparency filtering has a supporting partial index'
);

select ok(
  pg_catalog.has_table_privilege('anon', 'public.public_reports', 'SELECT'),
  'anonymous visitors can read sanitized public reports'
);

select ok(
  pg_catalog.has_table_privilege(
    'anon',
    'public.public_report_comments',
    'SELECT'
  ),
  'anonymous visitors can read sanitized public comments'
);

select ok(
  pg_catalog.has_table_privilege(
    'anon',
    'public.public_report_status_history',
    'SELECT'
  ),
  'anonymous visitors can read sanitized public status history'
);

select ok(
  (
    select 'security_barrier=true' = any(c.reloptions)
    from pg_catalog.pg_class c
    join pg_catalog.pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname = 'public_reports'
      and c.relkind = 'v'
  ),
  'public reports is a security-barrier view'
);

select ok(
  not exists (
    select 1
    from information_schema.columns c
    where c.table_schema = 'public'
      and c.table_name in (
        'public_reports',
        'public_report_comments',
        'public_report_status_history'
      )
      and c.column_name in (
        'citizen_id',
        'author_id',
        'changed_by',
        'email',
        'phone',
        'location',
        'address_text',
        'object_path',
        'note'
      )
  ),
  'public views expose no identity, exact-location, evidence or internal-note columns'
);

select is(
  (select count(*) from public.public_reports),
  104::bigint,
  'only the 104 explicitly published synthetic reports are visible'
);

select ok(
  not exists (
    select 1
    from public.public_reports pr
    join public.reports r on r.id = pr.id
    where r.is_public = false
      or r.public_location is null
  ),
  'private reports cannot enter the public report view'
);

select ok(
  not exists (
    select 1
    from public.public_report_comments pc
    join public.report_comments rc on rc.id = pc.id
    where rc.is_internal = true
  ),
  'internal staff comments never enter the public comment view'
);

select ok(
  not exists (
    select 1
    from public.public_report_comments pc
    where pc.author_label not in ('Qytetar', 'Zyrtar komunal')
  ),
  'public comments use generic author labels only'
);

select ok(
  not exists (
    select 1
    from public.public_report_status_history ph
    join public.reports r on r.id = ph.report_id
    where r.is_public = false
      or r.public_location is null
  ),
  'status history is returned only for public reports'
);

select ok(
  not exists (
    select 1
    from public.public_reports
    where latitude is null
      or longitude is null
  ),
  'every public map row has a generalized coordinate'
);

select ok(
  not exists (
    select 1
    from public.public_reports pr
    join public.reports r on r.id = pr.id
    where extensions.st_distance(
      r.location,
      extensions.st_setsrid(
        extensions.st_makepoint(pr.longitude, pr.latitude),
        4326
      )::extensions.geography
    ) < 50
  ),
  'public coordinates remain separated from exact locations'
);

select is(
  (
    select count(*)
    from public.public_reports
    where id = '10000000-0000-4000-8000-000000000001'::uuid
  ),
  0::bigint,
  'a private synthetic report identifier is indistinguishable from missing'
);

select * from finish();

rollback;
