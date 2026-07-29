import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ReportForm } from '@/components/reports/ReportForm';
import { WorkspaceHeader } from '@/components/layout/WorkspaceHeader';
import { ErrorState } from '@/components/ui/FeedbackState';
import { buttonVariantsClass } from '@/components/ui/button';
import { requireWorkspaceRequestContext } from '@/lib/auth/serverContext';
import { createClient } from '@/lib/supabase/server';
import type { Category } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function CitizenReportPage() {
  const context = await requireWorkspaceRequestContext('/citizen/report');
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('name');
  const categories: Category[] = data ?? [];

  return (
    <div className="min-h-screen">
      <WorkspaceHeader
        unreadCount={context.unreadCount}
        sessionStartedAt={context.sessionStartedAt}
      />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><Link href="/citizen/reports" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-900"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Raportimet e mia</Link><p className="mt-6 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600"><CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Raportim qytetar</p><h1 className="mt-3 text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">Raporto një problem lokal</h1><p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">Plotëso të dhënat kryesore dhe vendos lokacionin që ekipi përgjegjës ta verifikojë çështjen.</p></div><Link href="/map" className={buttonVariantsClass({ variant: 'secondary', size: 'sm' })}>Shiko hartën publike</Link></div>
        <div className="mt-8">{error ? <ErrorState description="Kategoritë nuk mund të ngarkohen. Provo ta rifreskosh faqen." /> : categories.length === 0 ? <ErrorState title="Kategoritë mungojnë" description="Nuk ka kategori aktive për raportim. Kontakto administratorin e platformës." /> : <ReportForm categories={categories} />}</div>
      </div>
    </div>
  );
}
