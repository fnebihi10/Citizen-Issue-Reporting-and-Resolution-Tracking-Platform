import type { ReportPriority, ReportStatus } from '@/types/database';

export const staffWorkflowTargets: Record<ReportStatus, readonly ReportStatus[]> = {
  submitted: ['under_review'],
  under_review: ['assigned', 'rejected'],
  assigned: ['in_progress'],
  in_progress: ['resolved'],
  resolved: [],
  rejected: [],
  reopened: ['under_review'],
};

export const reportPriorities: readonly ReportPriority[] = [
  'low',
  'normal',
  'high',
  'urgent',
];

export function canStaffTransition(
  currentStatus: ReportStatus,
  targetStatus: ReportStatus,
) {
  return staffWorkflowTargets[currentStatus].includes(targetStatus);
}

export function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

export function validateComment(body: string) {
  const cleanBody = body.trim();
  if (cleanBody.length < 1 || cleanBody.length > 2000) {
    return 'Komenti duhet të ketë nga 1 deri në 2000 karaktere.';
  }
  return null;
}

type WorkflowInput = {
  currentStatus: ReportStatus;
  targetStatus: ReportStatus;
  note: string;
  departmentId?: string;
  assignedOfficialId?: string;
  priority?: string;
  isPublic?: boolean;
  publicTitle?: string;
  publicSummary?: string;
};

export function validateStaffWorkflow(input: WorkflowInput) {
  if (!canStaffTransition(input.currentStatus, input.targetStatus)) {
    return 'Ky ndryshim statusi nuk lejohet nga workflow-i.';
  }

  if (input.targetStatus === 'assigned') {
    if (
      !input.departmentId
      || !isUuid(input.departmentId)
      || !input.assignedOfficialId
      || !isUuid(input.assignedOfficialId)
    ) {
      return 'Zgjidh departamentin dhe zyrtarin përgjegjës.';
    }

    if (!input.priority || !reportPriorities.includes(input.priority as ReportPriority)) {
      return 'Zgjidh një prioritet të vlefshëm.';
    }

    if (input.isPublic) {
      const publicTitle = input.publicTitle?.trim() ?? '';
      const publicSummary = input.publicSummary?.trim() ?? '';
      if (publicTitle.length < 5 || publicTitle.length > 160) {
        return 'Titulli publik duhet të ketë nga 5 deri në 160 karaktere.';
      }
      if (publicSummary.length < 10 || publicSummary.length > 1000) {
        return 'Përmbledhja publike duhet të ketë nga 10 deri në 1000 karaktere.';
      }
    }
  }

  if (
    (input.targetStatus === 'resolved' || input.targetStatus === 'rejected')
    && (input.note.trim().length < 10 || input.note.trim().length > 2000)
  ) {
    return input.targetStatus === 'resolved'
      ? 'Shënimi i zgjidhjes duhet të ketë nga 10 deri në 2000 karaktere.'
      : 'Arsyeja e refuzimit duhet të ketë nga 10 deri në 2000 karaktere.';
  }

  if (input.note.trim().length > 2000) {
    return 'Shënimi nuk mund të ketë më shumë se 2000 karaktere.';
  }

  return null;
}

export function validateReopenReason(reason: string) {
  const cleanReason = reason.trim();
  if (cleanReason.length < 10 || cleanReason.length > 1000) {
    return 'Arsyeja e rihapjes duhet të ketë nga 10 deri në 1000 karaktere.';
  }
  return null;
}
