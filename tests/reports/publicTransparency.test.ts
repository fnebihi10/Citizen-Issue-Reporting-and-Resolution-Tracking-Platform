import { describe, expect, it } from 'vitest';
import {
  aggregatePublicDensity,
  filterPublicReports,
  isPublicReportId,
  parsePublicReportFilters,
  summarizePublicReports,
  toPublicReportComment,
  toPublicReportStatusHistory,
} from '@/lib/reports/publicTransparency';
import type { PublicReport } from '@/types/database';

const reports: PublicReport[] = [
  {
    id: '10000000-0000-4000-8000-000000000001',
    report_number: 101,
    title: 'Gropë në rrugën publike',
    summary: 'Përmbledhje e sanitizuar për publikun.',
    category_slug: 'rruge-gropa',
    category_name: 'Rrugë dhe gropa',
    status: 'resolved',
    priority: 'normal',
    latitude: 42.6601,
    longitude: 21.1601,
    created_at: '2026-07-01T00:00:00.000Z',
    updated_at: '2026-07-04T00:00:00.000Z',
    resolved_at: '2026-07-04T00:00:00.000Z',
  },
  {
    id: '10000000-0000-4000-8000-000000000002',
    report_number: 102,
    title: 'Ndriçim i fikur',
    summary: 'Shtyllë pa ndriçim në zonën e përgjithësuar.',
    category_slug: 'ndricim-publik',
    category_name: 'Ndriçim publik',
    status: 'in_progress',
    priority: 'high',
    latitude: 42.6604,
    longitude: 21.1604,
    created_at: '2026-07-20T00:00:00.000Z',
    updated_at: '2026-07-21T00:00:00.000Z',
    resolved_at: null,
  },
];

describe('public transparency filters and analytics', () => {
  it('accepts allowlisted filters and normalizes unsafe input', () => {
    expect(
      parsePublicReportFilters({
        q: '  ndriçim\u0000 ',
        category: 'NDRICIM-PUBLIK%25',
        status: 'in_progress',
        period: '90',
      }),
    ).toEqual({
      query: 'ndriçim',
      category: 'ndricim-publik25',
      status: 'in_progress',
      period: '90',
    });
  });

  it('falls back safely for unsupported status and period values', () => {
    expect(
      parsePublicReportFilters({ status: 'private', period: 'forever' }),
    ).toMatchObject({ status: null, period: 'all' });
  });

  it('filters only against sanitized public fields', () => {
    const result = filterPublicReports(
      reports,
      {
        query: 'shtyllë',
        category: 'ndricim-publik',
        status: 'in_progress',
        period: '30',
      },
      Date.parse('2026-07-29T00:00:00.000Z'),
    );
    expect(result.map((report) => report.id)).toEqual([reports[1]?.id]);
  });

  it('calculates transparent totals and resolution duration', () => {
    expect(summarizePublicReports(reports)).toMatchObject({
      total: 2,
      active: 1,
      resolved: 1,
      rejected: 0,
      resolutionRate: 50,
      averageResolutionDays: 3,
    });
  });

  it('aggregates generalized locations into density cells', () => {
    const cells = aggregatePublicDensity(reports);
    expect(cells).toHaveLength(1);
    expect(cells[0]).toMatchObject({ count: 2, intensity: 1 });
  });
});

describe('public detail boundary normalization', () => {
  it('accepts only public author labels in comments', () => {
    const row = {
      id: '20000000-0000-4000-8000-000000000001',
      report_id: reports[0]!.id,
      body: 'Përditësim publik.',
      author_label: 'Zyrtar komunal',
      created_at: '2026-07-02T00:00:00.000Z',
    };
    expect(toPublicReportComment(row)).toEqual(row);
    expect(toPublicReportComment({ ...row, author_label: 'Admin Name' })).toBeNull();
  });

  it('drops incomplete history rows', () => {
    const row = {
      id: '30000000-0000-4000-8000-000000000001',
      report_id: reports[0]!.id,
      previous_status: 'in_progress' as const,
      new_status: 'resolved' as const,
      created_at: '2026-07-04T00:00:00.000Z',
    };
    expect(toPublicReportStatusHistory(row)).toEqual(row);
    expect(toPublicReportStatusHistory({ ...row, new_status: null })).toBeNull();
  });

  it('validates public detail identifiers before querying', () => {
    expect(isPublicReportId(reports[0]!.id)).toBe(true);
    expect(isPublicReportId('../private-report')).toBe(false);
  });
});
