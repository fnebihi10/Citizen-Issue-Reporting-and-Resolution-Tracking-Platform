-- Keep the relational attachment path constraint aligned with the strict
-- Storage path parser introduced by Sprint 3 security hardening.

begin;

alter table public.report_attachments
  drop constraint if exists report_attachments_path;

alter table public.report_attachments
  add constraint report_attachments_path check (
    object_path ~* '^reports/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/[^/]+$'
  );

commit;
