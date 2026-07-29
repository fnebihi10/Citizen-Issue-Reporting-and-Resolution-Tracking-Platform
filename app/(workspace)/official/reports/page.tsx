import Link from 'next/link';
import {
  ArrowRight,
  ClipboardList,
  Filter,
  Search,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { WorkspaceHeader } from '@/components/layout/WorkspaceHeader';
import { ReportStatusBadge } from '@/components/reports/ReportStatusBadge';
import { EmptyState, ErrorState } from '@/components/ui/FeedbackState';
import { buttonVariantsClass } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getWorkspaceRequestContext } from '@/lib/auth/serverContext';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import type {
  CitizenReportListItem,
  ReportPriority,
  ReportStatus,
} from '@/types/database';

export const dynamic = 'force-dynamic';

const statusOptions: Array<{ value: ReportStatus; label: string }> = [
  { value: 'submitted', label: 'Dorëzuar' },
  { value: 'under_review', label: 'Në verifikim' },
  { value: 'assigned', label: 'Caktuar' },
  { value: 'in_progress', label: 'Në proces' },
  { value: 'resolved', label: 'Zgjidhur' },
  { value: 'rejected', label: 'Refuzuar' },
  { value: 'reopened', label: 'Rihapur' },
];

const priorityOptions: Array<{ value: ReportPriority; label: string }> = [
  { value: 'low', label: 'I ulët' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'I lartë' },
  { value: 'urgent', label: 'Urgjent' },
];

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function OfficialReportsPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string | string[];
    priority?: string | string[];
    department?: string | string[];
    q?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const context = await getWorkspaceRequestContext();
  if (!context) redirect('/login?next=/official/reports');
  if (context.role !== 'official' && context.role !== 'admin') {
    redirect('/account?error=forbidden');
  }

  const supabase = await createClient();

  const status = firstValue(params.status);
  const priority = firstValue(params.priority);
  const department = firstValue(params.department);
  const search = firstValue(params.q)?.trim().slice(0, 80) ?? '';
  const validStatus = statusOptions.some((option) => option.value === status)
    ? (status as ReportStatus)
    : null;
  const validPriority = priorityOptions.some((option) => option.value === priority)
    ? (priority as ReportPriority)
    : null;

  let reportsQuery = supabase
    .from('reports')
    .select(
      'id, report_number, title, description, category_id, department_id, assigned_official_id, citizen_id, status, priority, address_text, sla_due_at, is_public, public_title, public_summary, resolution_notes, rejected_reason, resolved_at, created_at, updated_at',
    )
    .order('sla_due_at', { ascending: true })
    .limit(100);

  if (validStatus) reportsQuery = reportsQuery.eq('status', validStatus);
  if (validPriority) reportsQuery = reportsQuery.eq('priority', validPriority);
  if (context.role === 'admin' && department) {
    reportsQuery = reportsQuery.eq('department_id', department);
  }
  if (search) reportsQuery = reportsQuery.ilike('title', `%${search}%`);

  const [
    { data: reportRows, error: reportsError },
    { data: categories },
    { data: departments },
  ] = await Promise.all([
    reportsQuery,
    supabase.from('categories').select('id, name').order('name'),
    supabase.from('departments').select('id, name').order('name'),
  ]);

  const reports: CitizenReportListItem[] = reportRows ?? [];
  const categoryNames = new Map((categories ?? []).map((item) => [item.id, item.name]));
  const departmentNames = new Map(
    (departments ?? []).map((item) => [item.id, item.name]),
  );

  return (
    <div className="min-h-screen">
      <WorkspaceHeader
        role={context.role}
        unreadCount={context.unreadCount}
        sessionStartedAt={context.sessionStartedAt}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/official"
              className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 hover:text-blue-800"
            >
              Paneli zyrtar
            </Link>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">
              Inbox-i i raportimeve
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Shfaqen vetëm raportimet brenda departamentit dhe fushës sate të
              autorizuar. Raportimet e reja pa departament janë të hapura për verifikim.
            </p>
          </div>
          <span className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm">
            {reports.length} raportime
          </span>
        </div>

        <form
          method="get"
          className="mt-8 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_180px_180px_auto]"
        >
          <label className="relative">
            <span className="sr-only">Kërko sipas titullit</span>
            <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              name="q"
              defaultValue={search}
              maxLength={80}
              placeholder="Kërko titullin..."
              className="h-11 w-full rounded-xl border border-slate-300 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label>
            <span className="sr-only">Filtro statusin</span>
            <select
              name="status"
              defaultValue={validStatus ?? ''}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Të gjitha statuset</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Filtro prioritetin</span>
            <select
              name="priority"
              defaultValue={validPriority ?? ''}
              className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Të gjitha prioritetet</option>
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className={buttonVariantsClass({ variant: 'secondary' })}>
            <Filter className="h-4 w-4" aria-hidden="true" />
            Filtro
          </button>
          {context.role === 'admin' ? (
            <label className="md:col-start-3">
              <span className="sr-only">Filtro departamentin</span>
              <select
                name="department"
                defaultValue={department ?? ''}
                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="">Të gjitha departamentet</option>
                {(departments ?? []).map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </form>

        <div className="mt-6">
          {reportsError ? (
            <ErrorState description="Inbox-i nuk mund të ngarkohet tani. Provo përsëri pas pak." />
          ) : reports.length === 0 ? (
            <EmptyState
              icon={ClipboardList}
              title="Nuk ka raportime në këtë filtër"
              description="Ndrysho filtrat ose kontrollo përsëri kur të mbërrijnë raportime të reja."
            />
          ) : (
            <div className="grid gap-4">
              {reports.map((report) => {
                return (
                  <Card key={report.id} className="p-5 shadow-sm sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
                            #{report.report_number}
                          </span>
                          <ReportStatusBadge status={report.status} />
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600">
                            {priorityOptions.find((item) => item.value === report.priority)?.label}
                          </span>
                        </div>
                        <h2 className="mt-3 text-lg font-black tracking-tight text-slate-950">
                          {report.title}
                        </h2>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">
                          {report.description}
                        </p>
                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
                          <span>{categoryNames.get(report.category_id) ?? 'Kategori'}</span>
                          <span>
                            {report.department_id
                              ? departmentNames.get(report.department_id) ?? 'Departament'
                              : 'Pa departament'}
                          </span>
                          <span>Afati: {formatDate(report.sla_due_at)}</span>
                        </div>
                      </div>
                      <Link
                        href={`/official/reports/${report.id}`}
                        className={buttonVariantsClass({ variant: 'secondary' })}
                      >
                        Hape
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
