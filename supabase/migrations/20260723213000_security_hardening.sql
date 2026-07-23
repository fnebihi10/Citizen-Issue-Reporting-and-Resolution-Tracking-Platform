-- Sprint 3 security hardening.
-- This migration tightens privacy boundaries without deleting any data.

begin;

-- Public views must only expose data belonging to reports deliberately made public.
create or replace view public.public_report_comments
with (security_barrier = true)
as
select
  rc.id,
  rc.report_id,
  rc.body,
  case when p.role = 'citizen' then 'Qytetar' else 'Zyrtar komunal' end as author_label,
  rc.created_at
from public.report_comments rc
join public.reports r on r.id = rc.report_id
join public.profiles p on p.id = rc.author_id
where r.is_public = true
  and r.public_location is not null
  and rc.is_internal = false;

create or replace view public.public_report_status_history
with (security_barrier = true)
as
select
  h.id,
  h.report_id,
  h.previous_status,
  h.new_status,
  h.created_at
from public.report_status_history h
join public.reports r on r.id = h.report_id
where r.is_public = true
  and r.public_location is not null;

-- Officials do not receive a directory of every citizen. Precise staff access
-- is enforced through report-level policies instead.
drop policy if exists profiles_self_or_staff_read on public.profiles;
create policy profiles_self_or_admin_read on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

-- An attachment can be internal to staff. Citizen evidence remains visible to
-- its owner, while internal operational evidence never leaks back to a citizen.
alter table public.report_attachments
  add column if not exists is_internal boolean not null default false;

drop policy if exists comments_owner_or_staff_read on public.report_comments;
create policy comments_participant_or_authorized_staff_read on public.report_comments
  for select to authenticated
  using (
    exists (
      select 1
      from public.reports r
      where r.id = report_comments.report_id
        and (
          (r.citizen_id = auth.uid() and report_comments.is_internal = false)
          or public.can_view_staff_report(r.department_id, r.status)
        )
    )
  );

drop policy if exists comments_authenticated_insert on public.report_comments;
create policy comments_participant_or_authorized_staff_insert on public.report_comments
  for insert to authenticated
  with check (
    author_id = auth.uid()
    and exists (
      select 1
      from public.reports r
      where r.id = report_comments.report_id
        and (
          (r.citizen_id = auth.uid() and report_comments.is_internal = false)
          or public.can_view_staff_report(r.department_id, r.status)
        )
    )
  );

drop policy if exists attachments_owner_or_staff_read on public.report_attachments;
create policy attachments_participant_or_authorized_staff_read on public.report_attachments
  for select to authenticated
  using (
    exists (
      select 1
      from public.reports r
      where r.id = report_attachments.report_id
        and (
          (r.citizen_id = auth.uid() and report_attachments.is_internal = false)
          or public.can_view_staff_report(r.department_id, r.status)
        )
    )
  );

drop policy if exists attachments_owner_or_staff_insert on public.report_attachments;
create policy attachments_participant_or_authorized_staff_insert on public.report_attachments
  for insert to authenticated
  with check (
    uploaded_by = auth.uid()
    and exists (
      select 1
      from public.reports r
      where r.id = report_attachments.report_id
        and (
          (r.citizen_id = auth.uid() and report_attachments.is_internal = false)
          or public.can_view_staff_report(r.department_id, r.status)
        )
    )
  );

-- Storage paths are immutable and must use a strict UUID report identifier.
create or replace function public.report_id_from_storage_path(object_name text)
returns uuid
language sql
immutable
as $$
  select case
    when object_name ~* '^reports/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[^/]+$'
      then split_part(object_name, '/', 2)::uuid
    else null
  end;
$$;

drop policy if exists report_evidence_insert on storage.objects;
create policy report_evidence_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'report-evidence'
    and owner_id = auth.uid()::text
    and exists (
      select 1
      from public.reports r
      where r.id = public.report_id_from_storage_path(name)
        and (
          r.citizen_id = auth.uid()
          or public.can_view_staff_report(r.department_id, r.status)
        )
    )
  );

drop policy if exists report_evidence_select on storage.objects;
create policy report_evidence_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'report-evidence'
    and exists (
      select 1
      from public.report_attachments a
      join public.reports r on r.id = a.report_id
      where a.bucket_id = bucket_id
        and a.object_path = name
        and (
          (r.citizen_id = auth.uid() and a.is_internal = false)
          or public.can_view_staff_report(r.department_id, r.status)
        )
    )
  );

-- Evidence objects are immutable. Replacements are uploaded as a new object so
-- the audit trail and file metadata remain trustworthy.
drop policy if exists report_evidence_update on storage.objects;

drop policy if exists report_evidence_delete on storage.objects;
create policy report_evidence_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'report-evidence'
    and (
      public.is_admin()
      or (
        owner_id = auth.uid()::text
        and exists (
          select 1
          from public.reports r
          where r.id = public.report_id_from_storage_path(name)
            and (
              r.citizen_id = auth.uid()
              or public.can_view_staff_report(r.department_id, r.status)
            )
        )
      )
    )
  );

-- Trigger-only functions are not part of the public Data API surface.
revoke all on function public.handle_new_user() from public;
revoke all on function public.set_updated_at() from public;
revoke all on function public.protect_profile_privileged_fields() from public;
revoke all on function public.prepare_report() from public;
revoke all on function public.validate_report_status_transition() from public;
revoke all on function public.record_report_status_change() from public;
revoke all on function public.audit_report_change() from public;
revoke all on function public.report_id_from_storage_path(text) from public;
grant execute on function public.report_id_from_storage_path(text) to authenticated;

commit;
