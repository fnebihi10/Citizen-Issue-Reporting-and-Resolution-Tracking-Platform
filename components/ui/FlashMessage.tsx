import { AlertTriangle, CheckCircle2 } from 'lucide-react';

export function FlashMessage({
  success,
  error,
}: {
  success?: string;
  error?: string;
}) {
  if (!success && !error) return null;

  const isError = Boolean(error);
  const message = error ?? success;
  const Icon = isError ? AlertTriangle : CheckCircle2;

  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={[
        'mb-6 flex gap-3 rounded-2xl border px-4 py-3.5 text-sm leading-6',
        isError
          ? 'border-rose-200 bg-rose-50 text-rose-900'
          : 'border-emerald-200 bg-emerald-50 text-emerald-900',
      ].join(' ')}
    >
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <p>{message}</p>
    </div>
  );
}
