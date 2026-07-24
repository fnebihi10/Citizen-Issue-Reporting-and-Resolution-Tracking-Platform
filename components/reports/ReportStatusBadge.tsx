import { Badge } from '@/components/ui/badge';
import type { ReportStatus } from '@/types/database';

const statusLabels: Record<ReportStatus, string> = {
  submitted: 'Dorëzuar',
  under_review: 'Në verifikim',
  assigned: 'Caktuar',
  in_progress: 'Në proces',
  resolved: 'Zgjidhur',
  rejected: 'Refuzuar',
  reopened: 'Rihapur',
};

const statusStyles: Record<ReportStatus, string> = {
  submitted: 'border-slate-200 bg-slate-100 text-slate-700',
  under_review: 'border-amber-200 bg-amber-50 text-amber-800',
  assigned: 'border-violet-200 bg-violet-50 text-violet-800',
  in_progress: 'border-blue-200 bg-blue-50 text-blue-800',
  resolved: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  rejected: 'border-rose-200 bg-rose-50 text-rose-800',
  reopened: 'border-orange-200 bg-orange-50 text-orange-800',
};

export function ReportStatusBadge({ status }: { status: ReportStatus }) {
  return <Badge className={statusStyles[status]}>{statusLabels[status]}</Badge>;
}

export function reportStatusLabel(status: ReportStatus) {
  return statusLabels[status];
}
