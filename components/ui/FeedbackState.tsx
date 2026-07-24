import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, Inbox, LoaderCircle } from 'lucide-react';
import type { ReactNode } from 'react';

type StateMessageProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: ReactNode;
};

export function EmptyState({ title, description, icon: Icon = Inbox, action }: StateMessageProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm sm:p-10">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="mt-5 text-lg font-black tracking-tight text-slate-950">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">{description}</p>
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

type ErrorStateProps = {
  title?: string;
  description: string;
  action?: ReactNode;
};

export function ErrorState({ title = 'Diçka nuk funksionoi', description, action }: ErrorStateProps) {
  return (
    <div role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-rose-950 sm:p-8">
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-rose-600 shadow-sm">
        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-black tracking-tight">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-rose-800">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export function LoadingState({ label = 'Duke ngarkuar...' }: { label?: string }) {
  return (
    <div role="status" className="flex min-h-48 items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-sm font-semibold text-slate-600 shadow-sm">
      <LoaderCircle className="mr-2 h-5 w-5 animate-spin text-blue-600" aria-hidden="true" />
      {label}
    </div>
  );
}
