import { describe, expect, it } from 'vitest';
import {
  getSessionExpiryTime,
  getSessionRemainingMs,
  isSessionExpired,
  SESSION_MAX_AGE_MS,
} from '@/lib/auth/sessionExpiry';

const signedInAt = '2026-07-29T12:00:00.000Z';
const signedInAtMs = new Date(signedInAt).getTime();

describe('absolute session expiry policy', () => {
  it('expires a session exactly one hour after sign-in', () => {
    expect(getSessionExpiryTime(signedInAt)).toBe(
      signedInAtMs + SESSION_MAX_AGE_MS,
    );
    expect(
      isSessionExpired(signedInAt, signedInAtMs + SESSION_MAX_AGE_MS - 1),
    ).toBe(false);
    expect(
      isSessionExpired(signedInAt, signedInAtMs + SESSION_MAX_AGE_MS),
    ).toBe(true);
  });

  it('returns the remaining duration without going below zero', () => {
    expect(getSessionRemainingMs(signedInAt, signedInAtMs)).toBe(
      SESSION_MAX_AGE_MS,
    );
    expect(
      getSessionRemainingMs(signedInAt, signedInAtMs + SESSION_MAX_AGE_MS + 1),
    ).toBe(0);
  });

  it('fails closed when the verified sign-in timestamp is missing or invalid', () => {
    expect(isSessionExpired(null, signedInAtMs)).toBe(true);
    expect(isSessionExpired('not-a-date', signedInAtMs)).toBe(true);
  });
});
