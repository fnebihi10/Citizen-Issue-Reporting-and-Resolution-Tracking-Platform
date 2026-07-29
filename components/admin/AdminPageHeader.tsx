import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';
import { buttonVariantsClass } from '@/components/ui/button';

export function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: {
    href: string;
    label: string;
    icon?: LucideIcon;
  };
}) {
  const ActionIcon = action?.icon;

  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
          {eyebrow}
        </p>
        <h1 className="mt-2.5 text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2.5 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
          {description}
        </p>
      </div>
      <Link
        href={action?.href ?? '/admin'}
        className={buttonVariantsClass({
          variant: 'secondary',
          className: 'w-full shrink-0 sm:w-auto',
        })}
      >
        {ActionIcon ? (
          <ActionIcon className="h-4 w-4" aria-hidden="true" />
        ) : (
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        )}
        {action?.label ?? 'Kthehu te paneli'}
      </Link>
    </header>
  );
}
