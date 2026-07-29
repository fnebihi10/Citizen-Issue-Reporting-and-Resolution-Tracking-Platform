import { describe, expect, it } from 'vitest';
import {
  getOfficialAssignedReports,
  getOfficialAttentionReports,
  summarizeOfficialWorkload,
} from '@/lib/workflow/officialDashboard';
import type {
  CitizenReportListItem,
  ReportPriority,
  ReportStatus,
} from '@/types/database';

const officialId = '00000000-0000-4000-8000-000000000001';

function report(
  status: ReportStatus,
  priority: ReportPriority = 'normal',
  overrides: Partial<CitizenReportListItem> = {},
): CitizenReportListItem {
  return {
    id: crypto.randomUUID(),
    report_number: 2001,
    title: 'Sinjalistikë e dëmtuar',
    description: 'Përshkrim sintetik për testim.',
    category_id: crypto.randomUUID(),
    department_id: null,
    assigned_official_id: null,
    citizen_id: crypto.randomUUID(),
    status,
    priority,
    address_text: null,
    sla_due_at: '2026-08-02T08:00:00.000Z',
    is_public: false,
    public_title: null,
    public_summary: null,
    resolution_notes: null,
    rejected_reason: null,
    resolved_at: null,
    created_at: '2026-07-29T08:00:00.000Z',
    updated_at: '2026-07-29T08:00:00.000Z',
    ...overrides,
  };
}

describe('official dashboard workload helpers', () => {
  const reports = [
    report('submitted', 'normal', { report_number: 2001 }),
    report('under_review', 'high', { report_number: 2002 }),
    report('assigned', 'normal', {
      report_number: 2003,
      assigned_official_id: officialId,
      sla_due_at: '2026-08-03T08:00:00.000Z',
    }),
    report('in_progress', 'urgent', {
      report_number: 2004,
      assigned_official_id: officialId,
      sla_due_at: '2026-08-01T08:00:00.000Z',
    }),
    report('reopened', 'normal', { report_number: 2005 }),
    report('resolved', 'urgent', { report_number: 2006 }),
  ];

  it('summarizes the authorized workload without counting terminal cases as active', () => {
    expect(summarizeOfficialWorkload(reports, officialId)).toEqual({
      total: 6,
      active: 5,
      awaitingReview: 3,
      assignedToMe: 2,
      inProgress: 1,
      highPriority: 2,
    });
  });

  it('prioritizes urgent and high-priority active reports for attention', () => {
    expect(
      getOfficialAttentionReports(reports, officialId).map(
        (item) => item.report_number,
      ),
    ).toEqual([2004, 2002, 2005, 2001]);
  });

  it('returns only the current official assignments ordered by deadline', () => {
    expect(
      getOfficialAssignedReports(reports, officialId).map(
        (item) => item.report_number,
      ),
    ).toEqual([2004, 2003]);
  });
});
