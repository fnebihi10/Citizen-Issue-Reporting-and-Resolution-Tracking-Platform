import Link from 'next/link';
import {
  ArrowRight,
  CalendarClock,
  FilePlus2,
  MapPin,
  Plus,
  Search,
  SearchX,
  ShieldCheck,
  SlidersHorizontal,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { WorkspaceHeader } from '@/components/layout/WorkspaceHeader';
import { ReportStatusBadge } from '@/components/reports/ReportStatusBadge';
import { EmptyState, ErrorState } from '@/components/ui/FeedbackState';
import { buttonVariantsClass } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  filterCitizenReports,
  summarizeCitizenReports,
  type CitizenReportView,
} from '@/lib/reports/citizenDashboard';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import type { CitizenReportListItem } from '@/types/database';

export const dynamic = 'force-dynamic';

const reportColumns =
  'id, report_number, title, description, category_id, department_id, assigned_official_id, citizen_id, status, priority, address_text, sla_due_at, is_public, public_title, public_summary, resolution_notes, rejected_reason, resolved_at, created_at, updated_at';

const viewOptions: Array<{
  value: CitizenReportView;
  label: string;
}> = [
  { value: 'all', label: 'Të gjitha' },
  { value: 'active', label: 'Aktive' },
  { value: 'resolved', label: 'Të zgjidhura' },
  { value: 'rejected', label: 'Të refuzuara' },
];

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isCitizenReportView(value: string | undefined): value is CitizenReportView {
  return viewOptions.some((option) => option.value === value);
}

function reportsHref(view: CitizenReportView, search: string) {
  const params = new URLSearchParams();
  if (view !== 'all') params.set('view', view);
  if (search) params.set('q', search);
  const query = params.toString();
  return query ? `/citizen/reports?${query}` : '/citizen/reports';
}

