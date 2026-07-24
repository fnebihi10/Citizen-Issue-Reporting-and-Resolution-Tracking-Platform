-- Active reference data is public, while inactive rows are staff-only.
-- Splitting policies avoids invoking authenticated-only helper functions for
-- the anon role (SQL boolean expressions do not guarantee short-circuiting).

begin;

drop policy if exists departments_public_read on public.departments;
drop policy if exists departments_anon_read on public.departments;
drop policy if exists departments_authenticated_read on public.departments;

create policy departments_anon_read on public.departments
  for select to anon
  using (is_active = true);

create policy departments_authenticated_read on public.departments
  for select to authenticated
  using (is_active = true or public.is_official_or_admin());

drop policy if exists categories_public_read on public.categories;
drop policy if exists categories_anon_read on public.categories;
drop policy if exists categories_authenticated_read on public.categories;

create policy categories_anon_read on public.categories
  for select to anon
  using (is_active = true);

create policy categories_authenticated_read on public.categories
  for select to authenticated
  using (is_active = true or public.is_official_or_admin());

commit;
