-- Reference data only. Synthetic citizen reports are loaded separately in a dev/test environment.

begin;

insert into public.departments (id, name, code, description)
values
  ('11111111-1111-1111-1111-111111111111', 'Shërbime Publike dhe Infrastrukturë', 'DSPI', 'Rrugë, ndriçim dhe hapësira publike.'),
  ('22222222-2222-2222-2222-222222222222', 'Inspekcion dhe Mjedis', 'DIM', 'Mbeturina, mjedisi dhe kontrolli në terren.'),
  ('33333333-3333-3333-3333-333333333333', 'Trafik dhe Sinjalistikë', 'DTS', 'Shenja trafiku, semaforë dhe vijëzime rrugore.')
on conflict (id) do update set
  name = excluded.name,
  code = excluded.code,
  description = excluded.description,
  is_active = true,
  updated_at = now();

insert into public.categories (id, slug, name, icon_key, default_sla_hours, department_id)
values
  ('a1111111-1111-1111-1111-111111111111', 'rruge-gropa', 'Rrugë dhe gropa', 'construction', 48, '11111111-1111-1111-1111-111111111111'),
  ('b2222222-2222-2222-2222-222222222222', 'ndricim-publik', 'Ndriçim publik', 'lightbulb', 24, '11111111-1111-1111-1111-111111111111'),
  ('c3333333-3333-3333-3333-333333333333', 'mbeturina', 'Mbeturina', 'trash-2', 24, '22222222-2222-2222-2222-222222222222'),
  ('d4444444-4444-4444-4444-444444444444', 'sinjalistike', 'Sinjalistikë', 'signpost', 72, '33333333-3333-3333-3333-333333333333')
on conflict (id) do update set
  slug = excluded.slug,
  name = excluded.name,
  icon_key = excluded.icon_key,
  default_sla_hours = excluded.default_sla_hours,
  department_id = excluded.department_id,
  is_active = true,
  updated_at = now();

commit;
