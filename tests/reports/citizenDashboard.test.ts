import { describe, expect, it } from 'vitest';
import {
  filterCitizenReports,
  getCitizenFirstName,
  getNearestActiveReport,
  summarizeCitizenReports,
} from '@/lib/reports/citizenDashboard';
import type { CitizenReportListItem, ReportStatus } from '@/types/database';

function report(
  status: ReportStatus,
  overrides: Partial<CitizenReportListItem> = {},
): CitizenReportListItem {
  return {
    id: crypto.randomUUID(),
    report_number: 1001,
    title: 'Ndriçim i dëmtuar',
    description: 'Llamba pranë rrugës nuk punon.',
    category_id: crypto.randomUUID(),
    department_id: null,
    assigned_official_id: null,
    citizen_id: crypto.randomUUID(),
    status,
    priority: 'normal',
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

describe('citizen dashboard report helpers', () => {
  const reports = [
    report('submitted', { report_number: 1001, sla_due_at: '2026-08-04T08:00:00Z' }),
    report('in_progress', {
      report_number: 1002,
      title: 'Gropë në rrugë',
      is_public: true,
      sla_due_at: '2026-08-01T08:00:00Z',
    }),
    report('reopened', { report_number: 1003 }),
    report('resolved', { report_number: 1004, is_public: true }),
    report('rejected', { report_number: 1005 }),
  ];

  it('summarizes active and terminal reports without overlap mistakes', () => {
    expect(summarizeCitizenReports(reports)).toEqual({
      total: 5,
      active: 3,
      resolved: 1,
      rejected: 1,
      reopened: 1,
      published: 2,
    });
  });

  it('filters active reports and searches title or report number', () => {
    expect(filterCitizenReports(reports, 'active', '')).toHaveLength(3);
    expect(filterCitizenReports(reports, 'all', 'gropë')).toHaveLength(1);
    expect(filterCitizenReports(reports, 'all', '1004')[0]?.status).toBe('resolved');
  });

  it('finds the active report with the nearest initial deadline', () => {
    expect(getNearestActiveReport(reports)?.report_number).toBe(1002);
  });

  it('uses a stable greeting fallback', () => {
    expect(getCitizenFirstName('  Arta Krasniqi ')).toBe('Arta');
    expect(getCitizenFirstName('')).toBe('qytetar');
  });
});
