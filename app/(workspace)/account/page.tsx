import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FilePlus2,
  KeyRound,
  LayoutDashboard,
  LockKeyhole,
  Mail,
  Map,
  Phone,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { WorkspaceHeader } from '@/components/layout/WorkspaceHeader';
import { Badge } from '@/components/ui/badge';
import { buttonVariantsClass } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getRoleHomePath } from '@/lib/auth/redirect';
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

function getInitials(fullName: string) {
  const initials = fullName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toLocaleUpperCase('sq-AL'))
    .join('');
  return initials || 'Q';
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const params = await searchParams;
  const accessDenied = params.error === 'forbidden';
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?next=/account');

  const [{ data: profile }, { count: unreadCount }] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name, email, phone, role, created_at')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', user.id)
      .is('read_at', null),
  ]);

  const role: UserRole = profile?.role ?? 'citizen';
  const fullName = profile?.full_name?.trim() || 'Qytetar';
  const email = profile?.email ?? user.email ?? 'Nuk është vendosur';
  const roleHome = getRoleHomePath(role);
  const isCitizen = role === 'citizen';
  const emailVerified = Boolean(user.email_confirmed_at);

  return (
    <div className="min-h-screen">
      <WorkspaceHeader role={role} unreadCount={unreadCount ?? 0} />

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        {accessDenied ? (
          <div
            role="alert"
            className="mb-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm leading-6 text-amber-950"
          >
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
            <div>
              <p className="font-bold">Nuk ke qasje në atë hapësirë</p>
              <p className="mt-0.5 text-amber-900">
                Të kthyem te llogaria jote sepse roli yt nuk e lejon atë faqe.
              </p>
            </div>
          </div>
        ) : null}

        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
              Llogaria
            </p>
            <h1 className="mt-2.5 text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">
              Profili dhe siguria
            </h1>
            <p className="mt-2.5 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Shiko të dhënat e llogarisë, rolin dhe mënyrën si mbrohet
              informacioni yt në platformë.
            </p>
          </div>
          <Link
            href={roleHome}
            className={buttonVariantsClass({
              variant: 'secondary',
              className: 'w-full shrink-0 sm:w-auto',
            })}
          >
            {isCitizen ? (
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
            )}
            {isCitizen ? 'Kthehu te paneli' : 'Hap inbox-in'}
          </Link>
        </header>

        <section
          className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] xl:items-stretch"
          aria-label="Përmbledhja e llogarisë"
        >
          <Card className="flex h-full min-w-0 flex-col overflow-hidden shadow-sm">
            <div className="bg-slate-950 p-5 text-white sm:p-6">
              <div className="flex min-w-0 items-center gap-4">
                <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-white/15 bg-blue-600 text-xl font-black shadow-sm">
                  {getInitials(fullName)}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-300">
                    Profili im
                  </p>
                  <h2 className="mt-1.5 truncate text-xl font-black tracking-tight">
                    {fullName}
                  </h2>
                  <p className="mt-1 break-all text-sm leading-5 text-slate-300">{email}</p>
                </div>
              </div>
              <Badge className="mt-5 border-blue-300/20 bg-blue-400/10 text-blue-100">
                <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                {roleLabels[role]}
              </Badge>
            </div>

            <div className="flex flex-1 flex-col p-5 sm:p-6">
              <div className="grid gap-3 sm:grid-cols-2">
                <ProfileFact
                  icon={CheckCircle2}
                  label={emailVerified ? 'Email i verifikuar' : 'Email në pritje'}
                  value={
                    emailVerified
                      ? 'Gati për njoftime dhe rikuperim.'
                      : 'Kontrollo inbox-in për konfirmim.'
                  }
                  tone={emailVerified ? 'success' : 'warning'}
                />
                <ProfileFact
                  icon={CalendarDays}
                  label="Anëtar që nga"
                  value={formatDate(profile?.created_at ?? user.created_at)}
                  tone="info"
                />
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
                <p className="text-xs leading-5 text-blue-950">
                  <strong className="font-bold">Profili yt mbetet privat.</strong>{' '}
                  Identiteti dhe kontakti nuk shfaqen në hartën ose raportimet publike.
                </p>
              </div>
            </div>
          </Card>

          <Card className="h-full min-w-0 p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <UserRound className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="text-lg font-black text-slate-950">Të dhënat e llogarisë</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Informacioni që sistemi përdor për identifikim dhe autorizim.
                </p>
              </div>
            </div>

            <dl className="mt-5 grid gap-3 sm:grid-cols-2">
              <AccountField icon={UserRound} label="Emri i plotë" value={fullName} />
              <AccountField icon={Mail} label="Email-i" value={email} breakAll />
              <AccountField
                icon={ShieldCheck}
                label="Roli në platformë"
                value={roleLabels[role]}
              />
              <AccountField
                icon={Phone}
                label="Telefoni"
                value={profile?.phone?.trim() || 'Nuk është shtuar'}
                muted={!profile?.phone}
              />
            </dl>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-600">
              {isCitizen
                ? 'Roli qytetar caktohet automatikisht gjatë regjistrimit dhe nuk ndryshohet nga kjo faqe.'
                : 'Roli dhe departamenti i stafit menaxhohen vetëm nga administratori i autorizuar.'}
            </div>
          </Card>
        </section>

        <section className="mt-5" aria-labelledby="security-title">
          <Card className="overflow-hidden border-slate-800 bg-slate-950 text-white shadow-sm">
            <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(15rem,0.72fr)_minmax(0,1.28fr)] lg:items-center">
              <div className="flex items-start gap-3">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-blue-300">
                  <LockKeyhole className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 id="security-title" className="text-lg font-black">
                    Siguria dhe privatësia
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-300">
                    Mbrojtje e qartë, pa ekspozuar të dhënat e tua.
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <SecurityFeature
                  icon={ShieldCheck}
                  title="Profil privat"
                  description="Emri, email-i dhe kontakti nuk publikohen."
                  iconClassName="text-emerald-300"
                />
                <SecurityFeature
                  icon={KeyRound}
                  title="Qasje e mbrojtur"
                  description="Vetëm sesioni yt lexon raportimet private."
                  iconClassName="text-blue-300"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3 border-t border-white/10 bg-white/[0.03] px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <p className="text-xs leading-5 text-slate-400">
                Dyshon se fjalëkalimi yt është komprometuar?
              </p>
              <Link
                href="/forgot-password"
                className="inline-flex min-h-11 items-center gap-2 self-start text-sm font-bold text-blue-300 transition-colors hover:text-blue-200 sm:self-auto"
              >
                Rivendos fjalëkalimin
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Card>
        </section>

        <section className="mt-5" aria-labelledby="account-shortcuts-title">
          <Card className="p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
                  Qasje e shpejtë
                </p>
                <h2 id="account-shortcuts-title" className="mt-1.5 text-lg font-black text-slate-950">
                  Vazhdo në platformë
                </h2>
              </div>
              <p className="text-xs leading-5 text-slate-500">
                Shkurtoret kryesore për rolin tënd.
              </p>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {isCitizen ? (
                <>
                  <AccountShortcut
                    href="/citizen"
                    icon={LayoutDashboard}
                    title="Paneli qytetar"
                    description="Përmbledhja dhe hapi i radhës"
                  />
                  <AccountShortcut
                    href="/citizen/reports"
                    icon={FilePlus2}
                    title="Raportimet"
                    description="Kërko dhe ndiq historinë"
                  />
                  <AccountShortcut
                    href="/citizen/report"
                    icon={Map}
                    title="Raporto problem"
                    description="Krijo një raportim të ri"
                    className="md:col-span-2 xl:col-span-1"
                  />
                </>
            ) : (
              <>
                <AccountShortcut
                  href="/official"
                  icon={LayoutDashboard}
                  title="Paneli zyrtar"
                  description="Përmbledhja e ngarkesës operative"
                />
                <AccountShortcut
                  href="/official/reports"
                  icon={ClipboardList}
                    title="Inbox-i zyrtar"
                    description="Hap workflow-n e autorizuar"
                  />
                <AccountShortcut
                  href="/notifications"
                  icon={Bell}
                  title="Njoftimet"
                  description="Shiko përditësimet e reja"
                  className="md:col-span-2 xl:col-span-1"
                />
                </>
              )}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