export default async function CitizenReportsPage({
  searchParams,
}: {
  searchParams: Promise<{
    view?: string | string[];
    q?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/citizen/reports');

  const requestedView = firstValue(params.view);
  const view = isCitizenReportView(requestedView) ? requestedView : 'all';
  const search = firstValue(params.q)?.trim().slice(0, 80) ?? '';

  const [
    { data: profile },
    { data: reportRows, error },
    { data: categories },
    { count: unreadCount },
  ] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user.id).maybeSingle(),
    supabase
      .from('reports')
      .select(reportColumns)
      .eq('citizen_id', user.id)
      .order('created_at', { ascending: false })
      .limit(200),
    supabase.from('categories').select('id, name'),
    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', user.id)
      .is('read_at', null),
  ]);

  if (profile?.role !== 'citizen') redirect('/account?error=forbidden');

  const reports: CitizenReportListItem[] = reportRows ?? [];
  const visibleReports = filterCitizenReports(reports, view, search);
  const summary = summarizeCitizenReports(reports);
  const categoryNames = new Map(
    (categories ?? []).map((category) => [category.id, category.name]),
  );
  const viewCounts: Record<CitizenReportView, number> = {
    all: summary.total,
    active: summary.active,
    resolved: summary.resolved,
    rejected: summary.rejected,
  };
  const hasFilters = view !== 'all' || Boolean(search);

  return (
    <div className="min-h-screen">
      <WorkspaceHeader role="citizen" unreadCount={unreadCount ?? 0} />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <Link
              href="/citizen"
              className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600 hover:text-blue-800"
            >
              Paneli qytetar
            </Link>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">
              Raportimet e mia
            </h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Kërko, filtro dhe ndiq historinë e çdo çështjeje. Përmbajtja e
              plotë e këtyre raportimeve është private dhe e dukshme vetëm për ty.
            </p>
          </div>
          <Link href="/citizen/report" className={buttonVariantsClass({ size: 'lg' })}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            Raporto problem
          </Link>
        </div>

        {error ? (
          <div className="mt-8">
            <ErrorState description="Raportimet e tua nuk mund të ngarkohen tani. Provo përsëri pas pak." />
          </div>
        ) : reports.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              icon={FilePlus2}
              title="Ende nuk ke raportime"
              description="Kur të vëresh një problem lokal, mund ta raportosh me përshkrim, lokacion dhe fotografi prove."
              action={
                <Link href="/citizen/report" className={buttonVariantsClass({ size: 'md' })}>
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Krijo raportimin e parë
                </Link>
              }
            />
          </div>
        ) : (
          <>
            <Card className="mt-8 p-3 shadow-sm sm:p-4">
              <div className="flex items-center gap-2 px-1 pb-3 text-xs font-bold uppercase tracking-[0.12em] text-slate-500 sm:hidden">
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                Filtro raportimet
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0" aria-label="Filtro sipas gjendjes">
                {viewOptions.map((option) => {
                  const active = option.value === view;
                  return (
                    <Link
                      key={option.value}
                      href={reportsHref(option.value, search)}
                      aria-current={active ? 'page' : undefined}
                      className={[
                        'inline-flex h-11 shrink-0 items-center gap-2 rounded-xl px-3.5 text-sm font-bold transition-colors',
                        active
                          ? 'bg-slate-950 text-white'
                          : 'bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-800',
                      ].join(' ')}
                    >
                      {option.label}
                      <span
                        className={[
                          'rounded-full px-1.5 py-0.5 text-[10px]',
                          active ? 'bg-white/15 text-white' : 'bg-white text-slate-500',
                        ].join(' ')}
                      >
                        {viewCounts[option.value]}
                      </span>
                    </Link>
                  );
                })}
              </div>

              <form action="/citizen/reports" className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row">
                {view !== 'all' ? <input type="hidden" name="view" value={view} /> : null}
                <label className="relative flex-1">
                  <span className="sr-only">Kërko raportim</span>
                  <Search
                    className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    type="search"
                    name="q"
                    defaultValue={search}
                    maxLength={80}
                    placeholder="Kërko me titull, përshkrim ose numër..."
                    className="field-input pl-10"
                  />
                </label>
                <button type="submit" className={buttonVariantsClass({ variant: 'secondary' })}>
                  Kërko
                </button>
                {hasFilters ? (
                  <Link
                    href="/citizen/reports"
                    className={buttonVariantsClass({ variant: 'ghost' })}
                  >
                    Pastro
                  </Link>
                ) : null}
              </form>
            </Card>

            <div className="mt-5 flex items-center justify-between gap-4 px-1">
              <p aria-live="polite" className="text-sm font-semibold text-slate-600">
                {visibleReports.length}{' '}
                {visibleReports.length === 1 ? 'raportim' : 'raportime'}
                {hasFilters ? ' në këtë pamje' : ''}
              </p>
              <p className="hidden text-xs text-slate-500 sm:block">
                Renditur nga më i riu
              </p>
            </div>

            {visibleReports.length === 0 ? (
              <div className="mt-4">
                <EmptyState
                  icon={SearchX}
                  title="Nuk u gjet asnjë raportim"
                  description="Ndrysho fjalën e kërkimit ose zgjidh një gjendje tjetër."
                  action={
                    <Link
                      href="/citizen/reports"
                      className={buttonVariantsClass({ variant: 'secondary' })}
                    >
                      Pastro filtrat
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="mt-4 grid gap-4">
                {visibleReports.map((report) => (
                  <Card
                    key={report.id}
                    className="group overflow-hidden shadow-sm transition hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-black uppercase tracking-[0.12em] text-blue-700">
                              #{report.report_number}
                            </span>
                            <span className="text-xs text-slate-300">•</span>
                            <span className="text-xs font-semibold text-slate-500">
                              {categoryNames.get(report.category_id) ?? 'Pa kategori'}
                            </span>
                            <ReportStatusBadge status={report.status} />
                          </div>
                          <h2 className="mt-3 text-lg font-black tracking-tight text-slate-950">
                            {report.title}
                          </h2>
                          <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-600">
                            {report.description}
                          </p>
                        </div>
                        <div className="grid shrink-0 gap-2 text-xs text-slate-600 sm:grid-cols-2 lg:w-64 lg:grid-cols-1">
                          <p className="flex min-h-10 items-center gap-2 rounded-xl bg-slate-50 px-3">
                            <CalendarClock className="h-4 w-4 text-blue-600" aria-hidden="true" />
                            Afati: {formatDate(report.sla_due_at)}
                          </p>
                          <p className="flex min-h-10 items-center gap-2 rounded-xl bg-slate-50 px-3">
                            <MapPin className="h-4 w-4 text-blue-600" aria-hidden="true" />
                            Lokacioni ruhet privat
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                        <span>Krijuar më {formatDate(report.created_at)}</span>
                        {report.is_public ? (
                          <span className="flex items-center gap-1.5 font-semibold text-emerald-700">
                            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                            Publikuar në mënyrë të sanitizuar
                          </span>
                        ) : (
                          <span className="font-semibold text-slate-600">Jo publik</span>
                        )}
                      </div>
                      <Link
                        href={`/citizen/reports/${report.id}`}
                        className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"
                      >
                        Detajet dhe historia
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" aria-hidden="true" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
