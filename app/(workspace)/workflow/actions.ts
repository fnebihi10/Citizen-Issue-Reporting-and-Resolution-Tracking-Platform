'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getWorkspaceRequestContext } from '@/lib/auth/serverContext';
import {
  isUuid,
  reportPriorities,
  validateComment,
  validateReopenReason,
  validateStaffWorkflow,
} from '@/lib/workflow/validation';
import type {
  ReportPriority,
  ReportStatus,
  UserRole,
} from '@/types/database';

const reportStatuses: readonly ReportStatus[] = [
  'submitted',
  'under_review',
  'assigned',
  'in_progress',
  'resolved',
  'rejected',
  'reopened',
];

function stringField(formData: FormData, name: string) {
  const value = formData.get(name);
  return typeof value === 'string' ? value : '';
}

function outcomeUrl(
  pathname: string,
  kind: 'success' | 'error',
  message: string,
) {
  const params = new URLSearchParams({ [kind]: message });
  return `${pathname}?${params.toString()}`;
}

function friendlyWorkflowError(message?: string) {
  if (!message) return 'Veprimi nuk mund të përfundohej. Provo përsëri.';
  if (message.includes('REPORT_OUTSIDE_STAFF_SCOPE')) {
    return 'Ky raportim nuk është më brenda fushës sate të autorizuar.';
  }
  if (message.includes('INVALID_WORKFLOW_ACTION')) {
    return 'Statusi i raportimit ka ndryshuar. Rifresko faqen dhe provo përsëri.';
  }
  if (message.includes('ASSIGNEE_DEPARTMENT_MISMATCH')) {
    return 'Zyrtari i zgjedhur nuk i përket departamentit përgjegjës.';
  }
  if (message.includes('PUBLIC_REPORT_REQUIRES')) {
    return 'Publikimi kërkon titull dhe përmbledhje të sanitizuar.';
  }
  return 'Veprimi u refuzua nga kontrolli i workflow-it.';
}

async function authenticatedProfile() {
  const context = await getWorkspaceRequestContext();
  const supabase = await createClient();
  if (!context) return { supabase, user: null, profile: null };

  return {
    supabase,
    user: { id: context.userId },
    profile: {
      role: context.role,
      department_id: context.departmentId,
    },
  };
}

export async function transitionOfficialReport(formData: FormData) {
  const reportId = stringField(formData, 'reportId');
  const detailPath = isUuid(reportId)
    ? `/official/reports/${reportId}`
    : '/official/reports';

  const { supabase, user, profile } = await authenticatedProfile();
  if (!user) redirect('/login?next=/official/reports');
  if (!profile || !(['official', 'admin'] as UserRole[]).includes(profile.role)) {
    redirect(outcomeUrl('/account', 'error', 'Nuk ke qasje në workflow-in zyrtar.'));
  }

  const currentStatus = stringField(formData, 'currentStatus') as ReportStatus;
  const targetStatus = stringField(formData, 'targetStatus') as ReportStatus;
  const note = stringField(formData, 'note');
  const departmentId = stringField(formData, 'departmentId') || undefined;
  const assignedOfficialId =
    stringField(formData, 'assignedOfficialId') || undefined;
  const priority = stringField(formData, 'priority');
  const isPublic = formData.get('isPublic') === 'on';
  const publicTitle = stringField(formData, 'publicTitle');
  const publicSummary = stringField(formData, 'publicSummary');

  if (
    !isUuid(reportId)
    || !reportStatuses.includes(currentStatus)
    || !reportStatuses.includes(targetStatus)
  ) {
    redirect(outcomeUrl(detailPath, 'error', 'Kërkesa e workflow-it nuk është e vlefshme.'));
  }

  const validationError = validateStaffWorkflow({
    currentStatus,
    targetStatus,
    note,
    departmentId,
    assignedOfficialId,
    priority,
    isPublic,
    publicTitle,
    publicSummary,
  });
  if (validationError) {
    redirect(outcomeUrl(detailPath, 'error', validationError));
  }

  const { error } = await supabase.rpc('transition_report_workflow', {
    p_report_id: reportId,
    p_target_status: targetStatus,
    p_note: note.trim() || undefined,
    p_department_id: departmentId ?? undefined,
    p_assigned_official_id: assignedOfficialId ?? undefined,
    p_priority: reportPriorities.includes(priority as ReportPriority)
      ? (priority as ReportPriority)
      : undefined,
    p_is_public: targetStatus === 'assigned' ? isPublic : undefined,
    p_public_title: publicTitle.trim() || undefined,
    p_public_summary: publicSummary.trim() || undefined,
  });

  if (error) {
    console.error('Official workflow transition failed', error);
    redirect(outcomeUrl(detailPath, 'error', friendlyWorkflowError(error.message)));
  }

  revalidatePath('/official/reports');
  revalidatePath(detailPath);
  revalidatePath('/notifications');
  revalidateTag('public-transparency', 'max');
  redirect(outcomeUrl(detailPath, 'success', 'Workflow-i u përditësua me sukses.'));
}

