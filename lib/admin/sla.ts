import type { ReportStatus } from '@/types/database';

export const terminalReportStatuses: readonly ReportStatus[] = [
  'resolved',
  'rejected',
];

export function isActiveReport(status: ReportStatus) {
  return !terminalReportStatuses.includes(status);
}

export function getSlaState(
  status: ReportStatus,
  slaDueAt: string,
  now = new Date(),
) {
  if (!isActiveReport(status)) return 'closed' as const;
  const dueAt = new Date(slaDueAt);
  if (Number.isNaN(dueAt.getTime())) return 'unknown' as const;
  if (dueAt.getTime() < now.getTime()) return 'overdue' as const;
  if (dueAt.getTime() <= now.getTime() + 24 * 60 * 60 * 1000) {
    return 'due-soon' as const;
  }
  return 'on-track' as const;
}

export function hoursUntilDeadline(slaDueAt: string, now = new Date()) {
  const milliseconds = new Date(slaDueAt).getTime() - now.getTime();
  if (!Number.isFinite(milliseconds)) return null;
  return Math.round(milliseconds / (60 * 60 * 1000));
}
