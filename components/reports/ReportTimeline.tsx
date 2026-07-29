import { CheckCircle2 } from 'lucide-react';
import { reportStatusLabel } from '@/components/reports/ReportStatusBadge';
import { formatDate } from '@/lib/utils';
import type { ReportStatusHistory } from '@/types/database';

export function ReportTimeline({
  history,
}: {
  history: ReportStatusHistory[];
}) {
  return (
    <ol className="space-y-4">
      {history.map((entry, index) => (
        <li key={entry.id} className="relative flex gap-3">
          {index < history.length - 1 ? (
            <span
              className="absolute left-[17px] top-8 h-[calc(100%+0.5rem)] w-px bg-slate-200"
              aria-hidden="true"
            />
          ) : null}
          <span className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-blue-100 bg-blue-50 text-blue-700">
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <div className="min-w-0 pb-2">
            <p className="text-sm font-bold text-slate-900">
              {reportStatusLabel(entry.new_status)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {formatDate(entry.created_at)}
            </p>
            {entry.note ? (
              <p className="mt-2 whitespace-pre-wrap rounded-xl bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-700">
                {entry.note}
              </p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
