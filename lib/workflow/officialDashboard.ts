import type {
  CitizenReportListItem,
  ReportPriority,
  ReportStatus,
} from '@/types/database';

export const OFFICIAL_ACTIVE_STATUSES: readonly ReportStatus[] = [
  'submitted',
  'under_review',
  'assigned',
  'in_progress',
  'reopened',
];

export interface OfficialWorkloadSummary {
  total: number;
  active: number;
  awaitingReview: number;
  assignedToMe: number;
  inProgress: number;
  highPriority: number;
}

export function isOfficialActiveReport(status: ReportStatus) {
  return OFFICIAL_ACTIVE_STATUSES.includes(status);
}

export function summarizeOfficialWorkload(
  reports: readonly CitizenReportListItem[],
  officialId: string,
): OfficialWorkloadSummary {
  return reports.reduce<OfficialWorkloadSummary>(
    (summary, report) => {
      const active = isOfficialActiveReport(report.status);
      summary.total += 1;
      if (active) summary.active += 1;
      if (
        report.status === 'submitted'
        || report.status === 'under_review'
        || report.status === 'reopened'
      ) {
        summary.awaitingReview += 1;
      }
      if (active && report.assigned_official_id === officialId) {
        summary.assignedToMe += 1;
      }
      if (report.status === 'in_progress') summary.inProgress += 1;
      if (
        active
        && (report.priority === 'high' || report.priority === 'urgent')
      ) {
        summary.highPriority += 1;
      }
      return summary;
    },
    {
      total: 0,
      active: 0,
      awaitingReview: 0,
      assignedToMe: 0,
      inProgress: 0,
      highPriority: 0,
    },
  );
}

const priorityRank: Record<ReportPriority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

const statusRank: Record<ReportStatus, number> = {
  reopened: 0,
  submitted: 1,
  under_review: 2,
  assigned: 3,
  in_progress: 4,
  resolved: 5,
  rejected: 6,
};

export function getOfficialAttentionReports(
  reports: readonly CitizenReportListItem[],
  officialId: string,
  limit = 4,
) {
  return reports
    .filter((report) => isOfficialActiveReport(report.status))
    .sort((first, second) => {
      const priorityDifference =
        priorityRank[first.priority] - priorityRank[second.priority];
      if (priorityDifference !== 0) return priorityDifference;

      const statusDifference =
        statusRank[first.status] - statusRank[second.status];
      if (statusDifference !== 0) return statusDifference;

      const firstOwned = first.assigned_official_id === officialId ? 0 : 1;
      const secondOwned = second.assigned_official_id === officialId ? 0 : 1;
      if (firstOwned !== secondOwned) return firstOwned - secondOwned;

      return (
        new Date(first.sla_due_at).getTime()
        - new Date(second.sla_due_at).getTime()
      );
    })
    .slice(0, limit);
}

export function getOfficialAssignedReports(
  reports: readonly CitizenReportListItem[],
  officialId: string,
  limit = 3,
) {
  return reports
    .filter(
      (report) =>
        isOfficialActiveReport(report.status)
        && report.assigned_official_id === officialId,
    )
    .sort(
      (first, second) =>
        new Date(first.sla_due_at).getTime()
        - new Date(second.sla_due_at).getTime(),
    )
    .slice(0, limit);
}