function ProfileFact({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
  tone: 'success' | 'warning' | 'info';
}) {
  const toneClasses = {
    success: 'bg-emerald-50 text-emerald-700',
    warning: 'bg-amber-50 text-amber-700',
    info: 'bg-blue-50 text-blue-700',
  };

  return (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-slate-200 p-3.5">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toneClasses[tone]}`}>
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold text-slate-900">{label}</p>
        <p className="mt-0.5 text-xs leading-5 text-slate-500">{value}</p>
      </div>
    </div>
  );
}

function AccountField({
  icon: Icon,
  label,
  value,
  breakAll = false,
  muted = false,
}: {
  icon: typeof UserRound;
  label: string;
  value: string;
  breakAll?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4">
      <dt className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.11em] text-slate-500">
        <Icon className="h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
        {label}
      </dt>
      <dd
        className={[
          'mt-2 min-w-0 text-sm font-bold leading-5',
          muted ? 'text-slate-400' : 'text-slate-900',
          breakAll ? 'break-all' : '',
        ].join(' ')}
      >
        {value}
      </dd>
    </div>
  );
}

function SecurityFeature({
  icon: Icon,
  title,
  description,
  iconClassName,
}: {
  icon: typeof ShieldCheck;
  title: string;
  description: string;
  iconClassName: string;
}) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3.5">
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconClassName}`} aria-hidden="true" />
      <div>
        <p className="text-sm font-bold">{title}</p>
        <p className="mt-1 text-xs leading-5 text-slate-400">{description}</p>
      </div>
    </div>
  );
}

function AccountShortcut({
  href,
  icon: Icon,
  title,
  description,
  className = '',
}: {
  href: string;
  icon: typeof LayoutDashboard;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={[
        'group flex min-h-24 min-w-0 items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 transition hover:border-blue-200 hover:bg-blue-50/60',
        className,
      ].join(' ')}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm transition-colors group-hover:text-blue-700">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-black text-slate-950 transition-colors group-hover:text-blue-800">
          {title}
        </span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">{description}</span>
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-700" aria-hidden="true" />
    </Link>
  );
}