async function addComment(
  formData: FormData,
  expectedArea: 'citizen' | 'official',
) {
  const reportId = stringField(formData, 'reportId');
  const detailPath = isUuid(reportId)
    ? `/${expectedArea}/reports/${reportId}`
    : `/${expectedArea}/reports`;
  const body = stringField(formData, 'body');
  const validationError = validateComment(body);

  if (!isUuid(reportId) || validationError) {
    redirect(
      outcomeUrl(
        detailPath,
        'error',
        validationError ?? 'Raportimi nuk është i vlefshëm.',
      ),
    );
  }

  const { supabase, user, profile } = await authenticatedProfile();
  if (!user) redirect(`/login?next=${encodeURIComponent(detailPath)}`);

  const allowed =
    expectedArea === 'citizen'
      ? profile?.role === 'citizen'
      : profile?.role === 'official' || profile?.role === 'admin';
  if (!allowed) {
    redirect(outcomeUrl('/account', 'error', 'Nuk ke qasje në këtë bisedë.'));
  }

  const isInternal =
    expectedArea === 'official' && formData.get('isInternal') === 'on';
  const { error } = await supabase.rpc('add_report_comment', {
    p_report_id: reportId,
    p_body: body.trim(),
    p_is_internal: isInternal,
  });

  if (error) {
    console.error('Report comment failed', error);
    redirect(
      outcomeUrl(
        detailPath,
        'error',
        'Komenti nuk mund të ruhej. Kontrollo qasjen dhe provo përsëri.',
      ),
    );
  }

  revalidatePath(detailPath);
  revalidatePath('/notifications');
  revalidateTag('public-transparency', 'max');
  redirect(outcomeUrl(detailPath, 'success', 'Komenti u shtua.'));
}

export async function addCitizenComment(formData: FormData) {
  return addComment(formData, 'citizen');
}

export async function addOfficialComment(formData: FormData) {
  return addComment(formData, 'official');
}

export async function reopenCitizenReport(formData: FormData) {
  const reportId = stringField(formData, 'reportId');
  const detailPath = isUuid(reportId)
    ? `/citizen/reports/${reportId}`
    : '/citizen/reports';
  const reason = stringField(formData, 'reason');
  const validationError = validateReopenReason(reason);

  if (!isUuid(reportId) || validationError) {
    redirect(
      outcomeUrl(
        detailPath,
        'error',
        validationError ?? 'Raportimi nuk është i vlefshëm.',
      ),
    );
  }

  const { supabase, user, profile } = await authenticatedProfile();
  if (!user) redirect(`/login?next=${encodeURIComponent(detailPath)}`);
  if (profile?.role !== 'citizen') {
    redirect(outcomeUrl('/account', 'error', 'Vetëm qytetari mund ta rihapë raportimin.'));
  }

  const { error } = await supabase.rpc('reopen_resolved_report', {
    p_report_id: reportId,
    p_reason: reason.trim(),
  });

  if (error) {
    console.error('Citizen report reopen failed', error);
    redirect(
      outcomeUrl(
        detailPath,
        'error',
        'Raportimi nuk mund të rihapej. Mund të jetë ndryshuar ndërkohë.',
      ),
    );
  }

  revalidatePath('/citizen/reports');
  revalidatePath(detailPath);
  revalidatePath('/notifications');
  revalidateTag('public-transparency', 'max');
  redirect(outcomeUrl(detailPath, 'success', 'Raportimi u rihap dhe ekipi u njoftua.'));
}

export async function markNotificationRead(formData: FormData) {
  const notificationId = stringField(formData, 'notificationId');
  const { supabase, user } = await authenticatedProfile();
  if (!user) redirect('/login?next=/notifications');

  if (isUuid(notificationId)) {
    await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', notificationId)
      .eq('recipient_id', user.id);
  }

  revalidatePath('/notifications');
  redirect('/notifications');
}

export async function markAllNotificationsRead() {
  const { supabase, user } = await authenticatedProfile();
  if (!user) redirect('/login?next=/notifications');

  await supabase
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('recipient_id', user.id)
    .is('read_at', null);

  revalidatePath('/notifications');
  redirect('/notifications');
}
