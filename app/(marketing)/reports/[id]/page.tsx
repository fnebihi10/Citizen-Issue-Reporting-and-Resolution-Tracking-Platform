import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Eye,
  MapPin,
  MessageSquareText,
  ShieldCheck,
} from 'lucide-react';
import { notFound } from 'next/navigation';
import { PublicIssueMapLoader } from '@/components/map/PublicIssueMapLoader';
import {
  PublicReportConversation,
  PublicReportTimeline,
} from '@/components/reports/PublicReportActivity';
import { ReportStatusBadge } from '@/components/reports/ReportStatusBadge';
import { buttonVariantsClass } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getPublicReportDetailData } from '@/lib/reports/publicData';
import { toPublicReport } from '@/lib/reports/publicReport';
import {
  isPublicReportId,
  toPublicReportComment,
  toPublicReportStatusHistory,
} from '@/lib/reports/publicTransparency';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Raportimi publik | Raporto Qytetin',
  description:
    'Detajet dhe historia e sanitizuar e një raportimi qytetar të publikuar.',
};

export default async function PublicReportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!isPublicReportId(id)) notFound();

  const {
    reportRow,
    reportError,
    commentRows,
    commentsError,
    historyRows,
    historyError,
  } = await getPublicReportDetailData(id);

  const report = reportRow ? toPublicReport(reportRow) : null;
  if (reportError || !report) notFound();

  const comments = (commentRows ?? [])
    .map(toPublicReportComment)
    .filter((comment) => comment !== null);
  const history = (historyRows ?? [])
    .map(toPublicReportStatusHistory)
    .filter((entry) => entry !== null);
  const activityError = Boolean(commentsError || historyError);

  return (
    <div className="bg-slate-50">
      <section className="bg-slate-950 text-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <Link
            href="/map"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-slate-300 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Kthehu te transparenca publike
          </Link>

          <div className="mt-5 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-300">
                <Eye className="h-4 w-4" aria-hidden="true" />
                Raportim publik #{report.report_number}
                <span className="text-slate-600">·</span>
                {report.category_name}
              </p>
              <h1 className="mt-4 max-w-3xl text-3xl font-black tracking-[-0.04em] sm:text-4xl">
                {report.title}
              </h1>
              <p className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  Publikuar më {formatDate(report.created_at)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock3 className="h-4 w-4" aria-hidden="true" />
                  Përditësuar më {formatDate(report.updated_at)}
                </span>
              </p>
            </div>
            <div className="shrink-0">
              <ReportStatusBadge status={report.status} />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(19rem,0.75fr)] lg:items-start">
          <div className="space-y-6">
            <Card className="overflow-hidden shadow-sm">
              <div className="border-b border-slate-100 p-5 sm:p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                  Përmbledhja publike
                </p>
                <h2 className="mt-2 text-xl font-black tracking-tight text-slate-950">
                  Çfarë është publikuar për këtë çështje
                </h2>
              </div>
              <div className="p-5 sm:p-6">
                <p className="whitespace-pre-wrap text-base leading-8 text-slate-700">
                  {report.summary
                    ?? 'Nuk është shtuar ende një përmbledhje publike.'}
                </p>
              </div>
            </Card>

            <Card className="p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                  <Clock3 className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-700">
                    Gjurmë e verifikueshme
                  </p>
                  <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                    Historia publike e statusit
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Shfaqen vetëm statuset dhe koha e ndryshimit. Autorët dhe
                    shënimet e brendshme nuk publikohen.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                {activityError ? (
                  <p
                    role="alert"
                    className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"
                  >
                    Një pjesë e historisë publike nuk mund të ngarkohet tani.
                  </p>
                ) : (
                  <PublicReportTimeline history={history} />
                )}
              </div>
            </Card>

            <Card className="p-5 shadow-sm sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <MessageSquareText
                    className="h-5 w-5"
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                    Komunikim i hapur
                  </p>
                  <h2 className="mt-1 text-xl font-black tracking-tight text-slate-950">
                    Komentet publike
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Biseda e brendshme e stafit dhe provat private nuk
                    përfshihen në këtë pamje.
                  </p>
                </div>
              </div>
              <div className="mt-6">
                {activityError ? (
                  <p className="text-sm text-slate-500">
                    Komentet publike nuk mund të ngarkohen tani.
                  </p>
                ) : (
                  <PublicReportConversation comments={comments} />
                )}
              </div>
            </Card>
          </div>

          <aside className="space-y-5">
            <PublicIssueMapLoader reports={[report]} compact />

            <Card className="overflow-hidden shadow-sm">
              <dl className="divide-y divide-slate-100">
                <PublicFact
                  label="Kategoria"
                  value={report.category_name}
                />
                <PublicFact
                  label="Statusi"
                  value={
                    report.status === 'resolved'
                      ? 'Zgjidhur'
                      : report.status === 'rejected'
                        ? 'Refuzuar'
                        : 'Në trajtim'
                  }
                />
                <PublicFact
                  label="Zgjidhur më"
                  value={
                    report.resolved_at
                      ? formatDate(report.resolved_at)
                      : 'Ende jo'
                  }
                />
              </dl>
            </Card>

            <Card className="border-emerald-200 bg-emerald-50 p-5 shadow-none">
              <div className="flex gap-3">
                <ShieldCheck
                  className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700"
                  aria-hidden="true"
                />
                <div>
                  <h2 className="font-black text-emerald-950">
                    Privatësia është pjesë e rezultatit
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-emerald-900">
                    Pika në hartë është e përgjithësuar. Emri, kontakti,
                    adresa e saktë, fotografia private dhe identiteti i
                    autorëve nuk janë pjesë e kësaj faqeje.
                  </p>
                </div>
              </div>
            </Card>

            <Link
              href="/map"
              className={buttonVariantsClass({
                variant: 'secondary',
                size: 'lg',
                className: 'w-full',
              })}
            >
              <MapPin className="h-4 w-4" aria-hidden="true" />
              Shiko raportimet e tjera
            </Link>
          </aside>
        </div>

        <section className="mt-8 rounded-2xl bg-slate-950 p-6 text-white sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-blue-300">
                Ke vërejtur një problem lokal?
              </p>
              <h2 className="mt-2 text-2xl font-black tracking-tight">
                Krijo një raportim të dokumentuar
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                Raportimet e reja mbeten private derisa stafi t’i verifikojë
                dhe t’i përgatisë për transparencë publike.
              </p>
            </div>
            <Link
              href="/citizen/report"
              className={buttonVariantsClass({
                size: 'lg',
                className:
                  'shrink-0 bg-white text-slate-950 hover:bg-blue-50',
              })}
            >
              Raporto problem
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function PublicFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5">
      <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-600">
        {label}
      </dt>
      <dd className="mt-2 text-sm font-black text-slate-900">{value}</dd>
    </div>
  );
}
