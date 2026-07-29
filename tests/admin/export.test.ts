import { describe, expect, it } from 'vitest';
import { adminRowsToCsv, toAdminExportRow } from '@/lib/admin/export';
import type { CitizenReportListItem } from '@/types/database';

const report: CitizenReportListItem = {
  id: '10000000-0000-4000-8000-000000000001',
  report_number: 17,
  title: 'Titull, me "thonjëza"',
  description: 'Përshkrim privat që nuk duhet eksportuar.',
  category_id: 'a1111111-1111-1111-1111-111111111111',
  department_id: '11111111-1111-1111-1111-111111111111',
  assigned_official_id: null,
  citizen_id: '00000000-0000-4000-8000-000000000001',
  status: 'submitted',
  priority: 'normal',
  address_text: 'Adresë private',
  sla_due_at: '2026-07-31T12:00:00.000Z',
  is_public: false,
  public_title: null,
  public_summary: null,
  resolution_notes: null,
  rejected_reason: null,
  resolved_at: null,
  created_at: '2026-07-29T12:00:00.000Z',
  updated_at: '2026-07-29T12:00:00.000Z',
};

describe('Sprint 7 privacy-safe exports', () => {
  it('maps only operational report fields', () => {
    const row = toAdminExportRow(
      report,
      new Map([[report.category_id, 'Rrugë']]),
      new Map([[report.department_id!, 'Infrastrukturë']]),
    );

    expect(row).not.toHaveProperty('citizen_id');
    expect(row).not.toHaveProperty('description');
    expect(row).not.toHaveProperty('address_text');
    expect(row.title).toBe(report.title);
  });

  it('escapes CSV cells safely', () => {
    const row = toAdminExportRow(report, new Map(), new Map());
    const csv = adminRowsToCsv([row]);
    expect(csv).toContain('"Titull, me ""thonjëza"""');
    expect(csv).not.toContain(report.description);
    expect(csv.split('\r\n')).toHaveLength(2);
  });

  it('neutralizes spreadsheet formulas in user-controlled text', () => {
    const row = toAdminExportRow(report, new Map(), new Map());
    const csv = adminRowsToCsv([{ ...row, title: '=2+2+2' }]);
    expect(csv).toContain("\"'=2+2+2\"");
  });
});
