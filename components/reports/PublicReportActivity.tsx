import { CheckCircle2, MessageSquareText } from 'lucide-react';
import { reportStatusLabel } from '@/components/reports/ReportStatusBadge';
import { formatDate } from '@/lib/utils';
import type {
  PublicReportComment,
  PublicReportStatusHistory,
} from '@/types/database';

export function PublicReportTimeline({
  history,
}: {
  history: PublicReportStatusHistory[];
}) {
  if (history.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
        Ende nuk ka ndryshime publike të statusit për këtë raportim.
      </p>
    );
  }

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
            <p className="text-sm font-black text-slate-900">
              {reportStatusLabel(entry.new_status)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {formatDate(entry.created_at)}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function PublicReportConversation({
  comments,
}: {
  comments: PublicReportComment[];
}) {
  if (comments.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
        Ende nuk ka komente publike për këtë raportim.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <article
          key={comment.id}
          className="rounded-2xl border border-slate-200 bg-white p-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-600">
              <MessageSquareText
                className="h-3.5 w-3.5 text-blue-600"
                aria-hidden="true"
              />
              {comment.author_label}
            </p>
            <time className="text-xs text-slate-500">
              {formatDate(comment.created_at)}
            </time>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
            {comment.body}
          </p>
        </article>
      ))}
    </div>
  );
}
