import { describe, expect, it } from 'vitest';
import { getSlaState, hoursUntilDeadline } from '@/lib/admin/sla';

const now = new Date('2026-07-29T12:00:00.000Z');

describe('Sprint 7 SLA helpers', () => {
  it('separates overdue, due-soon and on-track reports', () => {
    expect(getSlaState('in_progress', '2026-07-29T11:00:00.000Z', now)).toBe(
      'overdue',
    );
    expect(getSlaState('assigned', '2026-07-30T11:00:00.000Z', now)).toBe(
      'due-soon',
    );
    expect(getSlaState('submitted', '2026-08-01T12:00:00.000Z', now)).toBe(
      'on-track',
    );
  });

  it('does not classify closed reports as overdue', () => {
    expect(getSlaState('resolved', '2026-07-01T12:00:00.000Z', now)).toBe(
      'closed',
    );
  });

  it('returns rounded hours to the deadline', () => {
    expect(hoursUntilDeadline('2026-07-30T00:00:00.000Z', now)).toBe(12);
  });
});
