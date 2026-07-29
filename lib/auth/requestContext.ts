import type { UserRole } from '@/types/database';

export const requestContextHeaders = {
  userId: 'x-raporto-user-id',
  role: 'x-raporto-user-role',
  departmentId: 'x-raporto-department-id',
  fullName: 'x-raporto-full-name',
  sessionStartedAt: 'x-raporto-session-started-at',
  unreadCount: 'x-raporto-unread-count',
} as const;

const roles: readonly UserRole[] = ['citizen', 'official', 'admin'];
const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type WorkspaceRequestContext = {
  userId: string;
  role: UserRole;
  departmentId: string | null;
  fullName: string;
  sessionStartedAt: string;
  unreadCount: number;
};

export function clearRequestContextHeaders(headers: Headers) {
  Object.values(requestContextHeaders).forEach((name) => headers.delete(name));
}

export function writeRequestContextHeaders(
  headers: Headers,
  context: WorkspaceRequestContext,
) {
  clearRequestContextHeaders(headers);
  headers.set(requestContextHeaders.userId, context.userId);
  headers.set(requestContextHeaders.role, context.role);
  headers.set(
    requestContextHeaders.departmentId,
    context.departmentId ?? '',
  );
  headers.set(
    requestContextHeaders.fullName,
    encodeURIComponent(context.fullName),
  );
  headers.set(
    requestContextHeaders.sessionStartedAt,
    context.sessionStartedAt,
  );
  headers.set(
    requestContextHeaders.unreadCount,
    String(context.unreadCount),
  );
}

export function parseRequestContextHeaders(
  headers: Pick<Headers, 'get'>,
): WorkspaceRequestContext | null {
  const userId = headers.get(requestContextHeaders.userId);
  const role = headers.get(requestContextHeaders.role) as UserRole | null;
  const departmentId =
    headers.get(requestContextHeaders.departmentId) || null;
  const encodedFullName = headers.get(requestContextHeaders.fullName);
  const sessionStartedAt = headers.get(
    requestContextHeaders.sessionStartedAt,
  );
  const unreadValue = headers.get(requestContextHeaders.unreadCount);
  const unreadCount = Number(unreadValue);

  if (
    !userId
    || !uuidPattern.test(userId)
    || !role
    || !roles.includes(role)
    || (departmentId !== null && !uuidPattern.test(departmentId))
    || !encodedFullName
    || !sessionStartedAt
    || !Number.isFinite(Date.parse(sessionStartedAt))
    || unreadValue === null
    || !Number.isInteger(unreadCount)
    || unreadCount < 0
  ) {
    return null;
  }

  try {
    return {
      userId,
      role,
      departmentId,
      fullName: decodeURIComponent(encodedFullName),
      sessionStartedAt,
      unreadCount,
    };
  } catch {
    return null;
  }
}
