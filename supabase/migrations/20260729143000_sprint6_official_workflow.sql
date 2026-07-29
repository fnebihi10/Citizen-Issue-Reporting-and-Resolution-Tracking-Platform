-- Sprint 6 official workflow.
-- Adds atomic staff transitions, citizen reopening, immutable conversation
-- actions and database-generated notifications.

begin;

-- Direct migration/seed sessions have no JWT and remain available for
-- controlled environment provisioning. Authenticated API users still need an
-- administrator profile to change role, department, email or profile identity.
create or replace function public.protect_profile_privileged_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is not null
    and not public.is_admin()
    and (
      new.role is distinct from old.role
      or new.department_id is distinct from old.department_id
      or new.email is distinct from old.email
      or new.id is distinct from old.id
    )
  then
    raise exception 'Only an administrator can change privileged profile fields';
  end if;

  return new;
end;
$$;

revoke all on function public.protect_profile_privileged_fields()
  from public, anon, authenticated;

-- Report operational fields may only be changed through the audited workflow
-- RPCs below. SELECT remains protected by the existing owner/staff RLS policy.
drop policy if exists reports_staff_update on public.reports;
revoke update on table public.reports from authenticated;

-- Comments are append-only and are created through add_report_comment(), which
-- derives the author and validates report scope on the server.
revoke insert on table public.report_comments from authenticated;

create or replace function public.record_report_status_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  transition_note text := nullif(
    pg_catalog.btrim(
      pg_catalog.current_setting('app.report_status_note', true)
    ),
    ''
  );
begin
  if tg_op = 'INSERT' then
    insert into public.report_status_history (
      report_id,
      previous_status,
      new_status,
      changed_by,
      note
    )
    values (new.id, null, new.status, auth.uid(), transition_note);
  elsif new.status is distinct from old.status then
    insert into public.report_status_history (
      report_id,
      previous_status,
      new_status,
      changed_by,
      note
    )
    values (new.id, old.status, new.status, auth.uid(), transition_note);
  end if;

  return new;
end;
$$;

revoke all on function public.record_report_status_change()
  from public, anon, authenticated;

create or replace function public.transition_report_workflow(
  p_report_id uuid,
  p_target_status public.report_status,
  p_note text default null,
  p_department_id uuid default null,
  p_assigned_official_id uuid default null,
  p_priority public.report_priority default null,
  p_is_public boolean default null,
  p_public_title text default null,
  p_public_summary text default null
)
returns public.report_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  actor_role public.user_role;
  actor_department_id uuid;
  target_report public.reports%rowtype;
  target_department_id uuid;
  target_official_id uuid;
  target_official_role public.user_role;
  target_official_department_id uuid;
  category_department_id uuid;
  clean_note text := nullif(pg_catalog.btrim(p_note), '');
  clean_public_title text := nullif(pg_catalog.btrim(p_public_title), '');
  clean_public_summary text := nullif(pg_catalog.btrim(p_public_summary), '');
