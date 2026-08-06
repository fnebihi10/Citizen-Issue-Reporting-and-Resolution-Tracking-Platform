import Link from 'next/link';
import {
  Activity,
  BarChart3,
  CheckCircle2,
  Eye,
  Filter,
  Layers3,
  SearchX,
  XCircle,
} from 'lucide-react';
import { AdminMetric } from '@/components/admin/AdminMetric';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { WorkspaceHeader } from '@/components/layout/WorkspaceHeader';
import { PublicIssueMapLoader } from '@/components/map/PublicIssueMapLoader';
import { EmptyState, ErrorState } from '@/components/ui/FeedbackState';
import { buttonVariantsClass } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { requireAdmin } from '@/lib/admin/server';
import { getPublicReportsData } from '@/lib/reports/publicData';
import { toPublicReport } from '@/lib/reports/publicReport';
import {
  filterPublicReports,
  parsePublicReportFilters,
  publicPeriodOptions,
  publicStatusOptions,
  summarizePublicReports,
} from '@/lib/reports/publicTransparency';

export const dynamic = 'force-dynamic';

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string | string[];
    status?: string | string[];
    period?: string | string[];
  }>;
}) {
  const filters = parsePublicReportFilters(await searchParams);
  const { unreadCount, sessionStartedAt } =
    await requireAdmin('/admin/analytics');
  const { rows, error } = await getPublicReportsData();

  const reports = rows
    .map(toPublicReport)
    .filter((report) => report !== null);
  const visibleReports = filterPublicReports(reports, filters);
  const summary = summarizePublicReports(visibleReports);
  const categories = Array.from(
    new Map(
      reports.map((report) => [
        report.category_slug,
        report.category_name,
      ]),
    ),
    ([slug, name]) => ({ slug, name }),
  ).sort((a, b) => a.name.localeCompare(b.name, 'sq'));
  const hasFilters = Boolean(
    filters.category || filters.status || filters.period !== 'all',
  );

  return (
    <div className="min-h-screen">
      <WorkspaceHeader
        role="admin"
        unreadCount={unreadCount}
        sessionStartedAt={sessionStartedAt}
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <AdminPageHeader
          eyebrow="Transparenca dhe performanca"
          title="Analitika publike"
          description="Analizo raportimet e publikuara sipas kategorisë, statusit dhe periudhës. Harta përdor vetëm lokacionet e përgjithësuara."
          action={{
            href: '/map',
            label: 'Shiko pamjen publike',
            icon: Eye,
          }}
        />

        <form
          method="get"
          className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]"
        >
          <label>
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.11em] text-slate-500">
              Kategoria
            </span>
            <select
              name="category"
              defaultValue={filters.category}
              className="field-input"
            >
              <option value="">Të gjitha kategoritë</option>
              {categories.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.11em] text-slate-500">
              Statusi
            </span>
            <select
              name="status"
              defaultValue={filters.status ?? ''}
              className="field-input"
            >
              <option value="">Të gjitha statuset</option>
              {publicStatusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="mb-2 block text-xs font-bold uppercase tracking-[0.11em] text-slate-500">
              Periudha
            </span>
            <select
              name="period"
              defaultValue={filters.period}
              className="field-input"
            >
              {publicPeriodOptions.map((period) => (
                <option key={period.value} value={period.value}>
                  {period.label}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              className={buttonVariantsClass({
                size: 'lg',
                className: 'flex-1',
              })}
            >
              <Filter className="h-4 w-4" aria-hidden="true" />
              Apliko
            </button>
            {hasFilters ? (
              <Link
                href="/admin/analytics"
                className={buttonVariantsClass({
                  variant: 'secondary',
                  size: 'lg',
                })}
              >
                Pastro
              </Link>
            ) : null}
          </div>
        </form>

        {error ? (
          <div className="mt-6">
            <ErrorState description="Analitika publike nuk mund të ngarkohet tani." />
          </div>
        ) : (
          <>
            <section
              className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4"
              aria-label="Metrikat e transparencës"
            >
              <AdminMetric
                label="Të publikuara"
                value={summary.total}
                detail={`${reports.length} në dataset-in publik`}
                icon={BarChart3}
                iconClassName="bg-blue-50 text-blue-700"
              />
              <AdminMetric
                label="Aktive"
                value={summary.active}
                detail="në trajtim në pamjen aktuale"
                icon={Activity}
                iconClassName="bg-violet-50 text-violet-700"
              />
              <AdminMetric
                label="Të zgjidhura"
                value={summary.resolved}
                detail={`${summary.resolutionRate}% e pamjes aktuale`}
                icon={CheckCircle2}
                iconClassName="bg-emerald-50 text-emerald-700"
              />
              <AdminMetric
                label="Të refuzuara"
                value={summary.rejected}
                detail="të mbyllura pa zgjidhje"
                icon={XCircle}
                iconClassName="bg-rose-50 text-rose-700"
              />
            </section>

            {visibleReports.length === 0 ? (
              <div className="mt-6">
                <EmptyState
                  icon={SearchX}
                  title="Nuk ka të dhëna për këta filtra"
                  description="Ndrysho kategorinë, statusin ose periudhën për të zgjeruar analizën."
                  action={
                    <Link
                      href="/admin/analytics"
                      className={buttonVariantsClass({
                        variant: 'secondary',
                      })}
                    >
                      Pastro filtrat
                    </Link>
                  }
                />
              </div>
            ) : (
              <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(20rem,0.65fr)]">
                <div>
                  <PublicIssueMapLoader reports={visibleReports} />
                  <p className="mt-3 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-900">
                    <Layers3
                      className="mt-0.5 h-4 w-4 shrink-0 text-blue-700"
                      aria-hidden="true"
                    />
                    Dendësia agregohet nga lokacionet publike; pika private dhe
                    adresa e qytetarit nuk lexohen nga kjo faqe.
                  </p>
                </div>

                <div className="space-y-5">
                  <AnalyticsBreakdown
                    title="Sipas kategorisë"
                    rows={summary.categoryCounts.map((category) => ({
                      label: category.name,
                      value: category.count,
                    }))}
                  />
                  <AnalyticsBreakdown
                    title="Sipas statusit"
                    rows={publicStatusOptions
                      .map((status) => ({
                        label: status.label,
                        value: summary.statusCounts[status.value],
                      }))
                      .filter((row) => row.value > 0)}
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function AnalyticsBreakdown({
  title,
  rows,
}: {
  title: string;
  rows: Array<{ label: string; value: number }>;
}) {
  const maximum = Math.max(1, ...rows.map((row) => row.value));

  return (
    <Card className="p-5 shadow-sm">
      <h2 className="font-black text-slate-950">{title}</h2>
      <div className="mt-5 space-y-4">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-bold text-slate-600">{row.label}</span>
              <span className="font-black text-slate-950">{row.value}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{
                  width: `${Math.max(6, Math.round((row.value / maximum) * 100))}%`,
                }}
                aria-hidden="true"
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
