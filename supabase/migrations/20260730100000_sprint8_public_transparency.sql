-- Sprint 8: public transparency contract and supporting access path.
-- These views remain the only anonymous report-detail and analytics surface.

begin;

create index if not exists reports_public_transparency_idx
  on public.reports (category_id, status, updated_at desc)
  where is_public = true and public_location is not null;

create or replace view public.public_reports
with (security_barrier = true)
as
select
  r.id,
  r.report_number,
  coalesce(r.public_title, 'Raportim qytetar') as title,
  r.public_summary as summary,
  c.slug as category_slug,
  c.name as category_name,
  r.status,
  r.priority,
  extensions.st_x(r.public_location::extensions.geometry) as longitude,
  extensions.st_y(r.public_location::extensions.geometry) as latitude,
  r.created_at,
  r.updated_at,
  r.resolved_at
from public.reports r
join public.categories c on c.id = r.category_id
where r.is_public = true
  and r.public_location is not null;

create or replace view public.public_report_comments
with (security_barrier = true)
as
select
  rc.id,
  rc.report_id,
  rc.body,
  case
    when p.role = 'citizen' then 'Qytetar'
    else 'Zyrtar komunal'
  end as author_label,
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

comment on view public.public_reports is
  'Sanitized reports explicitly approved for public map, detail and analytics.';
comment on view public.public_report_comments is
  'Non-internal comments for reports approved for public transparency; authors are generic role labels.';
comment on view public.public_report_status_history is
  'Status-only public history without actor identifiers or operational notes.';

revoke all on table
  public.public_reports,
  public.public_report_comments,
  public.public_report_status_history
from public;

grant select on table
  public.public_reports,
  public.public_report_comments,
  public.public_report_status_history
to anon, authenticated;

commit;