begin
  if actor_id is null then
    raise exception using errcode = '42501', message = 'AUTHENTICATION_REQUIRED';
  end if;

  select p.role, p.department_id
  into actor_role, actor_department_id
  from public.profiles p
  where p.id = actor_id;

  if actor_role not in ('official', 'admin') then
    raise exception using errcode = '42501', message = 'STAFF_ROLE_REQUIRED';
  end if;

  select r.*
  into target_report
  from public.reports r
  where r.id = p_report_id
  for update;

  if not found then
    raise exception using errcode = 'P0002', message = 'REPORT_NOT_FOUND';
  end if;

  if actor_role <> 'admin'
    and not public.can_view_staff_report(
      target_report.department_id,
      target_report.status
    )
  then
    raise exception using errcode = '42501', message = 'REPORT_OUTSIDE_STAFF_SCOPE';
  end if;

  if clean_note is not null and char_length(clean_note) > 2000 then
    raise exception 'WORKFLOW_NOTE_TOO_LONG';
  end if;

  perform pg_catalog.set_config(
    'app.report_status_note',
    coalesce(clean_note, ''),
    true
  );

  case p_target_status
    when 'under_review' then
      if target_report.status not in ('submitted', 'reopened') then
        raise exception 'INVALID_WORKFLOW_ACTION';
      end if;

      update public.reports
      set
        status = 'under_review',
        rejected_reason = null
      where id = target_report.id;

    when 'assigned' then
      if target_report.status <> 'under_review' then
        raise exception 'INVALID_WORKFLOW_ACTION';
      end if;

      target_department_id := p_department_id;
      target_official_id := coalesce(
        p_assigned_official_id,
        case when actor_role = 'official' then actor_id else null end
      );

      if target_department_id is null or target_official_id is null then
        raise exception 'ASSIGNMENT_REQUIRES_DEPARTMENT_AND_OFFICIAL';
      end if;

      if actor_role = 'official'
        and target_department_id is distinct from actor_department_id
      then
        raise exception using errcode = '42501', message = 'OFFICIAL_DEPARTMENT_SCOPE_VIOLATION';
      end if;

      select p.role, p.department_id
      into target_official_role, target_official_department_id
      from public.profiles p
      where p.id = target_official_id;

      if target_official_role is null
        or target_official_role not in ('official', 'admin')
      then
        raise exception 'ASSIGNEE_MUST_BE_STAFF';
      end if;

      if target_official_role = 'official'
        and target_official_department_id is distinct from target_department_id
      then
        raise exception 'ASSIGNEE_DEPARTMENT_MISMATCH';
      end if;

      if p_priority is null then
        p_priority := target_report.priority;
      end if;

      if coalesce(p_is_public, false) then
        if clean_public_title is null
          or char_length(clean_public_title) not between 5 and 160
          or clean_public_summary is null
          or char_length(clean_public_summary) not between 10 and 1000
        then
          raise exception 'PUBLIC_REPORT_REQUIRES_SANITIZED_TITLE_AND_SUMMARY';
        end if;
      end if;

      update public.reports
      set
        status = 'assigned',
        department_id = target_department_id,
        assigned_official_id = target_official_id,
        priority = p_priority,
        is_public = coalesce(p_is_public, false),
        public_title = case
          when coalesce(p_is_public, false) then clean_public_title
          else null
        end,
        public_summary = case
          when coalesce(p_is_public, false) then clean_public_summary
          else null
        end
      where id = target_report.id;

    when 'in_progress' then
      if target_report.status <> 'assigned' then
        raise exception 'INVALID_WORKFLOW_ACTION';
      end if;

      update public.reports
      set status = 'in_progress'
      where id = target_report.id;

    when 'resolved' then
      if target_report.status <> 'in_progress' then
        raise exception 'INVALID_WORKFLOW_ACTION';
      end if;

      if clean_note is null or char_length(clean_note) < 10 then
        raise exception 'RESOLUTION_NOTE_TOO_SHORT';
      end if;

      update public.reports
      set
        status = 'resolved',
        resolution_notes = clean_note,
        rejected_reason = null
      where id = target_report.id;

    when 'rejected' then
      if target_report.status <> 'under_review' then
        raise exception 'INVALID_WORKFLOW_ACTION';
      end if;

      if clean_note is null or char_length(clean_note) < 10 then
        raise exception 'REJECTION_REASON_TOO_SHORT';
      end if;

      select c.department_id
      into category_department_id
      from public.categories c
      where c.id = target_report.category_id;

      target_department_id := coalesce(
        target_report.department_id,
        p_department_id,
        actor_department_id,
        category_department_id
      );

      if target_department_id is null then
        raise exception 'REJECTION_REQUIRES_RESPONSIBLE_DEPARTMENT';
      end if;

      if actor_role = 'official'
        and target_department_id is distinct from actor_department_id
      then
        raise exception using errcode = '42501', message = 'OFFICIAL_DEPARTMENT_SCOPE_VIOLATION';
      end if;

      update public.reports
      set
        status = 'rejected',
        department_id = target_department_id,
        rejected_reason = clean_note,
        resolution_notes = null
      where id = target_report.id;

    else
      raise exception 'UNSUPPORTED_STAFF_WORKFLOW_TARGET';
  end case;

  perform pg_catalog.set_config('app.report_status_note', '', true);
  return p_target_status;
end;
$$;

revoke all on function public.transition_report_workflow(
  uuid,
  public.report_status,
  text,
  uuid,
  uuid,
  public.report_priority,
  boolean,
  text,
  text
) from public, anon;
grant execute on function public.transition_report_workflow(
  uuid,
  public.report_status,
  text,
  uuid,
  uuid,
  public.report_priority,
  boolean,
  text,
  text
) to authenticated;

