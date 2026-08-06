import {
  CheckCircle2,
  Clock3,
  FolderCog,
  Plus,
  Tags,
} from 'lucide-react';
import {
  createCategory,
  createDepartment,
  updateCategory,
  updateDepartment,
} from '@/app/(workspace)/admin/actions';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { WorkspaceHeader } from '@/components/layout/WorkspaceHeader';
import { buttonVariantsClass } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FlashMessage } from '@/components/ui/FlashMessage';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { requireAdmin } from '@/lib/admin/server';

export const dynamic = 'force-dynamic';

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminStructurePage({
  searchParams,
}: {
  searchParams: Promise<{
    success?: string | string[];
    error?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const { supabase, unreadCount, sessionStartedAt } =
    await requireAdmin('/admin/structure');
  const [
    { data: departments, error: departmentsError },
    { data: categories, error: categoriesError },
    { data: officials },
  ] = await Promise.all([
    supabase
      .from('departments')
      .select('id, name, code, description, is_active, created_at, updated_at')
      .order('is_active', { ascending: false })
      .order('name'),
    supabase
      .from('categories')
      .select(
        'id, name, slug, icon_key, default_sla_hours, department_id, is_active, created_at, updated_at',
      )
      .order('is_active', { ascending: false })
      .order('name'),
    supabase
      .from('profiles')
      .select('id, department_id')
      .eq('role', 'official'),
  ]);
  const officialCounts = new Map<string, number>();
  for (const official of officials ?? []) {
    if (!official.department_id) continue;
    officialCounts.set(
      official.department_id,
      (officialCounts.get(official.department_id) ?? 0) + 1,
    );
  }
  const departmentNames = new Map(
    (departments ?? []).map((department) => [department.id, department.name]),
  );
  const activeDepartments = (departments ?? []).filter(
    (department) => department.is_active,
  );

  return (
    <div className="min-h-screen">
      <WorkspaceHeader
        role="admin"
        unreadCount={unreadCount}
        sessionStartedAt={sessionStartedAt}
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <FlashMessage
          success={firstValue(params.success)}
          error={firstValue(params.error)}
        />
        <AdminPageHeader
          eyebrow="Konfigurimi komunal"
          title="Struktura dhe SLA"
          description="Organizo departamentet dhe kategoritë që drejtojnë autorizimin, caktimin fillestar dhe afatin e çdo raportimi të ri."
        />

        <section className="mt-6" aria-labelledby="departments-title">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
                Njësitë përgjegjëse
              </p>
              <h2 id="departments-title" className="mt-1.5 text-2xl font-black text-slate-950">
                Departamentet
              </h2>
            </div>
            <details className="group">
              <summary className={buttonVariantsClass({ className: 'cursor-pointer list-none [&::-webkit-details-marker]:hidden' })}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Departament i ri
              </summary>
              <Card className="mt-3 p-5 shadow-sm sm:p-6">
                <form
                  action={createDepartment}
                  className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_10rem_minmax(0,1.2fr)_auto] lg:items-end"
                >
                  <Field label="Emri">
                    <input name="name" required minLength={2} maxLength={120} className="field-input" />
                  </Field>
                  <Field label="Kodi">
                    <input
                      name="code"
                      required
                      minLength={2}
                      maxLength={12}
                      pattern="[A-Za-z0-9_-]+"
                      className="field-input uppercase"
                    />
                  </Field>
                  <Field label="Përshkrimi">
                    <input name="description" maxLength={500} className="field-input" />
                  </Field>
                  <SubmitButton pendingLabel="Duke krijuar...">Krijo</SubmitButton>
                </form>
              </Card>
            </details>
          </div>

          {departmentsError ? (
            <LoadError message="Departamentet nuk mund të ngarkohen." />
          ) : (
            <div className="mt-4 grid gap-4">
              {(departments ?? []).map((department) => (
                <Card key={department.id} className="p-5 shadow-sm">
                  <form
                    action={updateDepartment}
                    className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_9rem_minmax(0,1.2fr)_auto] xl:items-end"
                  >
                    <input type="hidden" name="id" value={department.id} />
                    <Field
                      label="Emri"
                      helper={`${officialCounts.get(department.id) ?? 0} zyrtarë`}
                    >
                      <input
                        name="name"
                        defaultValue={department.name}
                        required
                        minLength={2}
                        maxLength={120}
                        className="field-input"
                      />
                    </Field>
                    <Field label="Kodi">
                      <input
                        name="code"
                        defaultValue={department.code}
                        required
                        minLength={2}
                        maxLength={12}
                        pattern="[A-Za-z0-9_-]+"
                        className="field-input uppercase"
                      />
                    </Field>
                    <Field label="Përshkrimi">
                      <input
                        name="description"
                        defaultValue={department.description ?? ''}
                        maxLength={500}
                        className="field-input"
                      />
                    </Field>
                    <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                      <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-bold text-slate-700">
                        <input
                          type="checkbox"
                          name="isActive"
                          defaultChecked={department.is_active}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600"
                        />
                        Aktiv
                      </label>
                      <SubmitButton variant="secondary">Ruaj</SubmitButton>
                    </div>
                  </form>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="mt-8" aria-labelledby="categories-title">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
                Klasifikimi dhe afatet
              </p>
              <h2 id="categories-title" className="mt-1.5 text-2xl font-black text-slate-950">
                Kategoritë
              </h2>
            </div>
            <details className="group">
              <summary className={buttonVariantsClass({ className: 'cursor-pointer list-none [&::-webkit-details-marker]:hidden' })}>
                <Plus className="h-4 w-4" aria-hidden="true" />
                Kategori e re
              </summary>
              <Card className="mt-3 p-5 shadow-sm sm:p-6">
                <form
                  action={createCategory}
                  className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.2fr)_8rem_auto] xl:items-end"
                >
                  <Field label="Emri">
                    <input name="name" required minLength={2} maxLength={80} className="field-input" />
                  </Field>
                  <Field label="Slug-u">
                    <input
                      name="slug"
                      required
                      pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                      className="field-input"
                      placeholder="rruge-dhe-gropa"
                    />
                  </Field>
                  <Field label="Departamenti">
                    <select name="departmentId" required className="field-input">
                      <option value="">Zgjidh...</option>
                      {activeDepartments.map((department) => (
                        <option key={department.id} value={department.id}>
                          {department.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="SLA (orë)">
                    <input
                      type="number"
                      name="defaultSlaHours"
                      defaultValue={48}
                      min={1}
                      max={8760}
                      required
                      className="field-input"
                    />
                  </Field>
                  <SubmitButton pendingLabel="Duke krijuar...">Krijo</SubmitButton>
                </form>
              </Card>
            </details>
          </div>

          <div className="mt-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm leading-6 text-blue-950">
            SLA-ja e kategorisë kopjohet në raportim në momentin e krijimit.
            Ndryshimi i saj nuk ndryshon afatet historike të raporteve ekzistuese.
          </div>

          {categoriesError ? (
            <LoadError message="Kategoritë nuk mund të ngarkohen." />
          ) : (
            <div className="mt-4 grid gap-4">
              {(categories ?? []).map((category) => (
                <Card key={category.id} className="p-5 shadow-sm">
                  <form
                    action={updateCategory}
                    className="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)_minmax(0,1.25fr)_8rem_auto] xl:items-end"
                  >
                    <input type="hidden" name="id" value={category.id} />
                    <Field label="Emri">
                      <input
                        name="name"
                        defaultValue={category.name}
                        required
                        minLength={2}
                        maxLength={80}
                        className="field-input"
                      />
                    </Field>
                    <Field label="Slug-u">
                      <input
                        name="slug"
                        defaultValue={category.slug}
                        required
                        pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                        className="field-input"
                      />
                    </Field>
                    <Field
                      label="Departamenti"
                      helper={
                        departmentNames.get(category.department_id ?? '')
                          ?? 'Pa departament'
                      }
                    >
                      <select
                        name="departmentId"
                        defaultValue={category.department_id ?? ''}
                        required
                        className="field-input"
                      >
                        {activeDepartments.map((department) => (
                          <option key={department.id} value={department.id}>
                            {department.name}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="SLA (orë)">
                      <input
                        type="number"
                        name="defaultSlaHours"
                        defaultValue={category.default_sla_hours}
                        min={1}
                        max={8760}
                        required
                        className="field-input"
                      />
                    </Field>
                    <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                      <label className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-sm font-bold text-slate-700">
                        <input
                          type="checkbox"
                          name="isActive"
                          defaultChecked={category.is_active}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600"
                        />
                        Aktiv
                      </label>
                      <SubmitButton variant="secondary">Ruaj</SubmitButton>
                    </div>
                  </form>
                </Card>
              ))}
            </div>
          )}
        </section>

        <Card className="mt-6 grid gap-4 p-5 shadow-sm sm:grid-cols-3 sm:p-6">
          <ReferenceFact
            icon={FolderCog}
            label="Departamente"
            value={departments?.length ?? 0}
          />
          <ReferenceFact
            icon={Tags}
            label="Kategori"
            value={categories?.length ?? 0}
          />
          <ReferenceFact
            icon={Clock3}
            label="SLA"
            value="1–8760 orë"
          />
        </Card>
      </div>
    </div>
  );
}

function Field({
  label,
  helper,
  children,
}: {
  label: string;
  helper?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="min-w-0">
      <span className="mb-1.5 flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
        {label}
        {helper ? (
          <span className="truncate normal-case tracking-normal text-slate-400">
            {helper}
          </span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

function LoadError({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900"
    >
      {message}
    </div>
  );
}

function ReferenceFact({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.11em] text-slate-500">
          {label}
        </p>
        <p className="mt-0.5 font-black text-slate-950">{value}</p>
      </div>
    </div>
  );
}
