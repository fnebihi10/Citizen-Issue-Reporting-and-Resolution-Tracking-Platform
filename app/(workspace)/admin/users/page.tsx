import { Filter, Search, ShieldCheck, Users } from 'lucide-react';
import { WorkspaceHeader } from '@/components/layout/WorkspaceHeader';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { Badge } from '@/components/ui/badge';
import { buttonVariantsClass } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FlashMessage } from '@/components/ui/FlashMessage';
import { updateUserAccess } from '@/app/(workspace)/admin/actions';
import { requireAdmin } from '@/lib/admin/server';
import { formatDate } from '@/lib/utils';
import type { UserRole } from '@/types/database';

export const dynamic = 'force-dynamic';

const roleLabels: Record<UserRole, string> = {
  citizen: 'Qytetar',
  official: 'Zyrtar',
  admin: 'Administrator',
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
    role?: string | string[];
    success?: string | string[];
    error?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const { supabase, user, unreadCount, sessionStartedAt } =
    await requireAdmin('/admin/users');
  const search = (firstValue(params.q) ?? '')
    .replace(/[^\p{L}\p{N}@._ -]/gu, '')
    .trim()
    .slice(0, 80);
  const requestedRole = firstValue(params.role);
  const role = (['citizen', 'official', 'admin'] as string[]).includes(
    requestedRole ?? '',
  )
    ? (requestedRole as UserRole)
    : null;

  let profilesQuery = supabase
    .from('profiles')
    .select('id, full_name, email, role, department_id, created_at, updated_at')
    .order('full_name')
    .limit(200);
  if (role) profilesQuery = profilesQuery.eq('role', role);
  if (search) {
    profilesQuery = profilesQuery.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%`,
    );
  }

  const [{ data: profiles, error: profilesError }, { data: departments }] =
    await Promise.all([
      profilesQuery,
      supabase
        .from('departments')
        .select('id, name, is_active')
        .order('is_active', { ascending: false })
        .order('name'),
    ]);
  const departmentNames = new Map(
    (departments ?? []).map((department) => [department.id, department.name]),
  );

  return (
    <div className="min-h-screen">
      <WorkspaceHeader
        role="admin"
        unreadCount={unreadCount}
        sessionStartedAt={sessionStartedAt}
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <FlashMessage
          success={firstValue(params.success)}
          error={firstValue(params.error)}
        />
        <AdminPageHeader
          eyebrow="Qasja dhe përgjegjësitë"
          title="Përdoruesit"
          description="Cakto rolet dhe departamentet pa ndryshuar identitetin ose të dhënat e autentikimit të përdoruesit."
        />

        <form
          method="get"
          className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_12rem_auto]"
        >
          <label className="relative">
            <span className="sr-only">Kërko përdorues</span>
            <Search className="pointer-events-none absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" aria-hidden="true" />
            <input
              name="q"
              defaultValue={search}
              maxLength={80}
              placeholder="Kërko emrin ose email-in..."
              className="field-input h-11 pl-10"
            />
          </label>
          <label>
            <span className="sr-only">Filtro rolin</span>
            <select
              name="role"
              defaultValue={role ?? ''}
              className="field-input h-11"
            >
              <option value="">Të gjitha rolet</option>
              <option value="citizen">Qytetar</option>
              <option value="official">Zyrtar</option>
              <option value="admin">Administrator</option>
            </select>
          </label>
          <button type="submit" className={buttonVariantsClass({ variant: 'secondary' })}>
            <Filter className="h-4 w-4" aria-hidden="true" />
            Filtro
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-sm font-bold text-slate-700">
            {profiles?.length ?? 0} përdorues në këtë pamje
          </p>
          <p className="hidden text-xs text-slate-500 sm:block">
            Çdo ndryshim ruhet në audit log.
          </p>
        </div>

        {profilesError ? (
          <div
            role="alert"
            className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900"
          >
            Lista e përdoruesve nuk mund të ngarkohet.
          </div>
        ) : profiles?.length ? (
          <div className="mt-4 grid gap-4">
            {profiles.map((profile) => {
              const isCurrentAdmin = profile.id === user.id;
              return (
                <Card key={profile.id} className="min-w-0 p-5 shadow-sm">
                  <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(14rem,1fr)_minmax(0,1.4fr)] xl:items-center">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate font-black text-slate-950">
                          {profile.full_name}
                        </h2>
                        <Badge
                          className={
                            profile.role === 'admin'
                              ? 'border-violet-200 bg-violet-50 text-violet-800'
                              : profile.role === 'official'
                                ? 'border-blue-200 bg-blue-50 text-blue-800'
                                : ''
                          }
                        >
                          {profile.role === 'admin' ? (
                            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                          ) : null}
                          {roleLabels[profile.role]}
                        </Badge>
                        {isCurrentAdmin ? (
                          <Badge className="border-emerald-200 bg-emerald-50 text-emerald-800">
                            Llogaria jote
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 break-all text-sm text-slate-600">
                        {profile.email}
                      </p>
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {profile.department_id
                          ? departmentNames.get(profile.department_id)
                            ?? 'Departament i panjohur'
                          : 'Pa departament'}{' '}
                        · Regjistruar {formatDate(profile.created_at)}
                      </p>
                    </div>

                    {isCurrentAdmin ? (
                      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-4 text-sm leading-6 text-emerald-900">
                        Roli i administratorit aktual mbrohet nga vetë-ulja.
                        Një administrator tjetër mund të menaxhojë këtë llogari.
                      </div>
                    ) : (
                      <form
                        action={updateUserAccess}
                        className="grid min-w-0 gap-3 sm:grid-cols-[10rem_minmax(0,1fr)_auto]"
                      >
                        <input type="hidden" name="userId" value={profile.id} />
                        <label>
                          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                            Roli
                          </span>
                          <select
                            name="role"
                            defaultValue={profile.role}
                            className="field-input h-11"
                            aria-label={`Roli për ${profile.full_name}`}
                          >
                            <option value="citizen">Qytetar</option>
                            <option value="official">Zyrtar</option>
                            <option value="admin">Administrator</option>
                          </select>
                        </label>
                        <label>
                          <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                            Departamenti i zyrtarit
                          </span>
                          <select
                            name="departmentId"
                            defaultValue={profile.department_id ?? ''}
                            className="field-input h-11"
                            aria-label={`Departamenti për ${profile.full_name}`}
                          >
                            <option value="">Pa departament</option>
                            {(departments ?? []).map((department) => (
                              <option
                                key={department.id}
                                value={department.id}
                                disabled={!department.is_active}
                              >
                                {department.name}
                                {department.is_active ? '' : ' (joaktiv)'}
                              </option>
                            ))}
                          </select>
                        </label>
                        <button
                          type="submit"
                          className={buttonVariantsClass({
                            className: 'self-end',
                          })}
                        >
                          Ruaj
                        </button>
                      </form>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="mt-4 border-dashed p-8 text-center shadow-none">
            <Users className="mx-auto h-7 w-7 text-slate-400" aria-hidden="true" />
            <h2 className="mt-3 font-black text-slate-950">
              Nuk u gjet asnjë përdorues
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Ndrysho kërkimin ose filtrin e rolit.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