create or replace function public.add_report_comment(
  p_report_id uuid,
  p_body text,
  p_is_internal boolean default false
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  actor_role public.user_role;
  target_report public.reports%rowtype;
  clean_body text := nullif(pg_catalog.btrim(p_body), '');
  new_comment_id uuid;
begin
  if actor_id is null then
    raise exception using errcode = '42501', message = 'AUTHENTICATION_REQUIRED';
  end if;

  if clean_body is null or char_length(clean_body) > 2000 then
    raise exception 'COMMENT_LENGTH_INVALID';
  end if;

  select p.role
  into actor_role
  from public.profiles p
  where p.id = actor_id;

  select r.*
  into target_report
  from public.reports r
  where r.id = p_report_id;

  if not found then
    raise exception using errcode = 'P0002', message = 'REPORT_NOT_FOUND';
  end if;

  if actor_role = 'citizen' then
    if target_report.citizen_id is distinct from actor_id or p_is_internal then
      raise exception using errcode = '42501', message = 'COMMENT_SCOPE_DENIED';
    end if;
  elsif actor_role in ('official', 'admin') then
    if actor_role <> 'admin'
      and not public.can_view_staff_report(
        target_report.department_id,
        target_report.status
      )
    then
      raise exception using errcode = '42501', message = 'COMMENT_SCOPE_DENIED';
    end if;
  else
    raise exception using errcode = '42501', message = 'COMMENT_SCOPE_DENIED';
  end if;

  insert into public.report_comments (
    report_id,
    author_id,
    body,
    is_internal
  )
  values (
    target_report.id,
    actor_id,
    clean_body,
    coalesce(p_is_internal, false)
  )
  returning id into new_comment_id;

  return new_comment_id;
end;
$$;

revoke all on function public.add_report_comment(uuid, text, boolean)
  from public, anon;
grant execute on function public.add_report_comment(uuid, text, boolean)
  to authenticated;

create or replace function public.reopen_resolved_report(
  p_report_id uuid,
  p_reason text
)
returns public.report_status
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  target_report public.reports%rowtype;
  clean_reason text := nullif(pg_catalog.btrim(p_reason), '');
begin
  if actor_id is null then
    raise exception using errcode = '42501', message = 'AUTHENTICATION_REQUIRED';
  end if;

  if public.current_user_role() <> 'citizen' then
    raise exception using errcode = '42501', message = 'CITIZEN_ROLE_REQUIRED';
  end if;

  if clean_reason is null
    or char_length(clean_reason) < 10
    or char_length(clean_reason) > 1000
  then
    raise exception 'REOPEN_REASON_LENGTH_INVALID';
  end if;

  select r.*
  into target_report
  from public.reports r
  where r.id = p_report_id
  for update;

  if not found
    or target_report.citizen_id is distinct from actor_id
  then
    raise exception using errcode = 'P0002', message = 'REPORT_NOT_FOUND';
  end if;

  if target_report.status <> 'resolved' then
    raise exception 'ONLY_RESOLVED_REPORTS_CAN_BE_REOPENED';
  end if;

  perform pg_catalog.set_config('app.report_status_note', clean_reason, true);

  update public.reports
  set status = 'reopened'
  where id = target_report.id;

  perform pg_catalog.set_config('app.report_status_note', '', true);

  insert into public.report_comments (
    report_id,
    author_id,
    body,
    is_internal
  )
  values (target_report.id, actor_id, clean_reason, false);

  return 'reopened'::public.report_status;
end;
$$;

revoke all on function public.reopen_resolved_report(uuid, text)
  from public, anon;
grant execute on function public.reopen_resolved_report(uuid, text)
  to authenticated;

create or replace function public.notify_report_status_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  status_label text;
begin
  if actor_id is null
    or new.status is not distinct from old.status
    or actor_id is not distinct from new.citizen_id
  then
    return new;
  end if;

  status_label := case new.status
    when 'submitted' then 'Dorezuar'
    when 'under_review' then 'Ne verifikim'
    when 'assigned' then 'Caktuar'
    when 'in_progress' then 'Ne proces'
    when 'resolved' then 'Zgjidhur'
    when 'rejected' then 'Refuzuar'
    when 'reopened' then 'Rihapur'
  end;

  insert into public.notifications (
    recipient_id,
    report_id,
    type,
    title,
    message
  )
  values (
    new.citizen_id,
    new.id,
    'report_status_changed',
    'Statusi i raportimit ndryshoi',
    pg_catalog.format(
      'Raportimi #%s tani eshte: %s.',
      new.report_number,
      status_label
    )
  );

  return new;
end;
$$;

drop trigger if exists reports_notify_status_change on public.reports;
create trigger reports_notify_status_change
  after update of status on public.reports
  for each row execute function public.notify_report_status_change();

revoke all on function public.notify_report_status_change()
  from public, anon, authenticated;

create or replace function public.notify_report_comment()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_report public.reports%rowtype;
  author_role public.user_role;
  recipient_id uuid;
begin
  if new.is_internal then
    return new;
  end if;

  select r.*
  into target_report
  from public.reports r
  where r.id = new.report_id;

  select p.role
  into author_role
  from public.profiles p
  where p.id = new.author_id;

  if author_role = 'citizen' then
    recipient_id := target_report.assigned_official_id;
  else
    recipient_id := target_report.citizen_id;
  end if;

  if recipient_id is null or recipient_id is not distinct from new.author_id then
    return new;
  end if;

  insert into public.notifications (
    recipient_id,
    report_id,
    type,
    title,
    message
  )
  values (
    recipient_id,
    new.report_id,
    'report_comment_added',
    'Koment i ri ne raportim',
    pg_catalog.format(
      'Raportimi #%s ka nje koment te ri.',
      target_report.report_number
    )
  );

  return new;
end;
$$;

drop trigger if exists comments_notify_participant on public.report_comments;
create trigger comments_notify_participant
  after insert on public.report_comments
  for each row execute function public.notify_report_comment();

revoke all on function public.notify_report_comment()
  from public, anon, authenticated;

-- Notification rows can only be created by trusted triggers. The existing
-- immutable-content trigger still lets recipients change read_at only.
revoke insert on table public.notifications from authenticated;

commit;
