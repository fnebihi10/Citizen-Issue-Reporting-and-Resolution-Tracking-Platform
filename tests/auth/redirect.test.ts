import { describe, expect, it } from 'vitest';
import {
  defaultAuthenticatedPath,
  getRoleHomePath,
  getSafeInternalPath,
} from '@/lib/auth/redirect';

describe('getSafeInternalPath', () => {
  it('uses the account fallback when no path is provided', () => {
    expect(getSafeInternalPath(null)).toBe(defaultAuthenticatedPath);
  });

  it('keeps a local path and query while dropping the fragment', () => {
    expect(getSafeInternalPath('/citizen/reports?status=submitted#private'))
      .toBe('/citizen/reports?status=submitted');
  });

  it.each([
    'https://attacker.example/path',
    '//attacker.example/path',
    '/\\attacker.example',
    '/%2f%2fattacker.example',
    '/%5c%5cattacker.example',
  ])('rejects unsafe redirect target %s', (target) => {
    expect(getSafeInternalPath(target)).toBe(defaultAuthenticatedPath);
  });

  it('supports an explicit safe fallback', () => {
    expect(getSafeInternalPath('invalid', '/login')).toBe('/login');
  });

  it('maps authenticated roles to their workspace home', () => {
    expect(getRoleHomePath('citizen')).toBe('/citizen');
    expect(getRoleHomePath('official')).toBe('/official');
    expect(getRoleHomePath('admin')).toBe('/admin');
    expect(getRoleHomePath(undefined)).toBe(defaultAuthenticatedPath);
  });
});
