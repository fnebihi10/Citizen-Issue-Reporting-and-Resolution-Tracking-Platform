import { describe, expect, it } from 'vitest';
import { toPublicReport } from '@/lib/reports/publicReport';
import type { PublicReportRow } from '@/types/database';

const validRow = {
  id: '10000000-0000-4000-8000-000000000001',
  report_number: 1001,
  title: 'Raport sintetik publik',
  summary: 'Përmbledhje vetëm për transparencën publike.',
  category_slug: 'rruge-gropa',
  category_name: 'Rrugë dhe gropa',
  status: 'under_review',
  priority: 'normal',
  latitude: 42.66,
  longitude: 21.16,
  created_at: '2026-01-01T10:00:00.000Z',
  updated_at: '2026-01-01T11:00:00.000Z',
  resolved_at: null,
} satisfies PublicReportRow;

describe('toPublicReport', () => {
  it('normalizes a complete sanitized view row', () => {
    expect(toPublicReport(validRow)).toEqual(validRow);
  });

  it('drops rows with missing required public fields', () => {
    expect(toPublicReport({ ...validRow, title: null })).toBeNull();
    expect(toPublicReport({ ...validRow, latitude: null })).toBeNull();
  });

  it('drops non-finite coordinates before rendering the map', () => {
    expect(toPublicReport({ ...validRow, longitude: Number.NaN })).toBeNull();
  });
});
