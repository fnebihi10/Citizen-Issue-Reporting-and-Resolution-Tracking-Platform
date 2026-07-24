import Link from 'next/link';
import { redirect } from 'next/navigation';
import { AlertTriangle, CalendarDays, ChevronRight, FilePlus2, Flag, Mail, ShieldCheck, UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SignOutButton } from '@/components/auth/SignOutButton';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import type { UserRole } from '@/types/database';

export const dynamic = 'force-dynamic';

const roleLabels: Record<UserRole, string> = {
  citizen: 'Qytetar',
  official: 'Zyrtar komunal',
  admin: 'Administrator',
};

type AccountPageProps = {
  searchParams: Promise<{ error?: string | string[] }>;
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const params = await searchParams;
  const accessDenied = params.error === 'forbidden';
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login?next=/account');

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, role, created_at')
    .eq('id', user.id)
    .maybeSingle();

  const role: UserRole = profile?.role ?? 'citizen';
  const fullName = profile?.full_name ?? 'Qytetar';

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white"><Flag className="h-5 w-5" /></span><span><span className="block text-sm font-extrabold tracking-tight text-slate-950">Raporto Qytetin</span><span className="block text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-500">Llogaria ime</span></span></Link>
          <SignOutButton />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {accessDenied ? (
          <div role="alert" className="mb-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm leading-6 text-amber-900">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <span>Roli i llogarisë sate nuk ka qasje në atë hapësirë.</span>
          </div>
        ) : null}
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Sesioni është aktiv</p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">Mirë se erdhe, {fullName}.</h1>
            <p className="mt-3 max-w-xl text-base leading-7 text-slate-600">Kjo hapësirë mban të ndara të dhënat e tua private nga informacioni që do të shfaqet publikisht për raportimet.</p>

            <Card className="mt-8 overflow-hidden shadow-[0_24px_60px_-38px_rgba(15,23,42,0.25)]">
              <div className="flex flex-col gap-5 border-b border-slate-100 bg-slate-950 p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <div className="flex items-center gap-4"><span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600"><UserRound className="h-7 w-7" /></span><div><p className="text-lg font-extrabold">Profili im</p><p className="mt-1 text-sm text-slate-300">Informacion i dukshëm vetëm për ty dhe sistemin e autorizuar.</p></div></div>
                <Badge className="w-fit border-blue-300/20 bg-blue-400/10 text-blue-100"><ShieldCheck className="h-3.5 w-3.5" /> {roleLabels[role]}</Badge>
              </div>
              <div className="grid gap-px bg-slate-100 sm:grid-cols-2">
                <div className="bg-white p-5"><p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">Emri</p><p className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-800"><UserRound className="h-4 w-4 text-blue-600" /> {fullName}</p></div>
                <div className="bg-white p-5"><p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">Email-i</p><p className="mt-2 flex items-center gap-2 break-all text-sm font-bold text-slate-800"><Mail className="h-4 w-4 shrink-0 text-blue-600" /> {profile?.email ?? user.email}</p></div>
                <div className="bg-white p-5"><p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">Roli</p><p className="mt-2 text-sm font-bold text-slate-800">{roleLabels[role]}</p></div>
                <div className="bg-white p-5"><p className="text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">Llogaria u krijua</p><p className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-800"><CalendarDays className="h-4 w-4 text-blue-600" /> {formatDate(profile?.created_at ?? user.created_at)}</p></div>
              </div>
            </Card>
          </div>

          <Card className="overflow-hidden border-blue-100 bg-blue-50/50 p-6 shadow-sm sm:p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm"><FilePlus2 className="h-6 w-6" /></span>
            <h2 className="mt-5 text-xl font-black tracking-tight text-slate-950">Raportimet e mia</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">Krijo një raportim të ri ose ndiq statusin e çështjeve që ke dërguar më herët.</p>
            <div className="mt-6 rounded-xl border border-blue-100 bg-white/80 p-4 text-sm leading-6 text-blue-900"><strong>Privatësia ruhet:</strong> profili yt nuk shfaqet në hartën publike ose në faqet publike të raportimeve.</div>
            <div className="mt-6 flex flex-wrap gap-3"><Link href="/citizen/report" className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-700 hover:text-blue-800">Raporto problem <ChevronRight className="h-4 w-4" /></Link><Link href="/citizen/reports" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-600 hover:text-slate-900">Shiko raportimet <ChevronRight className="h-4 w-4" /></Link></div>
          </Card>
        </div>
      </div>
    </div>
  );
}
