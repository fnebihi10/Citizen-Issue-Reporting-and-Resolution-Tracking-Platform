'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  validateCategory,
  validateDepartment,
  validateUserAccess,
} from '@/lib/admin/validation';
import { getWorkspaceRequestContext } from '@/lib/auth/serverContext';
import { createClient } from '@/lib/supabase/server';
import type { UserRole } from '@/types/database';

function stringField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

function outcomeUrl(path: string, kind: 'success' | 'error', message: string) {
  return `${path}?${new URLSearchParams({ [kind]: message }).toString()}`;
}

function friendlyAdminError(message?: string) {
  if (message?.includes('ADMIN_CANNOT_DEMOTE_SELF')) {
    return 'Nuk mund ta heqësh rolin administrativ nga llogaria jote.';
  }
  if (message?.includes('OFFICIAL_REQUIRES_ACTIVE_DEPARTMENT')) {
    return 'Zyrtari duhet të ketë një departament aktiv.';
  }
  if (message?.includes('DEPARTMENT_HAS_ACTIVE_OFFICIALS')) {
    return 'Departamenti ka zyrtarë aktivë. Ricaktoji para se ta çaktivizosh.';
  }
  if (message?.includes('DEPARTMENT_HAS_ACTIVE_CATEGORIES')) {
    return 'Departamenti ka kategori aktive. Çaktivizoji ose ricaktoji fillimisht.';
  }
  if (message?.includes('CATEGORY_REQUIRES_ACTIVE_DEPARTMENT')) {
    return 'Kategoria duhet të lidhet me një departament aktiv.';
  }
  if (message?.includes('duplicate key')) {
    return 'Emri, kodi ose slug-u ekziston tashmë.';
  }
  if (message?.includes('foreign key')) {
    return 'Zgjedhja lidhet me të dhëna që nuk ekzistojnë më.';
  }
  return 'Ndryshimi u refuzua. Kontrollo të dhënat dhe provo përsëri.';
}

async function authenticatedAdmin(nextPath: string) {
  const context = await getWorkspaceRequestContext();
  if (!context) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  if (context.role !== 'admin') redirect('/account?error=forbidden');

  const supabase = await createClient();

  return { supabase, user: { id: context.userId } };
}

export async function updateUserAccess(formData: FormData) {
  const path = '/admin/users';
  const userId = stringField(formData, 'userId');
  const role = stringField(formData, 'role');
  const departmentId = stringField(formData, 'departmentId');
  const validationError = validateUserAccess({
    userId,
    role,
    departmentId: departmentId || undefined,
  });
  if (validationError) redirect(outcomeUrl(path, 'error', validationError));

  const { supabase, user } = await authenticatedAdmin(path);
  if (user.id === userId && role !== 'admin') {
    redirect(
      outcomeUrl(
        path,
        'error',
        'Nuk mund ta heqësh rolin administrativ nga llogaria jote.',
      ),
    );
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      role: role as UserRole,
      department_id: role === 'official' ? departmentId : null,
    })
    .eq('id', userId);

  if (error) {
    console.error('Admin user access update failed', error);
    redirect(outcomeUrl(path, 'error', friendlyAdminError(error.message)));
  }

  revalidatePath('/admin');
  revalidatePath(path);
  revalidatePath('/admin/audit');
  redirect(outcomeUrl(path, 'success', 'Qasja e përdoruesit u përditësua.'));
}

export async function createDepartment(formData: FormData) {
  const path = '/admin/structure';
  const input = {
    name: stringField(formData, 'name'),
    code: stringField(formData, 'code').toUpperCase(),
    description: stringField(formData, 'description'),
  };
  const validationError = validateDepartment(input);
  if (validationError) redirect(outcomeUrl(path, 'error', validationError));

  const { supabase } = await authenticatedAdmin(path);
  const { error } = await supabase.from('departments').insert({
    ...input,
    description: input.description || null,
  });
  if (error) {
    console.error('Department creation failed', error);
    redirect(outcomeUrl(path, 'error', friendlyAdminError(error.message)));
  }

  revalidatePath('/admin');
  revalidatePath(path);
  revalidatePath('/admin/audit');
  redirect(outcomeUrl(path, 'success', 'Departamenti u krijua.'));
}

export async function updateDepartment(formData: FormData) {
  const path = '/admin/structure';
  const id = stringField(formData, 'id');
  const input = {
    id,
    name: stringField(formData, 'name'),
    code: stringField(formData, 'code').toUpperCase(),
    description: stringField(formData, 'description'),
  };
  const validationError = validateDepartment(input);
  if (validationError) redirect(outcomeUrl(path, 'error', validationError));

  const { supabase } = await authenticatedAdmin(path);
  const { error } = await supabase
    .from('departments')
    .update({
      name: input.name,
      code: input.code,
      description: input.description || null,
      is_active: formData.get('isActive') === 'on',
    })
    .eq('id', id);
  if (error) {
    console.error('Department update failed', error);
    redirect(outcomeUrl(path, 'error', friendlyAdminError(error.message)));
  }

  revalidatePath('/admin');
  revalidatePath(path);
  revalidatePath('/admin/audit');
  redirect(outcomeUrl(path, 'success', 'Departamenti u përditësua.'));
}

export async function createCategory(formData: FormData) {
  const path = '/admin/structure';
  const input = {
    name: stringField(formData, 'name'),
    slug: stringField(formData, 'slug').toLowerCase(),
    departmentId: stringField(formData, 'departmentId'),
    defaultSlaHours: Number(stringField(formData, 'defaultSlaHours')),
  };
  const validationError = validateCategory(input);
  if (validationError) redirect(outcomeUrl(path, 'error', validationError));

  const { supabase } = await authenticatedAdmin(path);
  const { error } = await supabase.from('categories').insert({
    name: input.name,
    slug: input.slug,
    department_id: input.departmentId,
    default_sla_hours: input.defaultSlaHours,
  });
  if (error) {
    console.error('Category creation failed', error);
    redirect(outcomeUrl(path, 'error', friendlyAdminError(error.message)));
  }

  revalidatePath('/admin');
  revalidatePath(path);
  revalidatePath('/admin/audit');
  redirect(outcomeUrl(path, 'success', 'Kategoria dhe SLA-ja u krijuan.'));
}

export async function updateCategory(formData: FormData) {
  const path = '/admin/structure';
  const id = stringField(formData, 'id');
  const input = {
    id,
    name: stringField(formData, 'name'),
    slug: stringField(formData, 'slug').toLowerCase(),
    departmentId: stringField(formData, 'departmentId'),
    defaultSlaHours: Number(stringField(formData, 'defaultSlaHours')),
  };
  const validationError = validateCategory(input);
  if (validationError) redirect(outcomeUrl(path, 'error', validationError));

  const { supabase } = await authenticatedAdmin(path);
  const { error } = await supabase
    .from('categories')
    .update({
      name: input.name,
      slug: input.slug,
      department_id: input.departmentId,
      default_sla_hours: input.defaultSlaHours,
      is_active: formData.get('isActive') === 'on',
    })
    .eq('id', id);
  if (error) {
    console.error('Category update failed', error);
    redirect(outcomeUrl(path, 'error', friendlyAdminError(error.message)));
  }

  revalidatePath('/admin');
  revalidatePath(path);
  revalidatePath('/admin/sla');
  revalidatePath('/admin/audit');
  redirect(outcomeUrl(path, 'success', 'Kategoria dhe SLA-ja u përditësuan.'));
}
