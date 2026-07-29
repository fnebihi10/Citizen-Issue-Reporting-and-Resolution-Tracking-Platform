import { Download, FileJson2, FileSpreadsheet, ShieldCheck } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { WorkspaceHeader } from '@/components/layout/WorkspaceHeader';
import { buttonVariantsClass } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { requireAdmin } from '@/lib/admin/server';

export const dynamic = 'force-dynamic';

export default async function AdminExportsPage() {
  const { supabase, unreadCount, sessionStartedAt } =
    await requireAdmin('/admin/exports');
  const { data: departments } = await supabase
    .from('departments')
    .select('id, name')
    .order('name');

  return (
    <div className="min-h-screen">
      <WorkspaceHeader
        role="admin"
        unreadCount={unreadCount}
        sessionStartedAt={sessionStartedAt}
      />
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <AdminPageHeader
          eyebrow="Të dhëna operative"
          title="Eksporto raportimet"
          description="Krijo skedarë CSV ose JSON për analizë të brendshme. Eksporti respekton filtrat dhe përjashton identitetin e qytetarit dhe lokacionin privat."
        />

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
          <Card className="p-5 shadow-sm sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Download className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-black text-slate-950">
                  Përgatit skedarin
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Lëri filtrat bosh për të eksportuar të gjitha raportimet.
                </p>
              </div>
            </div>

            <form
              action="/admin/exports/download"
              method="get"
              className="mt-6 grid gap-4 sm:grid-cols-2"
            >
              <label>
                <span className="mb-1.5 block text-xs font-bold text-slate-700">
                  Formati
                </span>
                <select name="format" defaultValue="csv" className="field-input">
                  <option value="csv">CSV</option>
                  <option value="json">JSON</option>
                </select>
              </label>
              <label>
                <span className="mb-1.5 block text-xs font-bold text-slate-700">
                  Statusi
                </span>
                <select name="status" defaultValue="" className="field-input">
                  <option value="">Të gjitha statuset</option>
                  <option value="submitted">Dorëzuar</option>
                  <option value="under_review">Në verifikim</option>
                  <option value="assigned">Caktuar</option>
                  <option value="in_progress">Në proces</option>
                  <option value="resolved">Zgjidhur</option>
                  <option value="rejected">Refuzuar</option>
                  <option value="reopened">Rihapur</option>
                </select>
              </label>
              <label className="sm:col-span-2">
                <span className="mb-1.5 block text-xs font-bold text-slate-700">
                  Departamenti
                </span>
                <select name="department" defaultValue="" className="field-input">
                  <option value="">Të gjitha departamentet</option>
                  {(departments ?? []).map((department) => (
                    <option key={department.id} value={department.id}>
                      {department.name}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="submit"
                className={buttonVariantsClass({
                  size: 'lg',
                  className: 'sm:col-span-2',
                })}
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Shkarko eksportin
              </button>
            </form>
          </Card>

          <aside className="space-y-4">
            <Card className="p-5 shadow-sm sm:p-6">
              <h2 className="flex items-center gap-2 font-black text-slate-950">
                <ShieldCheck className="h-5 w-5 text-emerald-700" aria-hidden="true" />
                Kufiri i privatësisë
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Përfshihen numri, titulli, kategoria, departamenti, statusi,
                prioriteti dhe datat operative.
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Përjashtohen emri, email-i, telefoni, ID-ja e qytetarit,
                përshkrimi privat, adresa dhe koordinatat.
              </p>
            </Card>
            <div className="grid grid-cols-2 gap-3">
              <FormatCard icon={FileSpreadsheet} label="CSV" detail="Për tabela" />
              <FormatCard icon={FileJson2} label="JSON" detail="Për sisteme" />
            </div>
            <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-xs leading-5 text-blue-950">
              Çdo shkarkim regjistrohet në audit log me formatin, filtrat dhe
              numrin e rreshtave.
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function FormatCard({
  icon: Icon,
  label,
  detail,
}: {
  icon: typeof FileJson2;
  label: string;
  detail: string;
}) {
  return (
    <Card className="p-4 shadow-sm">
      <Icon className="h-5 w-5 text-blue-700" aria-hidden="true" />
      <p className="mt-2 font-black text-slate-950">{label}</p>
      <p className="mt-0.5 text-xs text-slate-500">{detail}</p>
    </Card>
  );
}
