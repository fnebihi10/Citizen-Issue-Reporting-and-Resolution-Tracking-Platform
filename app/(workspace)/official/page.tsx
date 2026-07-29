import Link from 'next/link';
import {
  ArrowRight,
  Bell,
  ClipboardCheck,
  Clock3,
  Flame,
  Inbox,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { WorkspaceHeader } from '@/components/layout/WorkspaceHeader';
import { ReportStatusBadge } from '@/components/reports/ReportStatusBadge';
import { buttonVariantsClass } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  getOfficialAssignedReports,
  getOfficialAttentionReports,
  summarizeOfficialWorkload,
} from '@/lib/workflow/officialDashboard';
import { getWorkspaceRequestContext } from '@/lib/auth/serverContext';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import type {
  CitizenReportListItem,
  Notification,
  ReportPriority,
} from '@/types/database';

export const dynamic = 'force-dynamic';

const reportColumns =
  'id, report_number, title, description, category_id, department_id, assigned_official_id, citizen_id, status, priority, address_text, sla_due_at, is_public, public_title, public_summary, resolution_notes, rejected_reason, resolved_at, created_at, updated_at';

const priorityLabels: Record<ReportPriority, string> = {
  low: 'I ulët',
  normal: 'Normal',
  high: 'I lartë',
  urgent: 'Urgjent',
};

const priorityStyles: Record<ReportPriority, string> = {
  low: 'border-slate-200 bg-slate-50 text-slate-600',
  normal: 'border-slate-200 bg-white text-slate-700',
  high: 'border-orange-200 bg-orange-50 text-orange-800',
  urgent: 'border-rose-200 bg-rose-50 text-rose-800',
};

function firstName(fullName: string | null | undefined) {
  const normalized = fullName?.trim();
  return normalized ? normalized.split(/\s+/)[0] : 'zyrtar';
}

