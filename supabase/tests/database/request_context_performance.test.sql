begin;

set local search_path = public, extensions;

select plan(8);

select ok(
  to_regprocedure('public.current_request_context()') is not null,
  'the consolidated request-context RPC exists'
);

select ok(
  pg_catalog.has_function_privilege(
    'authenticated',
    'public.current_request_context()',
    'EXECUTE'
  ),
  'authenticated sessions can load their request context'
);

select ok(
  not pg_catalog.has_function_privilege(
    'anon',
    'public.current_request_context()',
    'EXECUTE'
  ),
  'anonymous sessions cannot invoke the request-context RPC'
);

select ok(
  (
    select p.prosecdef
    from pg_catalog.pg_proc p
    join pg_catalog.pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'current_request_context'
      and p.pronargs = 0
  ),
  'the request-context RPC uses its guarded definer privileges'
);

select is(
  (
    select p.provolatile
    from pg_catalog.pg_proc p
    join pg_catalog.pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'current_request_context'
      and p.pronargs = 0
  ),
  's'::"char",
  'the request-context RPC is stable within one request'
);

select ok(
  (
    select 'search_path=""' = any(p.proconfig)
    from pg_catalog.pg_proc p
    join pg_catalog.pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'current_request_context'
      and p.pronargs = 0
  ),
  'the security-definer RPC has an empty search path'
);

select ok(
  pg_catalog.strpos(
    pg_catalog.pg_get_functiondef(
      'public.current_request_context()'::regprocedure
    ),
    'auth.sessions'
  ) > 0,
  'the RPC verifies that the signed session still exists'
);

select ok(
  pg_catalog.strpos(
    pg_catalog.pg_get_functiondef(
      'public.current_request_context()'::regprocedure
    ),
    'session_id'
  ) > 0,
  'the RPC binds context to the exact signed session'
);

select * from finish();

rollback;
