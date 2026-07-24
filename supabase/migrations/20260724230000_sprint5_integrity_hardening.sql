-- Sprint 5 release-candidate integrity hardening.
-- Closes direct-API bypasses that are not reachable through the current UI
-- but must still be rejected by the database and Storage authorization layer.

begin;

-- SECURITY DEFINER functions must not resolve attacker-controlled objects.
revoke create on schema public from public, anon, authenticated;

alter function public.current_user_role() set search_path = '';
alter function public.is_admin() set search_path = '';
alter function public.is_official_or_admin() set search_path = '';
alter function public.can_view_staff_report(uuid, public.report_status)
  set search_path = '';
alter function public.handle_new_user() set search_path = '';
alter function public.set_updated_at() set search_path = '';
alter function public.protect_profile_privileged_fields() set search_path = '';
alter function public.validate_report_status_transition() set search_path = '';
alter function public.record_report_status_change() set search_path = '';
alter function public.audit_report_change() set search_path = '';
alter function public.report_id_from_storage_path(text) set search_path = '';

-- Report numbers are server-owned. A Data API client cannot provide its own
-- identity value.
alter table public.reports
  alter column report_number set generated always;

alter table public.reports
  drop constraint if exists reports_address_text_length;
alter table public.reports
  add constraint reports_address_text_length check (
    address_text is null
    or char_length(pg_catalog.btrim(address_text)) <= 240
  );

-- The relational attachment and its Storage path must refer to the same
-- report. Shape validation alone is not sufficient for this invariant.
alter table public.report_attachments
  drop constraint if exists report_attachments_report_path_matches;
alter table public.report_attachments
  add constraint report_attachments_report_path_matches check (
    public.report_id_from_storage_path(object_path) is not null
    and report_id = public.report_id_from_storage_path(object_path)
  );

create or replace function public.prepare_report()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  category_sla smallint;
  recent_report_count integer;
  authenticated_user_id uuid := auth.uid();
begin
  select c.default_sla_hours
  into category_sla
  from public.categories c
  where c.id = new.category_id
    and c.is_active = true;

  if category_sla is null then
    raise exception 'Category is missing or inactive';
  end if;

  if tg_op = 'INSERT' then
    if new.status <> 'submitted'
      or new.priority <> 'normal'
      or new.is_public
    then
      raise exception 'A new citizen report must start as submitted, normal and private';
    end if;

    if authenticated_user_id is not null then
      if new.citizen_id is distinct from authenticated_user_id then
        raise exception 'REPORT_OWNER_MUST_MATCH_AUTHENTICATED_USER';
      end if;

      if new.department_id is not null
        or new.assigned_official_id is not null
        or new.public_title is not null
        or new.public_summary is not null
        or new.public_location is not null
        or new.resolution_notes is not null
        or new.rejected_reason is not null
        or new.resolved_at is not null
      then
        raise exception 'REPORT_PRIVILEGED_FIELDS_NOT_ALLOWED_ON_INSERT';
      end if;

      -- A client-provided timestamp must never bypass the rolling rate limit.
      new.created_at := pg_catalog.now();
      new.updated_at := new.created_at;

      perform pg_catalog.pg_advisory_xact_lock(
        pg_catalog.hashtextextended(new.citizen_id::text, 0)
      );

      select count(*)::integer
      into recent_report_count
      from public.reports r
      where r.citizen_id = new.citizen_id
        and r.created_at > pg_catalog.now() - interval '5 minutes';

      if recent_report_count >= 5 then
        raise exception using
          errcode = 'P0001',
          message = 'REPORT_RATE_LIMIT_EXCEEDED',
          detail = 'A citizen can create at most 5 reports in 5 minutes.';
      end if;
    end if;

    new.sla_due_at := pg_catalog.now()
      + pg_catalog.make_interval(hours => category_sla::integer);
  end if;

  if new.status = 'resolved'
    and nullif(pg_catalog.btrim(new.resolution_notes), '') is null
  then
    raise exception 'Resolution notes are required before resolving a report';
  end if;

  if new.status = 'rejected'
    and nullif(pg_catalog.btrim(new.rejected_reason), '') is null
  then
    raise exception 'A rejection reason is required';
  end if;

  -- public_location is server-owned on every write.
  if new.is_public then
    new.public_location := public.generalize_location(new.location, 500);

    if extensions.st_distance(new.location, new.public_location) < 50 then
      raise exception 'PUBLIC_LOCATION_NOT_GENERALIZED';
    end if;
  else
    new.public_location := null;
  end if;

  return new;
