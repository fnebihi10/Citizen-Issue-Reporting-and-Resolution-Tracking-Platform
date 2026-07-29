import {
  Download,
  Filter,
  FolderCog,
  History,
  ShieldCheck,
  UserRoundCog,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { WorkspaceHeader } from '@/components/layout/WorkspaceHeader';
import { Badge } from '@/components/ui/badge';
import { buttonVariantsClass } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { requireAdmin } from '@/lib/admin/server';
import { formatDate } from '@/lib/utils';
import type { Json } from '@/types/supabase';

export const dynamic = 'force-dynamic';

const actionOptions = [
  ['profiles.updated', 'Qasje e përdoruesit'],
  ['departments.created', 'Departament i krijuar'],
  ['departments.updated', 'Departament i ndryshuar'],
  ['categories.created', 'Kategori e krijuar'],
  ['categories.updated', 'Kategori/SLA e ndryshuar'],
  ['reports.exported', 'Eksport raportimesh'],
] as const;

const actionLabels = new Map<string, string>(actionOptions);

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function detailSummary(details: Json) {
  if (!details || Array.isArray(details) || typeof details !== 'object') {
    return 'Pa hollësi shtesë';
  }
  const entries = Object.entries(details)
    .filter(([, value]) => typeof value !== 'object')
    .slice(0, 4);
  if (!entries.length) return 'Pa hollësi shtesë';
  return entries
    .map(([key, value]) => `${key.replaceAll('_', ' ')}: ${String(value)}`)
    .join(' · ');
}

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{
    action?: string | string[];
    entity?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const { supabase, unreadCount, sessionStartedAt } =
    await requireAdmin('/admin/audit');
  const requestedAction = firstValue(params.action) ?? '';
  const action = actionOptions.some(([value]) => value === requestedAction)
    ? requestedAction
    : '';
  const entity = (firstValue(params.entity) ?? '').trim().slice(0, 80);

  let auditQuery = supabase
    .from('audit_logs')
    .select('id, actor_id, action, entity_type, entity_id, details, created_at')
    .order('created_at', { ascending: false })
    .limit(100);
  if (action) auditQuery = auditQuery.eq('action', action);
  if (entity) auditQuery = auditQuery.eq('entity_type', entity);

  const [{ data: entries, error }, { data: profiles }] = await Promise.all([
    auditQuery,
    supabase.from('profiles').select('id, full_name, role').limit(500),
  ]);
  const profileNames = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile.full_name]),
  );

  return (
    <div className="min-h-screen">
      <WorkspaceHeader
        role="admin"
        unreadCount={unreadCount}
        sessionStartedAt={sessionStartedAt}
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <AdminPageHeader
          eyebrow="Gjurmueshmëria"
          title="Regjistri i auditimit"
          description="Shiko kush ndryshoi role, departamente, kategori ose SLA dhe kur u krijua një eksport operacional."
        />

        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-sm leading-6 text-blue-950">
          <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
          <p>
            Regjistri është vetëm për lexim nga administratori. Veprimet
            shkruhen nga databaza, jo nga formulari ose browser-i.
          </p>
        </div>

        <form
          method="get"
          className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
        >
          <label>
            <span className="sr-only">Filtro veprimin</span>
            <select name="action" defaultValue={action} className="field-input h-11">
              <option value="">Të gjitha veprimet</option>
              {actionOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Filtro llojin e entitetit</span>
            <select name="entity" defaultValue={entity} className="field-input h-11">
              <option value="">Të gjitha entitetet</option>
              <option value="profiles">Përdoruesit</option>
              <option value="departments">Departamentet</option>
              <option value="categories">Kategoritë</option>
              <option value="report_export">Eksportet</option>
              <option value="report">Raportimet</option>
            </select>
          </label>
          <button type="submit" className={buttonVariantsClass({ variant: 'secondary' })}>
            <Filter className="h-4 w-4" aria-hidden="true" />
            Filtro
          </button>
        </form>

        <section className="mt-5" aria-labelledby="audit-list-title">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-600">
                100 hyrjet më të fundit
              </p>
              <h2 id="audit-list-title" className="mt-1.5 text-2xl font-black text-slate-950">
                Aktiviteti administrativ
              </h2>
            </div>
            <Badge>{entries?.length ?? 0} hyrje</Badge>
          </div>

          {error ? (
            <div
              role="alert"
              className="rounded-2xl border border-rose-200 bg-rose-50 p-5 text-sm text-rose-900"
            >
              Regjistri nuk mund të ngarkohet.
            </div>
          ) : entries?.length ? (
            <Card className="overflow-hidden shadow-sm">
              <div className="divide-y divide-slate-100">
                {entries.map((entry) => {
                  const Icon = entry.action === 'reports.exported'
                    ? Download
                    : entry.entity_type === 'profiles'
                      ? UserRoundCog
                      : entry.entity_type === 'departments'
                        || entry.entity_type === 'categories'
                        ? FolderCog
                        : History;
                  return (
                    <article
                      key={entry.id}
                      className="flex min-w-0 items-start gap-4 p-4 sm:p-5"
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="font-black text-slate-950">
                            {actionLabels.get(entry.action) ?? entry.action}
                          </h3>
                          <time className="shrink-0 text-xs text-slate-500">
                            {formatDate(entry.created_at)}
                          </time>
                        </div>
                        <p className="mt-1 text-sm text-slate-600">
                          Aktori:{' '}
                          <strong className="font-bold text-slate-800">
                            {entry.actor_id
                              ? profileNames.get(entry.actor_id) ?? 'Përdorues i sistemit'
                              : 'Proces i sistemit'}
                          </strong>
                        </p>
                        <p className="mt-1 break-words text-xs leading-5 text-slate-500">
                          {detailSummary(entry.details)}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </Card>
          ) : (
            <Card className="border-dashed p-8 text-center shadow-none">
              <History className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
              <h3 className="mt-3 font-black text-slate-950">
                Nuk ka hyrje në këtë filtër
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Ndrysho filtrat ose kryej një veprim administrativ të audituar.
              </p>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
