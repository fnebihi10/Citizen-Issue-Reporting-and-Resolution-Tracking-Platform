import { describe, expect, it } from 'vitest';
import {
  getPasswordRequirements,
  getPasswordValidationError,
  minimumPasswordLength,
} from '@/lib/auth/password';

describe('password policy', () => {
  it('accepts a password that satisfies every documented requirement', () => {
    const password = 'StrongPass2026';

    expect(getPasswordValidationError(password)).toBeNull();
    expect(getPasswordRequirements(password).every((item) => item.met)).toBe(true);
  });

  it.each([
    'Short1A',
    'alllowercase2026',
    'ALLUPPERCASE2026',
    'NoDigitsHere',
  ])('rejects weak password %s', (password) => {
    expect(getPasswordValidationError(password)).toContain(
      `${minimumPasswordLength}`,
    );
  });
});
