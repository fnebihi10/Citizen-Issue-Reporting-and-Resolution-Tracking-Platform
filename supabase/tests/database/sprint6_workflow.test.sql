begin;

set local search_path = public, extensions;

select plan(18);

select ok(
  pg_catalog.has_function_privilege(
    'authenticated',
    'public.transition_report_workflow(uuid,public.report_status,text,uuid,uuid,public.report_priority,boolean,text,text)',
    'EXECUTE'
  ),
  'authenticated users can invoke the staff workflow RPC'
);

select ok(
  not pg_catalog.has_function_privilege(
    'anon',
    'public.transition_report_workflow(uuid,public.report_status,text,uuid,uuid,public.report_priority,boolean,text,text)',
    'EXECUTE'
  ),
  'anonymous users cannot invoke the staff workflow RPC'
);

select ok(
  pg_catalog.has_function_privilege(
    'authenticated',
    'public.reopen_resolved_report(uuid,text)',
    'EXECUTE'
  ),
  'authenticated citizens can invoke the controlled reopening RPC'
);

select ok(
  pg_catalog.has_function_privilege(
    'authenticated',
    'public.add_report_comment(uuid,text,boolean)',
    'EXECUTE'
  ),
  'authenticated participants can invoke the comment RPC'
);

select ok(
  not pg_catalog.has_table_privilege(
    'authenticated',
    'public.reports',
    'UPDATE'
  ),
  'Data API users cannot update report operational fields directly'
);

insert into public.reports (
  id,
  title,
  description,
  category_id,
  citizen_id,
  location
)
values (
  '90000000-0000-4000-8000-000000000060',
  'Raport sintetik për workflow-in e Sprintit 6',
  'Raport sintetik që përdoret vetëm brenda transaksionit të testit pgTAP.',
  'a1111111-1111-1111-1111-111111111111',
  '00000000-0000-4000-8000-000000000001',
  extensions.st_setsrid(
    extensions.st_makepoint(21.1655, 42.6629),
    4326
  )::extensions.geography
);

set local role authenticated;
set local "request.jwt.claims" =
  '{"sub":"00000000-0000-4000-8000-000000000010","role":"authenticated"}';

select is(
  public.transition_report_workflow(
    '90000000-0000-4000-8000-000000000060',
    'under_review',
    'Verifikimi fillestar u hap nga zyrtari sintetik.'
  ),
  'under_review'::public.report_status,
  'an authorized official starts review'
);

select is(
  public.transition_report_workflow(
    '90000000-0000-4000-8000-000000000060',
    'assigned',
    'Raportimi iu caktua departamentit të infrastrukturës.',
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-4000-8000-000000000010',
    'high',
    true,
    'Problem sintetik në infrastrukturë',
    'Përmbledhje publike sintetike pa identitet ose lokacion privat.'
  ),
  'assigned'::public.report_status,
  'an authorized official assigns and publishes sanitized report data'
);

select is(
  public.transition_report_workflow(
    '90000000-0000-4000-8000-000000000060',
    'in_progress',
    'Ekipi sintetik filloi ndërhyrjen.'
  ),
  'in_progress'::public.report_status,
  'an assigned report moves into progress'
);

select is(
  public.transition_report_workflow(
    '90000000-0000-4000-8000-000000000060',
    'resolved',
    'Ndërhyrja sintetike u përfundua dhe u verifikua.'
  ),
  'resolved'::public.report_status,
  'an in-progress report is resolved with a note'
);

select is(
  (
    select r.status
    from public.reports r
    where r.id = '90000000-0000-4000-8000-000000000060'
  ),
  'resolved'::public.report_status,
  'the workflow persists the final status'
);

select is(
  (
    select count(*)
    from public.report_status_history h
    where h.report_id = '90000000-0000-4000-8000-000000000060'
  ),
  5::bigint,
  'every status transition is recorded immutably'
);

select is(
  (
    select count(*)
    from public.notifications n
    where n.report_id = '90000000-0000-4000-8000-000000000060'
      and n.recipient_id = '00000000-0000-4000-8000-000000000001'
      and n.type = 'report_status_changed'
  ),
  4::bigint,
  'the citizen receives a notification for every staff status change'
);

select isnt(
  public.add_report_comment(
    '90000000-0000-4000-8000-000000000060',
    'Përditësim publik sintetik nga zyrtari.',
    false
  ),
  null::uuid,
  'staff can add a citizen-visible comment'
);

select isnt(
  public.add_report_comment(
    '90000000-0000-4000-8000-000000000060',
    'Shënim i brendshëm sintetik për stafin.',
    true
  ),
  null::uuid,
  'staff can add an internal comment'
);

set local "request.jwt.claims" =
  '{"sub":"00000000-0000-4000-8000-000000000001","role":"authenticated"}';

select is(
  (
    select count(*)
    from public.report_comments c
    where c.report_id = '90000000-0000-4000-8000-000000000060'
  ),
  1::bigint,
  'the citizen cannot read the internal staff comment'
);

select is(
  public.reopen_resolved_report(
    '90000000-0000-4000-8000-000000000060',
    'Problemi sintetik është shfaqur përsëri pas ndërhyrjes.'
  ),
  'reopened'::public.report_status,
  'the report owner can reopen a resolved report'
);

select is(
  (
    select count(*)
    from public.report_status_history h
    where h.report_id = '90000000-0000-4000-8000-000000000060'
      and h.new_status = 'reopened'
      and h.note is not null
  ),
  1::bigint,
  'reopening stores the citizen reason in status history'
);

reset role;

select is(
  (
    select count(*)
    from public.notifications n
    where n.report_id = '90000000-0000-4000-8000-000000000060'
      and n.recipient_id = '00000000-0000-4000-8000-000000000010'
      and n.type = 'report_comment_added'
  ),
  1::bigint,
  'the assigned official is notified when the citizen reopens with a comment'
);

select * from finish();

rollback;
