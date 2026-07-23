-- Private evidence bucket. Public access is deliberately disabled.

begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'report-evidence',
  'report-evidence',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update set
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.report_id_from_storage_path(object_name text)
returns uuid
language sql
immutable
as $$
  select case
    when object_name ~ '^reports/[0-9a-fA-F-]{36}/[^/]+$'
      then split_part(object_name, '/', 2)::uuid
    else null
  end;
$$;

create policy report_evidence_insert on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'report-evidence'
    and (
      public.is_official_or_admin()
      or exists (
        select 1 from public.reports r
        where r.id = public.report_id_from_storage_path(name)
          and r.citizen_id = auth.uid()
      )
    )
  );

create policy report_evidence_select on storage.objects
  for select to authenticated
  using (
    bucket_id = 'report-evidence'
    and (
      public.is_official_or_admin()
      or exists (
        select 1 from public.reports r
        where r.id = public.report_id_from_storage_path(name)
          and r.citizen_id = auth.uid()
      )
    )
  );

create policy report_evidence_update on storage.objects
  for update to authenticated
  using (bucket_id = 'report-evidence' and owner_id = auth.uid()::text)
  with check (bucket_id = 'report-evidence' and owner_id = auth.uid()::text);

create policy report_evidence_delete on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'report-evidence'
    and (owner_id = auth.uid()::text or public.is_admin())
  );

revoke execute on function public.report_id_from_storage_path(text) from public;
grant execute on function public.report_id_from_storage_path(text) to authenticated;

commit;
