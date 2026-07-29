import { NextRequest, NextResponse } from 'next/server';
import {
  adminRowsToCsv,
  toAdminExportRow,
} from '@/lib/admin/export';
import { isUuid } from '@/lib/admin/validation';
import { requireWorkspaceRequestContext } from '@/lib/auth/serverContext';
import { createClient } from '@/lib/supabase/server';
import type {
  CitizenReportListItem,
  ReportStatus,
} from '@/types/database';

export const dynamic = 'force-dynamic';

const reportColumns =
  'id, report_number, title, description, category_id, department_id, assigned_official_id, citizen_id, status, priority, address_text, sla_due_at, is_public, public_title, public_summary, resolution_notes, rejected_reason, resolved_at, created_at, updated_at';

const statuses: readonly ReportStatus[] = [
  'submitted',
  'under_review',
  'assigned',
  'in_progress',
  'resolved',
  'rejected',
  'reopened',
];

export async function GET(request: NextRequest) {
  const context = await requireWorkspaceRequestContext('/admin/exports');
  const supabase = await createClient();
  if (context.role !== 'admin') {
    return new NextResponse('Nuk ke qasje në këtë eksport.', { status: 403 });
  }

  const format = request.nextUrl.searchParams.get('format') === 'json'
    ? 'json'
    : 'csv';
  const requestedStatus = request.nextUrl.searchParams.get('status') ?? '';
  const status = statuses.includes(requestedStatus as ReportStatus)
    ? (requestedStatus as ReportStatus)
    : null;
  const requestedDepartment =
    request.nextUrl.searchParams.get('department') ?? '';
  const department = isUuid(requestedDepartment) ? requestedDepartment : null;

  const reports: CitizenReportListItem[] = [];
  const pageSize = 1000;
  const maximumRows = 100000;

  let countQuery = supabase
    .from('reports')
    .select('id', { count: 'exact', head: true });
  if (status) countQuery = countQuery.eq('status', status);
  if (department) countQuery = countQuery.eq('department_id', department);
  const { count, error: countError } = await countQuery;
  if (countError) {
    console.error('Admin export count failed', countError);
    return new NextResponse('Eksporti nuk mund të përgatitet.', {
      status: 500,
    });
  }
  const totalRows = count ?? 0;
  if (totalRows > maximumRows) {
    return new NextResponse(
      'Eksporti kalon 100 000 rreshta. Përdor filtrat për ta ndarë.',
      { status: 413 },
    );
  }

  for (let offset = 0; offset < totalRows; offset += pageSize) {
    let query = supabase
      .from('reports')
      .select(reportColumns)
      .order('report_number', { ascending: true })
      .range(offset, offset + pageSize - 1);
    if (status) query = query.eq('status', status);
    if (department) query = query.eq('department_id', department);

    const { data, error } = await query;
    if (error) {
      console.error('Admin export query failed', error);
      return new NextResponse('Eksporti nuk mund të përgatitet.', {
        status: 500,
      });
    }
    reports.push(...(data ?? []));
    if (!data || data.length < pageSize) break;
  }

  const [{ data: categories }, { data: departments }] = await Promise.all([
    supabase.from('categories').select('id, name'),
    supabase.from('departments').select('id, name'),
  ]);
  const categoryNames = new Map(
    (categories ?? []).map((category) => [category.id, category.name]),
  );
  const departmentNames = new Map(
    (departments ?? []).map((item) => [item.id, item.name]),
  );
  const rows = reports.map((report) =>
    toAdminExportRow(report, categoryNames, departmentNames),
  );

  const { error: auditError } = await supabase.rpc('record_admin_export', {
    p_format: format,
    p_filters: {
      status: status ?? 'all',
      department_id: department ?? 'all',
    },
    p_row_count: rows.length,
  });
  if (auditError) {
    console.error('Admin export audit failed', auditError);
    return new NextResponse(
      'Eksporti u ndal sepse regjistrimi i auditimit dështoi.',
      { status: 500 },
    );
  }

  const date = new Date().toISOString().slice(0, 10);
  const body =
    format === 'json'
      ? JSON.stringify(rows, null, 2)
      : `\uFEFF${adminRowsToCsv(rows)}`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Cache-Control': 'private, no-store, max-age=0',
      'Content-Disposition': `attachment; filename="raportimet-${date}.${format}"`,
      'Content-Type':
        format === 'json'
          ? 'application/json; charset=utf-8'
          : 'text/csv; charset=utf-8',
    },
  });
}