export default async function OfficialDashboardPage() {
  const context = await getWorkspaceRequestContext();
  if (!context) redirect('/login?next=/official');
  if (context.role !== 'official' && context.role !== 'admin') {
    redirect('/account?error=forbidden');
  }

  const supabase = await createClient();
  const profile = {
    full_name: context.fullName,
    role: context.role,
    department_id: context.departmentId,
  };

  const [
    { data: reportRows, error: reportsError },
    { data: categories },
    { data: departments },
    { data: notificationRows },
  ] = await Promise.all([
    supabase
      .from('reports')
      .select(reportColumns)
      .order('updated_at', { ascending: false })
      .limit(200),
    supabase.from('categories').select('id, name').order('name'),
    supabase.from('departments').select('id, name').order('name'),
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
  const summary = summarizeOfficialWorkload(reports, context.userId);
  const attentionReports = getOfficialAttentionReports(reports, context.userId);
  const assignedReports = getOfficialAssignedReports(reports, context.userId);
  const categoryNames = new Map(
    (categories ?? []).map((category) => [category.id, category.name]),
  );
  const departmentNames = new Map(
    (departments ?? []).map((department) => [department.id, department.name]),
  );
  const departmentLabel =
    profile.role === 'admin'
      ? 'Pamje e autorizuar ndërdepartamentale'
      : profile.department_id
        ? departmentNames.get(profile.department_id) ?? 'Departamenti yt'
        : 'Raportime të reja pa departament';

  return (
    <div className="min-h-screen">
      <WorkspaceHeader
        role={profile.role}
        unreadCount={context.unreadCount}
        sessionStartedAt={context.sessionStartedAt}
      />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="overflow-hidden rounded-[1.75rem] bg-slate-950 px-6 py-7 text-white shadow-[0_28px_70px_-36px_rgba(15,23,42,0.75)] sm:px-8 sm:py-9 lg:px-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Paneli zyrtar
              </p>
              <h1 className="mt-4 max-w-2xl text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                Mirë se u ktheve, {firstName(profile.full_name)}.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Shiko ngarkesën e autorizuar, gjej rastet që kërkojnë vëmendje
                dhe vazhdo workflow-n nga një vend i vetëm.
              </p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
                {departmentLabel}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/official/reports"
                className={buttonVariantsClass({
                  size: 'lg',
                  className: 'bg-white text-slate-950 hover:bg-blue-50',
                })}
              >
                <Inbox className="h-4 w-4" aria-hidden="true" />
                Hap inbox-in
              </Link>
              <Link
                href="/notifications"
                className={buttonVariantsClass({
                  variant: 'ghost',
                  size: 'lg',
                  className:
                    'border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white',
                })}
              >
                <Bell className="h-4 w-4" aria-hidden="true" />
                Njoftimet
              </Link>
            </div>
          </div>
        </section>

        {reportsError ? (
          <div
            role="alert"
            className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm leading-6 text-rose-800"
          >
            Përmbledhja e workflow-t nuk u ngarkua plotësisht. Rifresko faqen
            për të provuar përsëri.
          </div>
        ) : null}

        <section
          className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4"
          aria-label="Përmbledhja e ngarkesës zyrtare"
        >
          <OfficialMetric
            label="Për verifikim"
            value={summary.awaitingReview}
            detail={`nga ${summary.total} raportime në inbox`}
            icon={ClipboardCheck}
            iconClassName="bg-amber-50 text-amber-700"
          />
          <OfficialMetric
            label="Caktuar mua"
            value={summary.assignedToMe}
            detail="raportime aktive në përgjegjësinë tënde"
            icon={UserCheck}
            iconClassName="bg-violet-50 text-violet-700"
          />
          <OfficialMetric
            label="Në proces"
            value={summary.inProgress}
            detail="raste ku puna është duke vazhduar"
            icon={RefreshCcw}
            iconClassName="bg-blue-50 text-blue-700"
          />
          <OfficialMetric
            label="Prioritet i lartë"
            value={summary.highPriority}
            detail="raste aktive high ose urgent"
            icon={Flame}
            iconClassName="bg-rose-50 text-rose-700"
          />
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(19rem,0.6fr)] lg:items-start">
          <section aria-labelledby="attention-title">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
                  Radha operative
                </p>
                <h2 id="attention-title" className="mt-2 text-2xl font-black tracking-tight text-slate-950">
                  Kërkojnë vëmendje
                </h2>
              </div>
              <Link
                href="/official/reports"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-900"
              >
                Inbox-i i plotë
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>

            {attentionReports.length === 0 ? (
              <Card className="border-dashed p-7 text-center shadow-none sm:p-9">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <ClipboardCheck className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-black text-slate-950">
                  Nuk ka raste aktive në radhë
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                  Raportimet e reja ose të rihapura do të shfaqen këtu sapo të
                  hyjnë në fushën tënde të autorizuar.
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {attentionReports.map((report) => (
                  <Link
                    key={report.id}
                    href={`/official/reports/${report.id}`}
                    className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-black uppercase tracking-[0.13em] text-blue-700">
                            #{report.report_number}
                          </span>
                          <span className="text-xs text-slate-300">•</span>
                          <span className="text-xs font-semibold text-slate-500">
                            {categoryNames.get(report.category_id) ?? 'Pa kategori'}
                          </span>
                          <ReportStatusBadge status={report.status} />
                          <span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${priorityStyles[report.priority]}`}>
                            {priorityLabels[report.priority]}
                          </span>
                        </div>
                        <h3 className="mt-2 truncate font-black text-slate-950 group-hover:text-blue-800">
                          {report.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                          <span>
                            {report.department_id
                              ? departmentNames.get(report.department_id) ?? 'Departament'
                              : 'Pa departament'}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                            Afati fillestar: {formatDate(report.sla_due_at)}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" aria-hidden="true" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-4" aria-label="Puna dhe përditësimet e zyrtarit">
            <Card className="p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.13em] text-slate-400">
                    Përgjegjësia ime
                  </p>
                  <h2 className="mt-1.5 font-black text-slate-950">Afatet më të afërta</h2>
                </div>
                <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-black text-violet-700">
                  {summary.assignedToMe}
                </span>
              </div>

              {assignedReports.length === 0 ? (
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Nuk ke raportime aktive të caktuara drejtpërdrejt.
                </p>
              ) : (
                <div className="mt-4 divide-y divide-slate-100">
                  {assignedReports.map((report) => (
                    <Link
                      key={report.id}
                      href={`/official/reports/${report.id}`}
                      className="group block py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[11px] font-black uppercase tracking-[0.12em] text-blue-700">
                          #{report.report_number}
                        </span>
                        <ReportStatusBadge status={report.status} />
                      </div>
                      <p className="mt-2 line-clamp-1 text-sm font-bold text-slate-800 group-hover:text-blue-800">
                        {report.title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {formatDate(report.sla_due_at)}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </Card>

            <Card className="p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-black text-slate-950">Përditësime të reja</h2>
                <Link href="/notifications" className="text-xs font-bold text-blue-700 hover:text-blue-900">
                  Hape inbox-in
                </Link>
              </div>
              {notifications.length === 0 ? (
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Nuk ka njoftime të palexuara.
                </p>
              ) : (
                <div className="mt-3 divide-y divide-slate-100">
                  {notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      href={
                        notification.report_id
                          ? `/official/reports/${notification.report_id}`
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

            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
              <p className="flex items-start gap-2 text-xs leading-5 text-blue-950">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" aria-hidden="true" />
                Përmbledhja përdor deri në 200 raportimet e fundit brenda
                fushës së lejuar nga roli, departamenti dhe politikat RLS
                ({summary.total} në këtë pamje).
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function OfficialMetric({
  label,
  value,
  detail,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: number;
  detail: string;
  icon: typeof Inbox;
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
