import { describe, expect, it } from 'vitest';
import {
  validateCategory,
  validateDepartment,
  validateUserAccess,
} from '@/lib/admin/validation';

const userId = '00000000-0000-4000-8000-000000000001';
const departmentId = '11111111-1111-1111-1111-111111111111';

describe('Sprint 7 admin validation', () => {
  it('requires every official to have a valid department', () => {
    expect(validateUserAccess({ userId, role: 'official' })).toContain(
      'departament',
    );
    expect(
      validateUserAccess({ userId, role: 'official', departmentId }),
    ).toBeNull();
  });

  it('does not allow citizen or admin department assignments', () => {
    expect(
      validateUserAccess({ userId, role: 'citizen', departmentId }),
    ).toContain('Vetëm zyrtari');
  });

  it('validates department identity fields', () => {
    expect(
      validateDepartment({
        name: 'Shërbime Digjitale',
        code: 'DSD',
        description: '',
      }),
    ).toBeNull();
    expect(
      validateDepartment({
        name: 'S',
        code: 'lowercase',
        description: '',
      }),
    ).not.toBeNull();
  });

  it('validates category SLA boundaries and slug', () => {
    expect(
      validateCategory({
        name: 'Shërbime online',
        slug: 'sherbime-online',
        departmentId,
        defaultSlaHours: 48,
      }),
    ).toBeNull();
    expect(
      validateCategory({
        name: 'Shërbime online',
        slug: 'Jo Slug',
        departmentId,
        defaultSlaHours: 0,
      }),
    ).not.toBeNull();
  });
});
