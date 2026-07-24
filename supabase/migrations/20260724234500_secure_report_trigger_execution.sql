-- Execute the report preparation trigger with its owner privileges.
-- The trigger must be able to call the intentionally non-public
-- generalize_location() helper when authorized staff publish a report.

begin;

alter function public.prepare_report() security definer;
alter function public.prepare_report() set search_path = '';

revoke all on function public.prepare_report()
  from public, anon, authenticated;

commit;
