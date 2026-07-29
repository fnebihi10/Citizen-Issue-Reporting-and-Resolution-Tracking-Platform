-- Fast, authoritative workspace request context.
-- One guarded RPC replaces repeated Auth/profile/notification round trips in
-- Proxy and Server Components while preserving server-side session revocation.

begin;

create or replace function public.current_request_context()
returns table (
  user_id uuid,
  role public.user_role,
  department_id uuid,
  full_name text,
  session_started_at timestamptz,
  unread_count bigint
)
language sql
stable
security definer
set search_path = ''
as $$
  select
    p.id,
    p.role,
    p.department_id,
    p.full_name,
    s.created_at,
    (
      select count(*)
      from public.notifications n
      where n.recipient_id = p.id
        and n.read_at is null
    )
  from public.profiles p
  join auth.sessions s
    on s.user_id = p.id
   and s.id = nullif(auth.jwt() ->> 'session_id', '')::uuid
  where p.id = auth.uid()
  limit 1;
$$;

revoke all on function public.current_request_context()
  from public, anon;
grant execute on function public.current_request_context()
  to authenticated;

commit;
