import type { UserRole } from '@/types/database';
import { isUuid } from '@/lib/workflow/validation';

export const managedRoles = ['citizen', 'official', 'admin'] as const;

export { isUuid };

export function validateUserAccess(input: {
  userId: string;
  role: string;
  departmentId?: string;
}) {
  if (!isUuid(input.userId)) return 'Përdoruesi nuk është i vlefshëm.';
  if (!managedRoles.includes(input.role as UserRole)) {
    return 'Roli i zgjedhur nuk është i vlefshëm.';
  }
  if (input.role === 'official' && !isUuid(input.departmentId ?? '')) {
    return 'Zyrtari duhet të ketë një departament aktiv.';
  }
  if (input.role !== 'official' && input.departmentId) {
    return 'Vetëm zyrtari mund të lidhet me një departament.';
  }
  return null;
}

export function validateDepartment(input: {
  id?: string;
  name: string;
  code: string;
  description: string;
}) {
  if (input.id && !isUuid(input.id)) return 'Departamenti nuk është i vlefshëm.';
  const name = input.name.trim();
  const code = input.code.trim().toUpperCase();
  if (name.length < 2 || name.length > 120) {
    return 'Emri i departamentit duhet të ketë 2–120 karaktere.';
  }
  if (!/^[A-Z0-9_-]{2,12}$/.test(code)) {
    return 'Kodi duhet të ketë 2–12 shkronja të mëdha, numra, _ ose -.';
  }
  if (input.description.trim().length > 500) {
    return 'Përshkrimi nuk mund të kalojë 500 karaktere.';
  }
  return null;
}

export function validateCategory(input: {
  id?: string;
  name: string;
  slug: string;
  departmentId: string;
  defaultSlaHours: number;
}) {
  if (input.id && !isUuid(input.id)) return 'Kategoria nuk është e vlefshme.';
  if (input.name.trim().length < 2 || input.name.trim().length > 80) {
    return 'Emri i kategorisë duhet të ketë 2–80 karaktere.';
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug.trim())) {
    return 'Slug-u përdor vetëm shkronja të vogla, numra dhe viza.';
  }
  if (!isUuid(input.departmentId)) {
    return 'Kategoria duhet të ketë një departament.';
  }
  if (
    !Number.isInteger(input.defaultSlaHours)
    || input.defaultSlaHours < 1
    || input.defaultSlaHours > 8760
  ) {
    return 'SLA duhet të jetë ndërmjet 1 dhe 8760 orë.';
  }
  return null;
}
