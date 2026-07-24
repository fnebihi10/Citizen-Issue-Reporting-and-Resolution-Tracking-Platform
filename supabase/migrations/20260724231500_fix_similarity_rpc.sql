-- COALESCE is SQL syntax, not a schema-qualified pg_catalog function.
-- The previous RPC compiled at migration time but failed when executed.

begin;

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
        else coalesce(r.public_title, 'Raportim qytetar')
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
