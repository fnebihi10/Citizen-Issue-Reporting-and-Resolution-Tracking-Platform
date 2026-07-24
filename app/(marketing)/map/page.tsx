import Link from 'next/link';
import { Clock3, MapPinned, ShieldCheck } from 'lucide-react';
import { PublicIssueMapLoader } from '@/components/map/PublicIssueMapLoader';
import { EmptyState, ErrorState } from '@/components/ui/FeedbackState';
import { ReportStatusBadge } from '@/components/reports/ReportStatusBadge';
import { toPublicReport } from '@/lib/reports/publicReport';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { buttonVariantsClass } from '@/components/ui/button';

export const dynamic = 'force-dynamic';

export default async function PublicMapPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('public_reports').select('*').order('created_at', { ascending: false }).limit(500);
  const reports = (data ?? [])
    .map(toPublicReport)
    .filter((report) => report !== null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Transparencë publike</p><h1 className="mt-3 text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">Harta e çështjeve të publikuara</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">Shiko vetëm raportimet që janë zgjedhur për publikim. Identiteti i qytetarit dhe lokacioni i saktë mbeten të mbrojtura.</p></div>
        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-800"><ShieldCheck className="h-4 w-4" aria-hidden="true" /> Lokacione të përshtatura</div>
      </div>

      <div className="mt-8">
        {error ? <ErrorState description="Harta publike nuk mund të lexojë të dhënat tani. Provo përsëri pas pak." /> : reports.length === 0 ? <EmptyState icon={MapPinned} title="Harta është gati, por nuk ka raportime publike ende" description="Raportimet e qytetarëve fillimisht mbeten private. Ato shfaqen këtu vetëm pasi të verifikohen dhe të publikohen me lokacion të përshtatur." action={<div className="flex flex-wrap justify-center gap-3"><Link href="/login?next=/citizen/report" className={buttonVariantsClass({ size: 'md' })}>Hyr dhe raporto</Link><Link href="/#si-funksionon" className={buttonVariantsClass({ variant: 'secondary', size: 'md' })}>Si funksionon</Link></div>} /> : <div className="grid gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.55fr)]"><PublicIssueMapLoader reports={reports} /><aside className="space-y-3" aria-label="Lista e raportimeve publike"><div className="flex items-center justify-between px-1"><h2 className="text-sm font-black uppercase tracking-[0.12em] text-slate-500">Raportimet e fundit</h2><span className="text-xs font-bold text-slate-400">{reports.length} gjithsej</span></div><div className="max-h-[560px] space-y-3 overflow-y-auto pr-1">{reports.map((report) => <article key={report.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><div className="flex items-start justify-between gap-3"><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-700">#{report.report_number} · {report.category_name}</p><ReportStatusBadge status={report.status} /></div><h3 className="mt-3 font-bold leading-5 text-slate-950">{report.title}</h3>{report.summary ? <p className="mt-2 text-sm leading-5 text-slate-600">{report.summary}</p> : null}<p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" /> {formatDate(report.updated_at)}</p></article>)}</div></aside></div>}
      </div>
    </div>
  );
}
