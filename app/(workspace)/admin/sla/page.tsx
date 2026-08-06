import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock3,
  ClockAlert,
  Filter,
} from 'lucide-react';
import { AdminMetric } from '@/components/admin/AdminMetric';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { WorkspaceHeader } from '@/components/layout/WorkspaceHeader';
import { ReportStatusBadge } from '@/components/reports/ReportStatusBadge';
import { buttonVariantsClass } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getSlaState, hoursUntilDeadline } from '@/lib/admin/sla';
import { requireAdmin } from '@/lib/admin/server';
import { formatDate } from '@/lib/utils';
import type {
  Report,
  ReportPriority,
} from '@/types/database';

export const dynamic = 'force-dynamic';

const reportColumns =
  'id, report_number, title, category_id, department_id, status, priority, sla_due_at';

type SlaReport = Pick<
  Report,
  | 'id'
  | 'report_number'
  | 'title'
  | 'category_id'
  | 'department_id'
  | 'status'
  | 'priority'
  | 'sla_due_at'
>;

const priorityLabels: Record<ReportPriority, string> = {
  low: 'I ulët',
  normal: 'Normal',
  high: 'I lartë',
  urgent: 'Urgjent',
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminSlaPage({
  searchParams,
}: {
  searchParams: Promise<{
    state?: string | string[];
    department?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const { supabase, unreadCount, sessionStartedAt } =
    await requireAdmin('/admin/sla');
  const now = new Date();
  const requestedState = firstValue(params.state);
  const state = ['overdue', 'due-soon', 'on-track'].includes(
    requestedState ?? '',
  )
    ? requestedState
    : 'overdue';
  const department = firstValue(params.department) ?? '';

  const [
    { data: reportRows, error: reportsError },
    { data: categories },
    { data: departments },
  ] = await Promise.all([
    supabase
      .from('reports')
      .select(reportColumns)
      .not('status', 'in', '(resolved,rejected)')
      .order('sla_due_at', { ascending: true }),
    supabase.from('categories').select('id, name').order('name'),
    supabase.from('departments').select('id, name').order('name'),
  ]);
  const activeReports: SlaReport[] = reportRows ?? [];
  const reports = activeReports
    .filter((report) => getSlaState(report.status, report.sla_due_at, now) === state)
    .filter((report) => !department || report.department_id === department)
    .slice(0, 100);
  const slaCounts = activeReports.reduce(
    (counts, report) => {
      const reportState = getSlaState(report.status, report.sla_due_at, now);
      if (reportState === 'overdue') counts.overdue += 1;
      if (reportState === 'due-soon') counts.dueSoon += 1;
      if (reportState === 'on-track') counts.onTrack += 1;
      return counts;
    },
    { overdue: 0, dueSoon: 0, onTrack: 0 },
  );
  const categoryNames = new Map(
    (categories ?? []).map((category) => [category.id, category.name]),
  );
  const departmentNames = new Map(
    (departments ?? []).map((item) => [item.id, item.name]),
  );

  return (
    <div className="min-h-screen">
      <WorkspaceHeader
        role="admin"
        unreadCount={unreadCount}
        sessionStartedAt={sessionStartedAt}
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <AdminPageHeader
          eyebrow="Monitorimi operacional"
          title="Afatet e shërbimit"
          description="Gjej raportimet aktive që kanë kaluar afatin ose po i afrohen atij. Afati ruhet në raportim që në momentin e krijimit."
          action={{
            href: '/admin/structure',
            label: 'Konfiguro SLA-të',
            icon: Activity,
          }}
        />

        <section
          className="mt-6 grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 lg:grid-cols-4"
          aria-label="Gjendja e SLA-së"
        >
          <AdminMetric
            label="Aktive"
            value={activeReports.length}
            detail="raportime të hapura"
            icon={Activity}
            iconClassName="bg-blue-50 text-blue-700"
          />
          <AdminMetric
            label="Jashtë afatit"
            value={slaCounts.overdue}
            detail="kërkojnë ndërhyrje"
            icon={ClockAlert}
            iconClassName="bg-rose-50 text-rose-700"
          />
          <AdminMetric
            label="Brenda 24 orëve"
            value={slaCounts.dueSoon}
            detail="afër skadimit"
            icon={Clock3}
            iconClassName="bg-amber-50 text-amber-700"
          />
          <AdminMetric
            label="Në afat"
            value={slaCounts.onTrack}
            detail="më shumë se 24 orë"
            icon={CheckCircle2}
            iconClassName="bg-emerald-50 text-emerald-700"
          />
        </section>

        <form
          method="get"
          className="mt-5 grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-end"
        >
          <label>
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
              Gjendja e afatit
            </span>
            <select name="state" defaultValue={state} className="field-input h-11">
              <option value="overdue">Jashtë afatit</option>
              <option value="due-soon">Skadojnë brenda 24 orëve</option>
              <option value="on-track">Në afat</option>
            </select>
          </label>
          <label>
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
              Departamenti
            </span>
            <select
              name="department"
              defaultValue={department}
              className="field-input h-11"
            >
              <option value="">Të gjitha departamentet</option>
              {(departments ?? []).map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className={buttonVariantsClass({
              variant: 'secondary',
              className: 'w-full sm:w-auto',
            })}
          >
            <Filter className="h-4 w-4" aria-hidden="true" />
            Filtro
          </button>
        </form>

        <section className="mt-5" aria-labelledby="sla-queue-title">
          <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
                Radha sipas afatit
              </p>
              <h2 id="sla-queue-title" className="mt-1.5 text-2xl font-black text-slate-950">
                {state === 'overdue'
                  ? 'Kërkojnë ndërhyrje'
                  : state === 'due-soon'
                    ? 'Afër skadimit'
                    : 'Në rrjedhë normale'}
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Deri në 100 raste, të renditura sipas afatit.
            </p>
          </div>

          {reportsError ? (
            <div
              role="alert"
              className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900"
            >
              Radha e SLA-së nuk mund të ngarkohet.
            </div>
          ) : reports.length ? (
            <div className="grid gap-3">
              {reports.map((report) => {
                const reportState = getSlaState(report.status, report.sla_due_at, now);
                const hours = hoursUntilDeadline(report.sla_due_at, now);
                return (
                  <Card key={report.id} className="p-4 shadow-sm sm:p-5">
                    <div className="flex min-w-0 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-black uppercase tracking-[0.12em] text-blue-700">
                            #{report.report_number}
                          </span>
                          <ReportStatusBadge status={report.status} />
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-700">
                            {priorityLabels[report.priority]}
                          </span>
                          <SlaBadge state={reportState} hours={hours} />
                        </div>
                        <h3 className="mt-2 break-words font-black text-slate-950 sm:truncate">
                          {report.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs leading-5 text-slate-500">
                          <span>
                            {categoryNames.get(report.category_id) ?? 'Pa kategori'}
                          </span>
                          <span>
                            {report.department_id
                              ? departmentNames.get(report.department_id)
                                ?? 'Departament'
                              : 'Pa departament'}
                          </span>
                          <span>Afati: {formatDate(report.sla_due_at)}</span>
                        </div>
                      </div>
                      <Link
                        href={`/official/reports/${report.id}`}
                        className={buttonVariantsClass({
                          variant: 'secondary',
                          className: 'w-full lg:w-auto',
                        })}
                      >
                        Hape rastin
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="border-dashed p-8 text-center shadow-none">
              <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" aria-hidden="true" />
              <h3 className="mt-3 font-black text-slate-950">
                Nuk ka raste në këtë filtër
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Ndrysho gjendjen ose departamentin për një pamje tjetër.
              </p>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}

function SlaBadge({
  state,
  hours,
}: {
  state: ReturnType<typeof getSlaState>;
  hours: number | null;
}) {
  const styles = {
    overdue: 'border-rose-200 bg-rose-50 text-rose-800',
    'due-soon': 'border-amber-200 bg-amber-50 text-amber-800',
    'on-track': 'border-emerald-200 bg-emerald-50 text-emerald-800',
    closed: 'border-slate-200 bg-slate-50 text-slate-600',
    unknown: 'border-slate-200 bg-slate-50 text-slate-600',
  };
  const label =
    hours === null
      ? 'Afat i panjohur'
      : hours < 0
        ? `${Math.abs(hours)} orë me vonesë`
        : `${hours} orë të mbetura`;

  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${styles[state]}`}>
      {label}
    </span>
  );
}
