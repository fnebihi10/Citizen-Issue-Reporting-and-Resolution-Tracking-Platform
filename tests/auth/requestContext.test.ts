import { describe, expect, it } from 'vitest';
import {
  clearRequestContextHeaders,
  parseRequestContextHeaders,
  requestContextHeaders,
  writeRequestContextHeaders,
} from '@/lib/auth/requestContext';

const context = {
  userId: '00000000-0000-4000-8000-000000000020',
  role: 'admin' as const,
  departmentId: null,
  fullName: 'Fatlind Nëbihi',
  sessionStartedAt: '2026-07-29T16:00:00.000Z',
  unreadCount: 3,
};

describe('trusted workspace request context', () => {
  it('round-trips a valid context through request headers', () => {
    const headers = new Headers();
    writeRequestContextHeaders(headers, context);
    expect(parseRequestContextHeaders(headers)).toEqual(context);
  });

  it('rejects incomplete or malformed context headers', () => {
    const headers = new Headers({
      [requestContextHeaders.userId]: 'not-a-uuid',
      [requestContextHeaders.role]: 'admin',
    });
    expect(parseRequestContextHeaders(headers)).toBeNull();
  });

  it('clears client-supplied context headers before proxy use', () => {
    const headers = new Headers();
    writeRequestContextHeaders(headers, context);
    clearRequestContextHeaders(headers);
    expect(parseRequestContextHeaders(headers)).toBeNull();
  });
});
