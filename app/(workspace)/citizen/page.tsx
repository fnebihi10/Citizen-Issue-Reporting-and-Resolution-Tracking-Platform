import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock3,
  FileText,
  MapPinned,
  Plus,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { WorkspaceHeader } from '@/components/layout/WorkspaceHeader';
import { ReportStatusBadge } from '@/components/reports/ReportStatusBadge';
import { buttonVariantsClass } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  getCitizenFirstName,
  getNearestActiveReport,
  summarizeCitizenReports,
} from '@/lib/reports/citizenDashboard';
import { requireWorkspaceRequestContext } from '@/lib/auth/serverContext';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import type {
  CitizenReportListItem,
  Notification,
} from '@/types/database';

export const dynamic = 'force-dynamic';

const reportColumns =
  'id, report_number, title, description, category_id, department_id, assigned_official_id, citizen_id, status, priority, address_text, sla_due_at, is_public, public_title, public_summary, resolution_notes, rejected_reason, resolved_at, created_at, updated_at';

export default async function CitizenDashboardPage() {
  const context = await requireWorkspaceRequestContext('/citizen');
  const supabase = await createClient();

  const [
    { data: reportRows, error: reportsError },
    { data: categories },
    { data: notificationRows },
  ] = await Promise.all([
    supabase
      .from('reports')
      .select(reportColumns)
      .eq('citizen_id', context.userId)
      .order('updated_at', { ascending: false })
      .limit(200),
    supabase.from('categories').select('id, name'),
    supabase
      .from('notifications')
      .select('id, recipient_id, report_id, type, title, message, read_at, created_at')
      .eq('recipient_id', context.userId)
      .is('read_at', null)
      .order('created_at', { ascending: false })
      .limit(3),
  ]);

  const reports: CitizenReportListItem[] = reportRows ?? [];
  const notifications: Notification[] = notificationRows ?? [];
  const summary = summarizeCitizenReports(reports);
  const nearestActiveReport = getNearestActiveReport(reports);
  const categoryNames = new Map(
    (categories ?? []).map((category) => [category.id, category.name]),
  );
  const firstName = getCitizenFirstName(context.fullName);

  return (
    <div className="min-h-screen">
      <WorkspaceHeader
        role="citizen"
        unreadCount={context.unreadCount}
        sessionStartedAt={context.sessionStartedAt}
      />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="relative overflow-hidden rounded-[1.75rem] bg-slate-950 px-6 py-7 text-white shadow-[0_28px_70px_-36px_rgba(15,23,42,0.75)] sm:px-8 sm:py-9 lg:px-10">
          <div
            className="absolute inset-y-0 right-0 hidden w-[46%] bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.28),transparent_68%)] lg:block"
            aria-hidden="true"
          />
          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Paneli qytetar
              </p>
              <h1 className="mt-4 max-w-2xl text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                Mirë se u ktheve, {firstName}.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Ndiq progresin e çështjeve të tua, lexo përgjigjet e ekipit dhe
                raporto probleme të reja nga një vend i vetëm.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/citizen/report"
                className={buttonVariantsClass({
                  size: 'lg',
                  className: 'bg-white text-slate-950 hover:bg-blue-50',
                })}
              >
                <Plus className="h-4 w-4" aria-hidden="true" />
                Raporto problem
              </Link>
              <Link
                href="/citizen/reports"
                className={buttonVariantsClass({
                  variant: 'ghost',
                  size: 'lg',
                  className:
                    'border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white',
                })}
              >
                Shiko raportimet
              </Link>
            </div>
          </div>
        </section>

        {reportsError ? (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm leading-6 text-rose-800"
          >
            Përmbledhja e raportimeve nuk u ngarkua plotësisht. Rifresko faqen
            për të provuar përsëri.
          </div>
        ) : null}

        <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4" aria-label="Përmbledhja e raportimeve">
          <DashboardMetric
            label="Gjithsej"
            value={summary.total}
            detail="raportime të krijuara"
            icon={FileText}
            iconClassName="bg-slate-100 text-slate-700"
          />
          <DashboardMetric
            label="Aktive"
            value={summary.active}
            detail="në trajtim ose verifikim"
            icon={RefreshCcw}
            iconClassName="bg-blue-50 text-blue-700"
          />
          <DashboardMetric
            label="Të zgjidhura"
            value={summary.resolved}
            detail="me rezultat të dokumentuar"
            icon={CheckCircle2}
            iconClassName="bg-emerald-50 text-emerald-700"
          />
          <DashboardMetric
            label="Të palexuara"
            value={context.unreadCount}
            detail="njoftime të reja"
            icon={Bell}
            iconClassName="bg-amber-50 text-amber-700"
          />
        </section>

        <div className="mt-6 grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(19rem,0.6fr)] lg:items-start">
          <section className="min-w-0" aria-labelledby="recent-reports-title">
            <div className="mb-4 flex flex-col items-start gap-2 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
                  Pamje e shpejtë
                </p>
                <h2 id="recent-reports-title" className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  Raportimet e fundit
                </h2>
              </div>
              {reports.length > 0 ? (
                <Link
                  href="/citizen/reports"
                  className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"
                >
                  Shiko të gjitha
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : null}
            </div>

            {reports.length === 0 ? (
              <Card className="border-dashed p-7 text-center shadow-none sm:p-10">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <MapPinned className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-black text-slate-950">
                  Paneli yt është gati
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  Krijo raportimin e parë me përshkrim, lokacion dhe fotografi
                  prove. Statusi do të shfaqet këtu.
                </p>
                <Link
                  href="/citizen/report"
                  className={buttonVariantsClass({ size: 'md', className: 'mt-5' })}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Krijo raportimin e parë
                </Link>
              </Card>
            ) : (
              <div className="space-y-3">
                {reports.slice(0, 3).map((report) => (
                  <Link
                    key={report.id}
                    href={`/citizen/reports/${report.id}`}
                    className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-black uppercase tracking-[0.13em] text-blue-700">
                            #{report.report_number}
                          </span>
                          <span className="text-xs text-slate-400">·</span>
                          <span className="text-xs font-semibold text-slate-500">
                            {categoryNames.get(report.category_id) ?? 'Pa kategori'}
                          </span>
                        </div>
                        <h3 className="mt-2 truncate font-black text-slate-950 group-hover:text-blue-800">
                          {report.title}
                        </h3>
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                          Përditësuar më {formatDate(report.updated_at)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center justify-between gap-3 sm:justify-end">
                        <ReportStatusBadge status={report.status} />
                        <ArrowRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" aria-hidden="true" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <aside className="min-w-0 space-y-4" aria-label="Veprimet dhe përditësimet">
            <Card className="overflow-hidden shadow-sm">
              <div className="border-b border-slate-100 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                  Hapi i radhës
                </p>
                {nearestActiveReport ? (
                  <>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <span className="text-xs font-black uppercase tracking-[0.12em] text-blue-700">
                        #{nearestActiveReport.report_number}
                      </span>
                      <ReportStatusBadge status={nearestActiveReport.status} />
                    </div>
                    <h2 className="mt-3 font-black leading-6 text-slate-950">
                      {nearestActiveReport.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Afati fillestar është {formatDate(nearestActiveReport.sla_due_at)}.
                      Kontrollo historinë për përditësimin më të fundit.
                    </p>
                    <Link
                      href={`/citizen/reports/${nearestActiveReport.id}`}
                      className="mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"
                    >
                      Hape raportimin
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </>
                ) : (
                  <>
                    <h2 className="mt-3 font-black text-slate-950">
                      Nuk ke raportime aktive
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Çështjet e reja që raporton do të shfaqen këtu gjatë trajtimit.
                    </p>
                  </>
                )}
              </div>
              <div className="flex gap-3 bg-emerald-50/70 p-5 text-sm leading-6 text-emerald-900">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                <p>
                  <strong>Privatësia ruhet.</strong> Lokacioni i saktë dhe të
                  dhënat e tua nuk shfaqen në hartën publike.
                </p>
              </div>
            </Card>

            <Card className="p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-black text-slate-950">Përditësime të reja</h2>
                <Link href="/notifications" className="text-xs font-bold text-blue-700 hover:text-blue-900">
                  Hape inbox-in
                </Link>
              </div>
              {notifications.length === 0 ? (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Je në rregull — nuk ka njoftime të palexuara.
                </p>
              ) : (
                <div className="mt-3 divide-y divide-slate-100">
                  {notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      href={
                        notification.report_id
                          ? `/citizen/reports/${notification.report_id}`
                          : '/notifications'
                      }
                      className="block py-3 first:pt-0 last:pb-0"
                    >
                      <p className="text-sm font-bold leading-5 text-slate-800 hover:text-blue-800">
                        {notification.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                        {notification.message}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </aside>
        </div>

        <section className="mt-6 grid gap-4 sm:grid-cols-2">
          <Link
            href="/map"
            className="group flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <MapPinned className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block font-black text-slate-950 group-hover:text-blue-800">
                Shiko hartën publike
              </span>
              <span className="mt-1 block text-sm leading-5 text-slate-600">
                Eksploro çështjet e publikuara me lokacion të përshtatur.
              </span>
            </span>
          </Link>
          <div className="flex items-center gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-amber-700">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <p className="text-sm leading-6 text-amber-950">
              <strong>Kjo platformë nuk trajton emergjenca.</strong> Për rrezik
              të menjëhershëm telefono{' '}
              <a
                href="tel:112"
                className="font-black underline decoration-2 underline-offset-2"
              >
                112
              </a>
              , numri unik emergjent pa pagesë në Republikën e Kosovës.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

function DashboardMetric({
  label,
  value,
  detail,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: number;
  detail: string;
  icon: typeof FileText;
  iconClassName: string;
}) {
  return (
    <Card className="p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            {value}
          </p>
        </div>
        <span className={`hidden h-10 w-10 items-center justify-center rounded-xl sm:flex ${iconClassName}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-1 hidden text-xs leading-5 text-slate-500 sm:block">{detail}</p>
    </Card>
  );
}
