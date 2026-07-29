import Link from 'next/link';
import {
  Activity,
  ArrowRight,
  ClockAlert,
  FileDown,
  FolderCog,
  Layers3,
  ShieldCheck,
  Sparkles,
  Users,
  UserRoundCog,
} from 'lucide-react';
import { WorkspaceHeader } from '@/components/layout/WorkspaceHeader';
import { AdminMetric } from '@/components/admin/AdminMetric';
import { buttonVariantsClass } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { requireAdmin } from '@/lib/admin/server';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

function firstName(fullName: string | null | undefined) {
  const normalized = fullName?.trim();
  return normalized ? normalized.split(/\s+/)[0] : 'administrator';
}

const actionLabels: Record<string, string> = {
  'profiles.updated': 'Qasja e përdoruesit u ndryshua',
  'departments.created': 'Departament i ri',
  'departments.updated': 'Departamenti u ndryshua',
  'categories.created': 'Kategori e re',
  'categories.updated': 'Kategoria ose SLA-ja u ndryshua',
  'reports.exported': 'Raportimet u eksportuan',
  'report.created': 'Raportim i krijuar',
  'report.updated': 'Raportim i përditësuar',
};

export default async function AdminDashboardPage() {
  const { supabase, fullName, unreadCount, sessionStartedAt } =
    await requireAdmin('/admin');
  const now = new Date();
  const dueSoon = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const [
    users,
    officials,
    departments,
    categories,
    activeReports,
    overdueReports,
    dueSoonReports,
    recentAudit,
  ] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('role', 'official'),
    supabase
      .from('departments')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase
      .from('categories')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),
    supabase
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .not('status', 'in', '(resolved,rejected)'),
    supabase
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .not('status', 'in', '(resolved,rejected)')
      .lt('sla_due_at', now.toISOString()),
    supabase
      .from('reports')
      .select('id', { count: 'exact', head: true })
      .not('status', 'in', '(resolved,rejected)')
      .gte('sla_due_at', now.toISOString())
      .lte('sla_due_at', dueSoon.toISOString()),
    supabase
      .from('audit_logs')
      .select('id, action, actor_id, entity_type, entity_id, details, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
  ]);

  const hasLoadError = [
    users,
    officials,
    departments,
    categories,
    activeReports,
    overdueReports,
    dueSoonReports,
    recentAudit,
  ].some((result) => result.error);

  return (
    <div className="min-h-screen">
      <WorkspaceHeader
        role="admin"
        unreadCount={unreadCount}
        sessionStartedAt={sessionStartedAt}
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="overflow-hidden rounded-[1.75rem] bg-slate-950 px-6 py-7 text-white shadow-[0_28px_70px_-36px_rgba(15,23,42,0.75)] sm:px-8 sm:py-9 lg:px-10">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Paneli administrativ
              </p>
              <h1 className="mt-4 max-w-2xl text-3xl font-black tracking-[-0.045em] sm:text-4xl">
                Mirë se u ktheve, {firstName(fullName)}.
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
                Menaxho qasjen, strukturën komunale dhe afatet nga një pamje e
                vetme, me çdo ndryshim të ndjeshëm të regjistruar.
              </p>
              <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" aria-hidden="true" />
                Qasje administrative e audituar
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/admin/users"
                className={buttonVariantsClass({
                  size: 'lg',
                  className: 'bg-white text-slate-950 hover:bg-blue-50',
                })}
              >
                <UserRoundCog className="h-4 w-4" aria-hidden="true" />
                Menaxho qasjen
              </Link>
              <Link
                href="/admin/sla"
                className={buttonVariantsClass({
                  variant: 'ghost',
                  size: 'lg',
                  className:
                    'border border-white/15 bg-white/5 text-white hover:bg-white/10 hover:text-white',
                })}
              >
                <Activity className="h-4 w-4" aria-hidden="true" />
                Shiko SLA-në
              </Link>
            </div>
          </div>
        </section>

        {hasLoadError ? (
          <div
            role="alert"
            className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900"
          >
            Disa metrika nuk u ngarkuan plotësisht. Asnjë e dhënë nuk u
            ndryshua; rifresko faqen për të provuar përsëri.
          </div>
        ) : null}

        <section
          className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4"
          aria-label="Përmbledhja administrative"
        >
          <AdminMetric
            label="Përdorues"
            value={users.count ?? 0}
            detail={`${officials.count ?? 0} zyrtarë komunalë`}
            icon={Users}
            iconClassName="bg-blue-50 text-blue-700"
          />
          <AdminMetric
            label="Struktura aktive"
            value={departments.count ?? 0}
            detail={`${categories.count ?? 0} kategori aktive`}
            icon={Layers3}
            iconClassName="bg-violet-50 text-violet-700"
          />
          <AdminMetric
            label="Raportime aktive"
            value={activeReports.count ?? 0}
            detail="jashtë statuseve të mbyllura"
            icon={Activity}
            iconClassName="bg-emerald-50 text-emerald-700"
          />
          <AdminMetric
            label="Jashtë afatit"
            value={overdueReports.count ?? 0}
            detail={`${dueSoonReports.count ?? 0} skadojnë brenda 24 orëve`}
            icon={ClockAlert}
            iconClassName="bg-rose-50 text-rose-700"
          />
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
          <section aria-labelledby="admin-actions-title">
            <div className="mb-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
                Kontrolli i sistemit
              </p>
              <h2 id="admin-actions-title" className="mt-1.5 text-2xl font-black tracking-tight text-slate-950">
                Çfarë kërkon vëmendje
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <AdminAction
                href="/admin/users"
                icon={Users}
                title="Përdoruesit dhe rolet"
                description="Cakto zyrtarë dhe departamentet e tyre."
              />
              <AdminAction
                href="/admin/structure"
                icon={FolderCog}
                title="Struktura dhe kategoritë"
                description="Menaxho departamentet dhe SLA-të fillestare."
              />
              <AdminAction
                href="/admin/sla"
                icon={ClockAlert}
                title="Monitorimi i SLA-së"
                description="Prioritizo rastet jashtë afatit ose pranë skadimit."
              />
              <AdminAction
                href="/admin/exports"
                icon={FileDown}
                title="Eksport operacional"
                description="Shkarko CSV ose JSON pa të dhëna personale."
              />
            </div>
          </section>

          <aside aria-labelledby="recent-audit-title">
            <Card className="h-full p-5 shadow-sm sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.13em] text-slate-400">
                    Gjurmueshmëria
                  </p>
                  <h2 id="recent-audit-title" className="mt-1.5 font-black text-slate-950">
                    Aktiviteti i fundit
                  </h2>
                </div>
                <Link
                  href="/admin/audit"
                  className="inline-flex min-h-11 items-center gap-1 text-xs font-bold text-blue-700 hover:text-blue-900"
                >
                  Shiko të gjitha
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
              {recentAudit.data?.length ? (
                <div className="mt-3 divide-y divide-slate-100">
                  {recentAudit.data.map((entry) => (
                    <div key={entry.id} className="py-3 first:pt-0 last:pb-0">
                      <p className="text-sm font-bold leading-5 text-slate-800">
                        {actionLabels[entry.action] ?? entry.action}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {formatDate(entry.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  Ende nuk ka aktivitet administrativ për t’u shfaqur.
                </p>
              )}
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
}

function AdminAction({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: typeof Users;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex min-h-32 min-w-0 items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-black text-slate-950 group-hover:text-blue-800">
          {title}
        </span>
        <span className="mt-1.5 block text-sm leading-6 text-slate-600">
          {description}
        </span>
      </span>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" aria-hidden="true" />
    </Link>
  );
}
