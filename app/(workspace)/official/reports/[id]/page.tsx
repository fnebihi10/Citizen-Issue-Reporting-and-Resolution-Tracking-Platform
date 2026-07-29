import Link from 'next/link';
import {
  ArrowLeft,
  CalendarClock,
  ImageIcon,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { notFound, redirect } from 'next/navigation';
import { addOfficialComment } from '@/app/(workspace)/workflow/actions';
import { WorkspaceHeader } from '@/components/layout/WorkspaceHeader';
import { OfficialWorkflowPanel } from '@/components/reports/OfficialWorkflowPanel';
import { ReportConversation } from '@/components/reports/ReportConversation';
import { ReportStatusBadge } from '@/components/reports/ReportStatusBadge';
import { ReportTimeline } from '@/components/reports/ReportTimeline';
import { Card } from '@/components/ui/card';
import { FlashMessage } from '@/components/ui/FlashMessage';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import type {
  CitizenReportListItem,
  ReportAttachment,
  ReportComment,
  ReportStatusHistory,
} from '@/types/database';

export const dynamic = 'force-dynamic';

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function OfficialReportDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    success?: string | string[];
    error?: string | string[];
  }>;
}) {
  const { id } = await params;
  const flash = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/official/reports/${id}`)}`);

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, department_id')
    .eq('id', user.id)
    .maybeSingle();
  if (!profile || (profile.role !== 'official' && profile.role !== 'admin')) {
    redirect('/account?error=forbidden');
  }

  const { data: reportRow, error: reportError } = await supabase
    .from('reports')
    .select(
      'id, report_number, title, description, category_id, department_id, assigned_official_id, citizen_id, status, priority, address_text, sla_due_at, is_public, public_title, public_summary, resolution_notes, rejected_reason, resolved_at, created_at, updated_at',
    )
    .eq('id', id)
    .maybeSingle();
  if (reportError || !reportRow) notFound();
  const report: CitizenReportListItem = reportRow;

  const [
    { data: category },
    { data: department },
    { data: departments },
    { data: staff },
    { data: commentRows },
    { data: historyRows },
    { data: attachmentRows },
    { count: unreadCount },
  ] = await Promise.all([
    supabase
      .from('categories')
      .select('name')
      .eq('id', report.category_id)
      .maybeSingle(),
    report.department_id
      ? supabase
          .from('departments')
          .select('name')
          .eq('id', report.department_id)
          .maybeSingle()
      : Promise.resolve({ data: null }),
    supabase
      .from('departments')
      .select('id, name')
      .eq('is_active', true)
      .order('name'),
    supabase
      .from('profiles')
      .select('id, full_name, role, department_id')
      .in('role', ['official', 'admin'])
      .order('full_name'),
    supabase
      .from('report_comments')
      .select('id, report_id, author_id, body, is_internal, created_at')
      .eq('report_id', report.id)
      .order('created_at', { ascending: true }),
    supabase
      .from('report_status_history')
      .select('id, report_id, previous_status, new_status, changed_by, note, created_at')
      .eq('report_id', report.id)
      .order('created_at', { ascending: true }),
    supabase
      .from('report_attachments')
      .select(
        'id, report_id, uploaded_by, bucket_id, object_path, kind, mime_type, size_bytes, is_internal, created_at',
      )
      .eq('report_id', report.id)
      .order('created_at', { ascending: true }),
    supabase
      .from('notifications')
      .select('id', { count: 'exact', head: true })
      .eq('recipient_id', user.id)
      .is('read_at', null),
  ]);

  const attachments: Array<ReportAttachment & { signedUrl: string | null }> =
    await Promise.all(
      ((attachmentRows ?? []) as ReportAttachment[]).map(async (attachment) => {
        const { data } = await supabase.storage
          .from(attachment.bucket_id)
          .createSignedUrl(attachment.object_path, 300);
        return { ...attachment, signedUrl: data?.signedUrl ?? null };
      }),
    );

  return (
    <div className="min-h-screen">
      <WorkspaceHeader role={profile.role} unreadCount={unreadCount ?? 0} />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Link
          href="/official/reports"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Kthehu te inbox-i
        </Link>

        <div className="mt-4">
          <FlashMessage
            success={firstValue(flash.success)}
            error={firstValue(flash.error)}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:items-start">
          <div className="space-y-6">
            <Card className="overflow-hidden shadow-sm">
              <div className="border-b border-slate-100 bg-slate-950 p-6 text-white sm:p-7">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-blue-300">
                    Raportimi #{report.report_number}
                  </span>
                  <ReportStatusBadge status={report.status} />
                </div>
                <h1 className="mt-4 text-2xl font-black tracking-tight sm:text-3xl">
                  {report.title}
                </h1>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
                  {report.description}
                </p>
              </div>
              <dl className="grid gap-px bg-slate-100 sm:grid-cols-2">
                <div className="bg-white p-5">
                  <dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                    Kategoria
                  </dt>
                  <dd className="mt-2 text-sm font-bold text-slate-800">
                    {category?.name ?? 'E panjohur'}
                  </dd>
                </div>
                <div className="bg-white p-5">
                  <dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                    Departamenti
                  </dt>
                  <dd className="mt-2 text-sm font-bold text-slate-800">
                    {department?.name ?? 'Pa caktuar'}
                  </dd>
                </div>
                <div className="bg-white p-5">
                  <dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                    Lokacioni privat
                  </dt>
                  <dd className="mt-2 flex items-start gap-2 text-sm font-bold text-slate-800">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                    {report.address_text || 'Pika e saktë ruhet në databazë'}
                  </dd>
                </div>
                <div className="bg-white p-5">
                  <dt className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">
                    Afati SLA
                  </dt>
                  <dd className="mt-2 flex items-center gap-2 text-sm font-bold text-slate-800">
                    <CalendarClock className="h-4 w-4 text-blue-600" aria-hidden="true" />
                    {formatDate(report.sla_due_at)}
                  </dd>
                </div>
              </dl>
              <div className="border-t border-slate-100 bg-white p-5 text-sm leading-6 text-slate-600">
                <p>
                  Krijuar më {formatDate(report.created_at)} · Përditësuar më{' '}
                  {formatDate(report.updated_at)}
                </p>
                <p className="mt-2 flex items-center gap-2 font-semibold">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                  {report.is_public
                    ? 'Publikuar vetëm me përmbajtje dhe lokacion të sanitizuar.'
                    : 'Raportimi mbetet privat.'}
                </p>
              </div>
            </Card>

            {report.resolution_notes || report.rejected_reason ? (
              <Card className="p-5 shadow-sm sm:p-6">
                <h2 className="text-lg font-black text-slate-950">
                  {report.resolution_notes ? 'Dokumentimi i zgjidhjes' : 'Arsyeja e refuzimit'}
                </h2>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                  {report.resolution_notes ?? report.rejected_reason}
                </p>
              </Card>
            ) : null}

            <Card className="p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-black text-slate-950">Biseda operative</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Komentet publike ndahen me qytetarin; shënimet e brendshme i sheh vetëm stafi.
              </p>
              <div className="mt-5">
                <ReportConversation
                  reportId={report.id}
                  citizenId={report.citizen_id}
                  comments={(commentRows ?? []) as ReportComment[]}
                  action={addOfficialComment}
                  allowInternal
                />
              </div>
            </Card>

            <Card className="p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-black text-slate-950">Provat</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {attachments.length === 0 ? (
                  <p className="text-sm text-slate-600">Nuk ka fotografi të regjistruara.</p>
                ) : (
                  attachments.map((attachment) => (
                    <a
                      key={attachment.id}
                      href={attachment.signedUrl ?? '#'}
                      target="_blank"
                      rel="noreferrer"
                      aria-disabled={!attachment.signedUrl}
                      className="flex min-h-14 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50"
                    >
                      <ImageIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
                      {attachment.kind === 'resolution' ? 'Provë e zgjidhjes' : 'Provë qytetare'}
                      {attachment.is_internal ? ' · interne' : ''}
                    </a>
                  ))
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-black text-slate-950">Veprimi i radhës</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Databaza lejon vetëm kalimin e ardhshëm sipas state machine-it.
              </p>
              <div className="mt-5">
                <OfficialWorkflowPanel
                  report={report}
                  actor={{
                    id: user.id,
                    role: profile.role,
                    departmentId: profile.department_id,
                  }}
                  departments={departments ?? []}
                  staff={staff ?? []}
                />
              </div>
            </Card>

            <Card className="p-5 shadow-sm sm:p-6">
              <h2 className="text-lg font-black text-slate-950">Historia e statusit</h2>
              <div className="mt-5">
                <ReportTimeline history={(historyRows ?? []) as ReportStatusHistory[]} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
