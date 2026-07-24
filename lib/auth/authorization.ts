import type { UserRole } from '@/types/database';

const citizenRoles = new Set<UserRole>(['citizen']);
const officialRoles = new Set<UserRole>(['official', 'admin']);
const adminRoles = new Set<UserRole>(['admin']);

function matchesPrefix(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function getAllowedRolesForPath(
  pathname: string,
): ReadonlySet<UserRole> | null {
  if (matchesPrefix(pathname, '/admin')) return adminRoles;
  if (matchesPrefix(pathname, '/official')) return officialRoles;
  if (matchesPrefix(pathname, '/citizen')) return citizenRoles;
  return null;
}

export function canRoleAccessPath(pathname: string, role: UserRole) {
  const allowedRoles = getAllowedRolesForPath(pathname);
  return allowedRoles === null || allowedRoles.has(role);
}
