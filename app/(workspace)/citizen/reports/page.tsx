import Link from 'next/link';
import { FilePlus2, MapPin, Plus, ShieldCheck } from 'lucide-react';
import { redirect } from 'next/navigation';
import { WorkspaceHeader } from '@/components/layout/WorkspaceHeader';
import { EmptyState, ErrorState } from '@/components/ui/FeedbackState';
import { buttonVariantsClass } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ReportStatusBadge } from '@/components/reports/ReportStatusBadge';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import type { CitizenReportListItem } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function CitizenReportsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/citizen/reports');

  const { data, error } = await supabase.from('reports').select('id, report_number, title, description, category_id, department_id, assigned_official_id, citizen_id, status, priority, address_text, sla_due_at, is_public, public_title, public_summary, resolution_notes, rejected_reason, resolved_at, created_at, updated_at').eq('citizen_id', user.id).order('created_at', { ascending: false });
  const reports: CitizenReportListItem[] = data ?? [];

  return (
    <div className="min-h-screen">
      <WorkspaceHeader />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Hapësira ime</p><h1 className="mt-3 text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">Raportimet e mia</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">Ndiq statusin dhe historinë bazë të çështjeve që ke raportuar. Këto të dhëna janë private dhe të dukshme vetëm për ty.</p></div><Link href="/citizen/report" className={buttonVariantsClass({ size: 'lg' })}><Plus className="h-4 w-4" aria-hidden="true" /> Raporto problem</Link></div>
        <div className="mt-8">{error ? <ErrorState description="Raportimet e tua nuk mund të ngarkohen tani. Provo përsëri pas pak." /> : reports.length === 0 ? <EmptyState icon={FilePlus2} title="Ende nuk ke raportime" description="Kur të vëresh një problem lokal, mund ta raportosh me përshkrim, lokacion dhe fotografi prove." action={<Link href="/citizen/report" className={buttonVariantsClass({ size: 'md' })}><Plus className="h-4 w-4" aria-hidden="true" /> Krijo raportimin e parë</Link>} /> : <div className="grid gap-4">{reports.map((report) => <Card key={report.id} className="p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="text-xs font-bold uppercase tracking-[0.12em] text-blue-700">Raportimi #{report.report_number}</span><ReportStatusBadge status={report.status} /></div><h2 className="mt-3 text-lg font-black tracking-tight text-slate-950">{report.title}</h2><p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{report.description}</p></div><div className="shrink-0 rounded-xl bg-slate-50 px-3.5 py-3 text-xs text-slate-600"><p className="flex items-center gap-1.5 font-semibold"><MapPin className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" /> Lokacion privat</p><p className="mt-1.5">Krijuar më {formatDate(report.created_at)}</p></div></div><div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between"><span>Afati fillestar: {formatDate(report.sla_due_at)}</span>{report.is_public ? <span className="flex items-center gap-1.5 font-semibold text-emerald-700"><ShieldCheck className="h-4 w-4" aria-hidden="true" /> Publikuar me lokacion të përshtatur</span> : <span className="font-semibold text-slate-600">Nuk është publikuar</span>}</div></Card>)}</div>}</div>
      </div>
    </div>
  );
}
