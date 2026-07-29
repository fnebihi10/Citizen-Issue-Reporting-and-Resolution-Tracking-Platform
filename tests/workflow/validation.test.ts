import { describe, expect, it } from 'vitest';
import {
  canStaffTransition,
  validateComment,
  validateReopenReason,
  validateStaffWorkflow,
} from '@/lib/workflow/validation';

describe('Sprint 6 workflow validation', () => {
  it('allows only the documented staff state-machine transitions', () => {
    expect(canStaffTransition('submitted', 'under_review')).toBe(true);
    expect(canStaffTransition('under_review', 'assigned')).toBe(true);
    expect(canStaffTransition('under_review', 'rejected')).toBe(true);
    expect(canStaffTransition('assigned', 'in_progress')).toBe(true);
    expect(canStaffTransition('in_progress', 'resolved')).toBe(true);
    expect(canStaffTransition('submitted', 'resolved')).toBe(false);
    expect(canStaffTransition('resolved', 'under_review')).toBe(false);
  });

  it('requires complete assignment data', () => {
    expect(
      validateStaffWorkflow({
        currentStatus: 'under_review',
        targetStatus: 'assigned',
        note: '',
        priority: 'normal',
      }),
    ).toContain('departamentin');
  });

  it('requires sanitized public content before publication', () => {
    expect(
      validateStaffWorkflow({
        currentStatus: 'under_review',
        targetStatus: 'assigned',
        note: '',
        departmentId: '11111111-1111-1111-1111-111111111111',
        assignedOfficialId: '00000000-0000-4000-8000-000000000010',
        priority: 'high',
        isPublic: true,
        publicTitle: 'Bad',
        publicSummary: 'Too short',
      }),
    ).toContain('Titulli publik');
  });

  it('requires meaningful resolution and rejection notes', () => {
    expect(
      validateStaffWorkflow({
        currentStatus: 'in_progress',
        targetStatus: 'resolved',
        note: 'short',
      }),
    ).toContain('Shënimi i zgjidhjes');
    expect(
      validateStaffWorkflow({
        currentStatus: 'under_review',
        targetStatus: 'rejected',
        note: 'short',
      }),
    ).toContain('Arsyeja e refuzimit');
  });

  it('bounds comments and reopening reasons', () => {
    expect(validateComment('')).not.toBeNull();
    expect(validateComment('Një koment i vlefshëm.')).toBeNull();
    expect(validateReopenReason('shkurt')).not.toBeNull();
    expect(
      validateReopenReason('Problemi është shfaqur përsëri pas ndërhyrjes.'),
    ).toBeNull();
  });
});
