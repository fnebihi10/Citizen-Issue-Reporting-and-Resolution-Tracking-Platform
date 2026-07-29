import type {
  CitizenReportListItem,
  ReportPriority,
  ReportStatus,
} from '@/types/database';

export type AdminExportRow = {
  report_number: number;
  title: string;
  category: string;
  department: string;
  status: ReportStatus;
  priority: ReportPriority;
  sla_due_at: string;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  is_public: boolean;
};

export function toAdminExportRow(
  report: CitizenReportListItem,
  categoryNames: ReadonlyMap<string, string>,
  departmentNames: ReadonlyMap<string, string>,
): AdminExportRow {
  return {
    report_number: report.report_number,
    title: report.title,
    category: categoryNames.get(report.category_id) ?? 'Pa kategori',
    department: report.department_id
      ? departmentNames.get(report.department_id) ?? 'Departament i panjohur'
      : 'Pa departament',
    status: report.status,
    priority: report.priority,
    sla_due_at: report.sla_due_at,
    created_at: report.created_at,
    updated_at: report.updated_at,
    resolved_at: report.resolved_at,
    is_public: report.is_public,
  };
}

function csvCell(value: string | number | boolean | null) {
  const raw = value === null ? '' : String(value);
  const normalized = /^[=+\-@\t\r]/.test(raw) ? `'${raw}` : raw;
  return `"${normalized.replaceAll('"', '""')}"`;
}

export function adminRowsToCsv(rows: readonly AdminExportRow[]) {
  const headers: Array<keyof AdminExportRow> = [
    'report_number',
    'title',
    'category',
    'department',
    'status',
    'priority',
    'sla_due_at',
    'created_at',
    'updated_at',
    'resolved_at',
    'is_public',
  ];
  return [
    headers.map(csvCell).join(','),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(',')),
  ].join('\r\n');
}
