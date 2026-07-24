-- Pre-Sprint 6 critical hardening.
-- Enforces public-location privacy, citizen report throttling, admin profile
-- management, immutable comments and privacy-safe duplicate suggestions.

begin;

create or replace function public.generalize_location(
  exact extensions.geography,
  precision_m numeric default 500
)
returns extensions.geography
language plpgsql
immutable
strict
set search_path = ''
as $$
declare
  exact_projected extensions.geometry;
  generalized_projected extensions.geometry;
  generalized_geography extensions.geography;
begin
  if precision_m < 100 or precision_m > 5000 then
    raise exception 'LOCATION_GENERALIZATION_PRECISION_OUT_OF_RANGE';
  end if;

  if extensions.st_isempty(exact::extensions.geometry)
    or extensions.st_geometrytype(exact::extensions.geometry) <> 'ST_Point'
  then
    raise exception 'LOCATION_GENERALIZATION_REQUIRES_POINT';
  end if;

  exact_projected := extensions.st_transform(
    exact::extensions.geometry,
    3857
  );
  generalized_projected := extensions.st_snaptogrid(
    exact_projected,
    precision_m::double precision,
    precision_m::double precision
  );
  generalized_geography := extensions.st_transform(
    generalized_projected,
    4326
  )::extensions.geography;

  -- A point can land exactly on a grid intersection. Keep the precision
  -- reduction deterministic while guaranteeing a minimum visible offset.
  if extensions.st_distance(exact, generalized_geography) < 50 then
    generalized_projected := extensions.st_translate(
      generalized_projected,
      (precision_m / 2)::double precision,
      (precision_m / 2)::double precision
    );
    generalized_geography := extensions.st_transform(
      generalized_projected,
      4326
    )::extensions.geography;
  end if;

  return generalized_geography;
end;
$$;

revoke execute on function public.generalize_location(extensions.geography, numeric)
  from public, anon, authenticated;

create or replace function public.prepare_report()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  category_sla smallint;
  recent_report_count integer;
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

    -- Seed and migration sessions have no authenticated JWT. Interactive
    -- citizen inserts are serialized per account to prevent race bypasses.
    if auth.uid() is not null then
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

  -- public_location is never trusted from a client. It is derived from the
  -- exact private point on every insert/update and cleared when unpublished.
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

-- Recalculate every already-published point through the same trusted function.
update public.reports
set public_location = public.generalize_location(location, 500)
where is_public = true;

update public.reports
set public_location = null
where is_public = false
  and public_location is not null;

alter table public.reports
  drop constraint if exists reports_public_location_generalized;
alter table public.reports
  add constraint reports_public_location_generalized check (
    is_public = false
    or (
      public_location is not null
      and extensions.st_distance(location, public_location) >= 50
    )
  );

drop policy if exists profiles_admin_update on public.profiles;
create policy profiles_admin_update on public.profiles
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

alter table public.profiles
  drop constraint if exists profiles_official_department_required;
alter table public.profiles
  add constraint profiles_official_department_required check (
    role <> 'official'
    or department_id is not null
  ) not valid;
alter table public.profiles
  validate constraint profiles_official_department_required;

-- Comments are immutable audit-trail entries. Corrections are new comments.
drop trigger if exists comments_set_updated_at on public.report_comments;
alter table public.report_comments
  drop column if exists updated_at;
revoke update on table public.report_comments from authenticated;

create or replace function public.suggest_similar_reports(
  p_category_id uuid,
  p_latitude double precision,
  p_longitude double precision,
  p_radius_m integer default 500
)
returns table (
  id uuid,
  report_number bigint,
  title text,
  status public.report_status,
  distance_m integer
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  viewer_id uuid := auth.uid();
  requested_point extensions.geography;
  bounded_radius integer;
begin
  if viewer_id is null
    or p_category_id is null
    or p_latitude is null
    or p_longitude is null
    or p_latitude < -90
    or p_latitude > 90
    or p_longitude < -180
    or p_longitude > 180
  then
    return;
  end if;

  bounded_radius := least(
    greatest(coalesce(p_radius_m, 500), 50),
    1000
  );
  requested_point := extensions.st_setsrid(
    extensions.st_makepoint(p_longitude, p_latitude),
    4326
  )::extensions.geography;

  return query
  with candidates as (
    select
      r.id,
      r.report_number,
      case
        when r.citizen_id = viewer_id then r.title
        else pg_catalog.coalesce(r.public_title, 'Raportim qytetar')
      end as safe_title,
      r.status,
      extensions.st_distance(
        case
          when r.citizen_id = viewer_id then r.location
          else r.public_location
        end,
        requested_point
      ) as exact_distance_m
    from public.reports r
    where r.category_id = p_category_id
      and r.status not in ('resolved', 'rejected')
      and r.created_at > pg_catalog.now() - interval '90 days'
      and (
        r.citizen_id = viewer_id
        or (r.is_public = true and r.public_location is not null)
      )
      and extensions.st_dwithin(
        case
          when r.citizen_id = viewer_id then r.location
          else r.public_location
        end,
        requested_point,
        bounded_radius
      )
  )
  select
    candidates.id,
    candidates.report_number,
    candidates.safe_title,
    candidates.status,
    (
      pg_catalog.round(candidates.exact_distance_m / 50.0) * 50
    )::integer as distance_m
  from candidates
  order by candidates.exact_distance_m
  limit 5;
end;
$$;

revoke execute on function public.suggest_similar_reports(
  uuid,
  double precision,
  double precision,
  integer
) from public, anon;
grant execute on function public.suggest_similar_reports(
  uuid,
  double precision,
  double precision,
  integer
) to authenticated;

commit;
