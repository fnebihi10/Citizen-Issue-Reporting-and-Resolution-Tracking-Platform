-- A report submitted through the citizen workflow must belong to an account
-- whose authoritative profile role is citizen. Route guards alone are not an
-- authorization boundary for direct Data API requests.

begin;

drop policy if exists reports_citizen_insert on public.reports;
create policy reports_citizen_insert on public.reports
  for insert to authenticated
  with check (
    public.current_user_role() = 'citizen'
    and citizen_id = auth.uid()
    and status = 'submitted'
    and priority = 'normal'
    and department_id is null
    and assigned_official_id is null
    and is_public = false
    and public_location is null
  );

commit;
