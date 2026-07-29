import { LockKeyhole, MessageSquareText } from 'lucide-react';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { formatDate } from '@/lib/utils';
import type { ReportComment } from '@/types/database';

type CommentAction = (formData: FormData) => void | Promise<void>;

export function ReportConversation({
  reportId,
  citizenId,
  comments,
  action,
  allowInternal = false,
}: {
  reportId: string;
  citizenId: string;
  comments: ReportComment[];
  action: CommentAction;
  allowInternal?: boolean;
}) {
  return (
    <div>
      <div className="space-y-3">
        {comments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
            Ende nuk ka komente në këtë raportim.
          </div>
        ) : (
          comments.map((comment) => {
            const isCitizen = comment.author_id === citizenId;
            return (
              <article
                key={comment.id}
                className={[
                  'rounded-2xl border p-4',
                  comment.is_internal
                    ? 'border-amber-200 bg-amber-50'
                    : 'border-slate-200 bg-white',
                ].join(' ')}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.1em] text-slate-600">
                    {comment.is_internal ? (
                      <LockKeyhole className="h-3.5 w-3.5 text-amber-700" aria-hidden="true" />
                    ) : (
                      <MessageSquareText className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                    )}
                    {comment.is_internal
                      ? 'Shënim i brendshëm'
                      : isCitizen
                        ? 'Qytetari'
                        : 'Zyrtari komunal'}
                  </p>
                  <time className="text-xs text-slate-500">
                    {formatDate(comment.created_at)}
                  </time>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {comment.body}
                </p>
              </article>
            );
          })
        )}
      </div>

      <form action={action} className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <input type="hidden" name="reportId" value={reportId} />
        <label htmlFor="report-comment" className="text-sm font-bold text-slate-900">
          Shto koment
        </label>
        <textarea
          id="report-comment"
          name="body"
          required
          minLength={1}
          maxLength={2000}
          rows={4}
          className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          placeholder="Shkruaj një përditësim të qartë..."
        />
        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {allowInternal ? (
            <label className="flex min-h-11 items-center gap-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                name="isInternal"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Vetëm për stafin
            </label>
          ) : (
            <p className="text-xs leading-5 text-slate-500">
              Komenti ndahet me ekipin përgjegjës.
            </p>
          )}
          <SubmitButton pendingLabel="Duke shtuar...">Shto komentin</SubmitButton>
        </div>
      </form>
    </div>
  );
}
