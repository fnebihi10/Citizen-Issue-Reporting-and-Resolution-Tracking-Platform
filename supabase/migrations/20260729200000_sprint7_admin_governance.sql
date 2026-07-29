-- Sprint 7 administration, SLA monitoring and privacy-safe export auditing.

begin;

create index if not exists profiles_admin_directory_idx
  on public.profiles (role, department_id, full_name);

create index if not exists categories_department_active_idx
  on public.categories (department_id, is_active, name);

create index if not exists audit_logs_actor_created_idx
  on public.audit_logs (actor_id, created_at desc);

grant insert, update on table public.departments, public.categories
  to authenticated;

create or replace function public.validate_admin_reference_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_table_name = 'departments' then
    if old.is_active
      and not new.is_active
      and exists (
        select 1
        from public.profiles p
        where p.role = 'official'
          and p.department_id = new.id
      )
    then
      raise exception using errcode = '23514',
        message = 'DEPARTMENT_HAS_ACTIVE_OFFICIALS';
    end if;
    if old.is_active
      and not new.is_active
      and exists (
        select 1
        from public.categories c
        where c.department_id = new.id
          and c.is_active = true
      )
    then
      raise exception using errcode = '23514',
        message = 'DEPARTMENT_HAS_ACTIVE_CATEGORIES';
    end if;
  elsif tg_table_name = 'categories' then
    if new.is_active
      and not exists (
      select 1
      from public.departments d
      where d.id = new.department_id
        and d.is_active = true
    )
    then
      raise exception using errcode = '23514',
        message = 'CATEGORY_REQUIRES_ACTIVE_DEPARTMENT';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists departments_validate_admin_change on public.departments;
create trigger departments_validate_admin_change
  before update on public.departments
  for each row execute function public.validate_admin_reference_change();

drop trigger if exists categories_validate_admin_change on public.categories;
create trigger categories_validate_admin_change
  before insert or update on public.categories
  for each row execute function public.validate_admin_reference_change();

revoke all on function public.validate_admin_reference_change()
  from public, anon, authenticated;

create or replace function public.protect_profile_privileged_fields()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is not null
    and (
      new.email is distinct from old.email
      or new.id is distinct from old.id
    )
  then
    raise exception using errcode = '42501',
      message = 'PROFILE_IDENTITY_MANAGED_BY_AUTH';
  end if;

  if auth.uid() is not null
    and not public.is_admin()
    and (
      new.role is distinct from old.role
      or new.department_id is distinct from old.department_id
    )
  then
    raise exception using errcode = '42501',
      message = 'ADMIN_ROLE_REQUIRED';
  end if;

  if auth.uid() is not null
    and old.id = auth.uid()
    and old.role = 'admin'
    and new.role <> 'admin'
  then
    raise exception using errcode = '42501',
      message = 'ADMIN_CANNOT_DEMOTE_SELF';
  end if;

  if new.role = 'official'
    and not exists (
      select 1
      from public.departments d
      where d.id = new.department_id
        and d.is_active = true
    )
  then
    raise exception using errcode = '23514',
      message = 'OFFICIAL_REQUIRES_ACTIVE_DEPARTMENT';
  end if;

  if new.role <> 'official' then
    new.department_id := null;
  end if;

  return new;
end;
$$;

revoke all on function public.protect_profile_privileged_fields()
  from public, anon, authenticated;

create or replace function public.audit_admin_configuration_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  actor_id uuid := auth.uid();
  record_id uuid;
  action_name text;
  entity_name text := tg_table_name;
  audit_details jsonb;
begin
  -- Direct migration/seed work has no authenticated actor and is not part of
  -- the application audit trail.
  if actor_id is null then
    return new;
  end if;

  record_id := new.id;
  action_name := entity_name || case
    when tg_op = 'INSERT' then '.created'
    else '.updated'
  end;

  if tg_table_name = 'profiles' then
    if new.role is not distinct from old.role
      and new.department_id is not distinct from old.department_id
    then
      return new;
    end if;

    audit_details := pg_catalog.jsonb_build_object(
      'previous_role', old.role,
      'new_role', new.role,
      'previous_department_id', old.department_id,
      'new_department_id', new.department_id
    );
  elsif tg_table_name = 'departments' then
    audit_details := pg_catalog.jsonb_build_object(
      'name', new.name,
      'code', new.code,
      'is_active', new.is_active,
      'operation', tg_op
    );
  elsif tg_table_name = 'categories' then
    audit_details := pg_catalog.jsonb_build_object(
      'name', new.name,
      'slug', new.slug,
      'department_id', new.department_id,
      'default_sla_hours', new.default_sla_hours,
      'is_active', new.is_active,
      'operation', tg_op
    );
  else
    raise exception 'UNSUPPORTED_ADMIN_AUDIT_ENTITY';
  end if;

  insert into public.audit_logs (
    actor_id,
    action,
    entity_type,
    entity_id,
    details
  )
  values (
    actor_id,
    action_name,
    entity_name,
    record_id,
    audit_details
  );

  return new;
end;
$$;

drop trigger if exists profiles_audit_admin_change on public.profiles;
create trigger profiles_audit_admin_change
  after update of role, department_id on public.profiles
  for each row execute function public.audit_admin_configuration_change();

drop trigger if exists departments_audit_admin_change on public.departments;
create trigger departments_audit_admin_change
  after insert or update on public.departments
  for each row execute function public.audit_admin_configuration_change();

drop trigger if exists categories_audit_admin_change on public.categories;
create trigger categories_audit_admin_change
  after insert or update on public.categories
  for each row execute function public.audit_admin_configuration_change();

revoke all on function public.audit_admin_configuration_change()
  from public, anon, authenticated;

create or replace function public.record_admin_export(
  p_format text,
  p_filters jsonb default '{}'::jsonb,
  p_row_count integer default 0
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  audit_id uuid;
  normalized_format text := pg_catalog.lower(pg_catalog.btrim(p_format));
begin
  if auth.uid() is null or not public.is_admin() then
    raise exception using errcode = '42501', message = 'ADMIN_ROLE_REQUIRED';
  end if;

  if normalized_format is null
    or normalized_format not in ('csv', 'json')
    or p_row_count is null
    or p_row_count < 0
    or p_row_count > 100000
    or pg_catalog.pg_column_size(coalesce(p_filters, '{}'::jsonb)) > 4096
  then
    raise exception 'INVALID_EXPORT_AUDIT_DATA';
  end if;

  insert into public.audit_logs (
    actor_id,
    action,
    entity_type,
    details
  )
  values (
    auth.uid(),
    'reports.exported',
    'report_export',
    pg_catalog.jsonb_build_object(
      'format', normalized_format,
      'filters', coalesce(p_filters, '{}'::jsonb),
      'row_count', p_row_count
    )
  )
  returning id into audit_id;

  return audit_id;
end;
$$;

revoke all on function public.record_admin_export(text, jsonb, integer)
  from public, anon;
grant execute on function public.record_admin_export(text, jsonb, integer)
  to authenticated;

commit;
