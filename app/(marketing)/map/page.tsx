import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Filter,
  Gauge,
  Layers3,
  MapPinned,
  Search,
  SearchX,
  ShieldCheck,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { PublicIssueMapLoader } from '@/components/map/PublicIssueMapLoader';
import {
  ReportStatusBadge,
  reportStatusLabel,
} from '@/components/reports/ReportStatusBadge';
import { EmptyState, ErrorState } from '@/components/ui/FeedbackState';
import { buttonVariantsClass } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getPublicReportsData } from '@/lib/reports/publicData';
import { toPublicReport } from '@/lib/reports/publicReport';
import {
  filterPublicReports,
  parsePublicReportFilters,
  publicPeriodOptions,
  publicStatusOptions,
  summarizePublicReports,
} from '@/lib/reports/publicTransparency';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

type PublicMapPageProps = {
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
    status?: string | string[];
    period?: string | string[];
  }>;
};

export default async function PublicMapPage({
  searchParams,
}: PublicMapPageProps) {
  const filters = parsePublicReportFilters(await searchParams);
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
    filters.query
      || filters.category
      || filters.status
      || filters.period !== 'all',
  );
  const maximumStatusCount = Math.max(
    1,
    ...Object.values(summary.statusCounts),
  );
  const maximumCategoryCount = Math.max(
    1,
    ...summary.categoryCounts.map((category) => category.count),
  );

  return (
    <div className="bg-slate-50">
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                <BarChart3 className="h-4 w-4" aria-hidden="true" />
                Transparencë publike
              </p>
              <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">
                Çështjet publike, progresi dhe rezultatet
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">
                Eksploro raportimet e publikuara me filtra, hartë të
                përgjithësuar dhe tregues të llogaritur vetëm nga të dhëna të
                sanitizuara.
              </p>
            </div>
            <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Pa identitet ose pikë private
            </div>
          </div>

          <form
            method="get"
            className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm sm:p-4"
          >
            <div className="grid gap-3 lg:grid-cols-[minmax(15rem,1fr)_13rem_12rem_12rem_auto]">
              <label className="relative min-w-0">
                <span className="sr-only">Kërko raportim publik</span>
                <Search
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  type="search"
                  name="q"
                  defaultValue={filters.query}
                  maxLength={80}
                  placeholder="Kërko titullin, kategorinë ose numrin..."
                  className="field-input pl-10"
                />
              </label>

              <label>
                <span className="sr-only">Filtro sipas kategorisë</span>
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
                <span className="sr-only">Filtro sipas statusit</span>
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
                <span className="sr-only">Filtro sipas periudhës</span>
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

              <button
                type="submit"
                className={buttonVariantsClass({
                  size: 'lg',
                  className: 'w-full lg:w-auto',
                })}
              >
                <Filter className="h-4 w-4" aria-hidden="true" />
                Filtro
              </button>
            </div>
            {hasFilters ? (
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-200 px-1 pt-3">
                <p className="text-xs font-semibold text-slate-500">
                  Po shfaqen {visibleReports.length} nga {reports.length}{' '}
                  raportime publike.
                </p>
                <Link
                  href="/map"
                  className="inline-flex min-h-11 items-center text-sm font-bold text-blue-700 hover:text-blue-900"
                >
                  Pastro filtrat
                </Link>
              </div>
            ) : null}
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {error ? (
          <ErrorState description="Të dhënat e transparencës nuk mund të ngarkohen tani. Provo përsëri pas pak." />
        ) : reports.length === 0 ? (
          <EmptyState
            icon={MapPinned}
            title="Harta është gati, por nuk ka raportime publike ende"
            description="Raportimet shfaqen këtu vetëm pasi verifikohen dhe publikohen me titull, përmbledhje dhe lokacion të përshtatur."
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  href="/login?next=/citizen/report"
                  className={buttonVariantsClass({ size: 'md' })}
                >
                  Hyr dhe raporto
                </Link>
                <Link
                  href="/#si-funksionon"
                  className={buttonVariantsClass({
                    variant: 'secondary',
                    size: 'md',
                  })}
                >
                  Si funksionon
                </Link>
              </div>
            }
          />
        ) : visibleReports.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Nuk u gjet asnjë raportim publik"
            description="Ndrysho kërkimin, kategorinë, statusin ose periudhën për të zgjeruar rezultatet."
            action={
              <Link
                href="/map"
                className={buttonVariantsClass({ variant: 'secondary' })}
              >
                Pastro filtrat
              </Link>
            }
          />
        ) : (
          <>
            <section
              className="grid grid-cols-2 gap-3 lg:grid-cols-4"
              aria-label="Përmbledhja e transparencës publike"
            >
              <PublicMetric
                label="Publike"
                value={summary.total}
                detail="në pamjen aktuale"
                icon={MapPinned}
                tone="slate"
              />
              <PublicMetric
                label="Aktive"
                value={summary.active}
                detail="ende në trajtim"
                icon={Gauge}
                tone="blue"
              />
              <PublicMetric
                label="Të zgjidhura"
                value={summary.resolved}
                detail={`${summary.resolutionRate}% e pamjes`}
                icon={CheckCircle2}
                tone="emerald"
              />
              <PublicMetric
                label="Mesatarja"
                value={
                  summary.averageResolutionDays === null
                    ? '—'
                    : `${summary.averageResolutionDays}d`
                }
                detail="deri në zgjidhje"
                icon={Clock3}
                tone="amber"
              />
            </section>

            <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(21rem,0.45fr)]">
              <div>
                <PublicIssueMapLoader reports={visibleReports} />
                <div className="mt-3 flex items-start gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-900">
                  <Layers3
                    className="mt-0.5 h-4 w-4 shrink-0 text-blue-700"
                    aria-hidden="true"
                  />
                  <p>
                    Pamja “Dendësia” grupon lokacionet tashmë të
                    përgjithësuara. Ajo tregon zona me më shumë raportime pa
                    rindërtuar pikën private.
                  </p>
                </div>
              </div>

              <aside aria-label="Lista e raportimeve publike">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-sm font-black uppercase tracking-[0.12em] text-slate-500">
                    Raportimet publike
                  </h2>
                  <span
                    className="text-xs font-bold text-slate-400"
                    aria-live="polite"
                  >
                    {visibleReports.length} gjithsej
                  </span>
                </div>
                <div className="mt-3 max-h-[600px] space-y-3 overflow-y-auto pr-1">
                  {visibleReports.map((report) => (
                    <Link
                      key={report.id}
                      href={`/reports/${report.id}`}
                      className="group block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-700">
                          #{report.report_number} · {report.category_name}
                        </p>
                        <ReportStatusBadge status={report.status} />
                      </div>
                      <h3 className="mt-3 font-black leading-5 text-slate-950 group-hover:text-blue-800">
                        {report.title}
                      </h3>
                      {report.summary ? (
                        <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">
                          {report.summary}
                        </p>
                      ) : null}
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock3
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                          {formatDate(report.updated_at)}
                        </p>
                        <ArrowRight
                          className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700"
                          aria-hidden="true"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </aside>
            </section>

            <section
              className="mt-8 grid gap-6 lg:grid-cols-2"
              aria-labelledby="public-analytics-title"
            >
              <Card className="p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                  Shpërndarja operative
                </p>
                <h2
                  id="public-analytics-title"
                  className="mt-2 text-xl font-black tracking-tight text-slate-950"
                >
                  Statuset në pamjen aktuale
                </h2>
                <div className="mt-6 space-y-4">
                  {publicStatusOptions.map((status) => {
                    const count = summary.statusCounts[status.value];
                    if (count === 0) return null;
                    return (
                      <DistributionRow
                        key={status.value}
                        label={reportStatusLabel(status.value)}
                        count={count}
                        maximum={maximumStatusCount}
                      />
                    );
                  })}
                </div>
              </Card>

              <Card className="p-5 shadow-sm sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                  Kategoritë
                </p>
                <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950">
                  Çështjet më të raportuara
                </h2>
                <div className="mt-6 space-y-4">
                  {summary.categoryCounts.map((category) => (
                    <DistributionRow
                      key={category.slug}
                      label={category.name}
                      count={category.count}
                      maximum={maximumCategoryCount}
                    />
                  ))}
                </div>
              </Card>
            </section>

            <section className="mt-8 rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-300">
                    Si lexohen të dhënat
                  </p>
                  <h2 className="mt-2 text-2xl font-black tracking-tight">
                    Transparencë pa cenuar privatësinë
                  </h2>
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-300">
                    Treguesit llogariten vetëm nga raportimet që stafi ka
                    publikuar në mënyrë eksplicite. Kërkimi nuk prek raportet
                    private, ndërsa harta përdor vetëm koordinata të
                    përgjithësuara nga serveri.
                  </p>
                </div>
                <Link
                  href="/#per-platformen"
                  className={buttonVariantsClass({
                    variant: 'secondary',
                    size: 'lg',
                    className:
                      'border-white/15 bg-white/10 text-white hover:bg-white/15 hover:text-white',
                  })}
                >
                  Lexo parimet
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

function PublicMetric({
  label,
  value,
  detail,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number | string;
  detail: string;
  icon: LucideIcon;
  tone: 'slate' | 'blue' | 'emerald' | 'amber';
}) {
  const tones = {
    slate: 'bg-slate-100 text-slate-700',
    blue: 'bg-blue-50 text-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
  };

  return (
    <Card className="p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            {value}
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
        </div>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
    </Card>
  );
}

function DistributionRow({
  label,
  count,
  maximum,
}: {
  label: string;
  count: number;
  maximum: number;
}) {
  const width = Math.max(6, Math.round((count / maximum) * 100));

  return (
    <div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="font-bold text-slate-700">{label}</span>
        <span className="font-black text-slate-950">{count}</span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600"
          style={{ width: `${width}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