end;
$$;

revoke all on function public.prepare_report() from public, anon, authenticated;

create or replace function public.protect_report_identity_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id
    or new.report_number is distinct from old.report_number
    or new.citizen_id is distinct from old.citizen_id
    or new.created_at is distinct from old.created_at
  then
    raise exception 'REPORT_IDENTITY_FIELDS_IMMUTABLE';
  end if;

  return new;
end;
$$;

drop trigger if exists reports_protect_identity_fields on public.reports;
create trigger reports_protect_identity_fields
  before update on public.reports
  for each row execute function public.protect_report_identity_fields();

revoke all on function public.protect_report_identity_fields()
  from public, anon, authenticated;

-- The application does not expose report editing in Sprint 5. Removing this
-- broad policy prevents a citizen from changing priority, assignment, SLA or
-- publication fields through a handcrafted Data API request.
drop policy if exists reports_owner_edit_submitted on public.reports;

-- Client-created audit-trail records always receive a server timestamp.
create or replace function public.force_insert_created_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.created_at := pg_catalog.now();
  return new;
end;
$$;

drop trigger if exists comments_force_created_at on public.report_comments;
create trigger comments_force_created_at
  before insert on public.report_comments
  for each row execute function public.force_insert_created_at();

drop trigger if exists attachments_force_created_at on public.report_attachments;
create trigger attachments_force_created_at
  before insert on public.report_attachments
  for each row execute function public.force_insert_created_at();

revoke all on function public.force_insert_created_at()
  from public, anon, authenticated;

drop policy if exists attachments_participant_or_authorized_staff_insert
  on public.report_attachments;
create policy attachments_participant_or_authorized_staff_insert
  on public.report_attachments
  for insert to authenticated
  with check (
    uploaded_by = auth.uid()
    and exists (
      select 1
      from public.reports r
      where r.id = report_attachments.report_id
        and (
          (
            r.citizen_id = auth.uid()
            and report_attachments.is_internal = false
            and report_attachments.kind = 'evidence'
          )
          or public.can_view_staff_report(r.department_id, r.status)
        )
    )
  );

-- Evidence is immutable after its metadata row is registered. The uploader
-- can still remove an orphan object if attachment registration fails.
drop policy if exists report_evidence_delete on storage.objects;
create policy report_evidence_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'report-evidence'
    and (
      public.is_admin()
      or (
        owner_id = auth.uid()::text
        and not exists (
          select 1
          from public.report_attachments a
          where a.bucket_id = storage.objects.bucket_id
            and a.object_path = storage.objects.name
        )
        and exists (
          select 1
          from public.reports r
          where r.id = public.report_id_from_storage_path(storage.objects.name)
            and (
              r.citizen_id = auth.uid()
              or public.can_view_staff_report(r.department_id, r.status)
            )
        )
      )
    )
  );

-- Notification recipients may only toggle read_at; content and ownership are
-- immutable even before the Sprint 6 notification UI is introduced.
create or replace function public.protect_notification_fields()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.id is distinct from old.id
    or new.recipient_id is distinct from old.recipient_id
    or new.report_id is distinct from old.report_id
    or new.type is distinct from old.type
    or new.title is distinct from old.title
    or new.message is distinct from old.message
    or new.created_at is distinct from old.created_at
  then
    raise exception 'NOTIFICATION_CONTENT_IMMUTABLE';
  end if;

  return new;
end;
$$;

drop trigger if exists notifications_protect_fields on public.notifications;
create trigger notifications_protect_fields
  before update on public.notifications
  for each row execute function public.protect_notification_fields();

revoke all on function public.protect_notification_fields()
  from public, anon, authenticated;

commit;
