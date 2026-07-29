import type { CitizenReportListItem, ReportStatus } from '@/types/database';

export const ACTIVE_REPORT_STATUSES: readonly ReportStatus[] = [
  'submitted',
  'under_review',
  'assigned',
  'in_progress',
  'reopened',
];

export type CitizenReportView = 'all' | 'active' | 'resolved' | 'rejected';

export interface CitizenReportSummary {
  total: number;
  active: number;
  resolved: number;
  rejected: number;
  reopened: number;
  published: number;
}

export function isActiveReport(status: ReportStatus) {
  return ACTIVE_REPORT_STATUSES.includes(status);
}

export function summarizeCitizenReports(
  reports: readonly CitizenReportListItem[],
): CitizenReportSummary {
  return reports.reduce<CitizenReportSummary>(
    (summary, report) => {
      summary.total += 1;
      if (isActiveReport(report.status)) summary.active += 1;
      if (report.status === 'resolved') summary.resolved += 1;
      if (report.status === 'rejected') summary.rejected += 1;
      if (report.status === 'reopened') summary.reopened += 1;
      if (report.is_public) summary.published += 1;
      return summary;
    },
    {
      total: 0,
      active: 0,
      resolved: 0,
      rejected: 0,
      reopened: 0,
      published: 0,
    },
  );
}

export function filterCitizenReports(
  reports: readonly CitizenReportListItem[],
  view: CitizenReportView,
  search: string,
) {
  const normalizedSearch = search.trim().toLocaleLowerCase('sq-AL');

  return reports.filter((report) => {
    const matchesView =
      view === 'all' ||
      (view === 'active' && isActiveReport(report.status)) ||
      report.status === view;

    if (!matchesView) return false;
    if (!normalizedSearch) return true;

    return (
      report.title.toLocaleLowerCase('sq-AL').includes(normalizedSearch) ||
      report.description.toLocaleLowerCase('sq-AL').includes(normalizedSearch) ||
      String(report.report_number).includes(normalizedSearch)
    );
  });
}

export function getNearestActiveReport(
  reports: readonly CitizenReportListItem[],
) {
  return reports
    .filter((report) => isActiveReport(report.status))
    .sort(
      (first, second) =>
        new Date(first.sla_due_at).getTime() - new Date(second.sla_due_at).getTime(),
    )[0];
}

export function getCitizenFirstName(fullName: string | null | undefined) {
  const normalized = fullName?.trim();
  return normalized ? normalized.split(/\s+/)[0] : 'qytetar';
}
