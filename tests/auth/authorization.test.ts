import { describe, expect, it } from 'vitest';
import {
  canRoleAccessPath,
  getAllowedRolesForPath,
} from '@/lib/auth/authorization';

describe('role route authorization', () => {
  it.each([
    ['/citizen/report', 'citizen', true],
    ['/citizen/reports', 'official', false],
    ['/citizen', 'admin', false],
    ['/official/reports', 'official', true],
    ['/official/reports', 'admin', true],
    ['/official', 'citizen', false],
    ['/admin/users', 'admin', true],
    ['/admin/users', 'official', false],
    ['/account', 'citizen', true],
  ] as const)('%s with %s is %s', (pathname, role, expected) => {
    expect(canRoleAccessPath(pathname, role)).toBe(expected);
  });

  it('does not role-restrict a general authenticated route', () => {
    expect(getAllowedRolesForPath('/account')).toBeNull();
  });

  it('does not confuse similar public path names with protected prefixes', () => {
    expect(getAllowedRolesForPath('/administrator-guide')).toBeNull();
  });
});
