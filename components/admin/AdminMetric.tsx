import type { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

export function AdminMetric({
  label,
  value,
  detail,
  icon: Icon,
  iconClassName,
}: {
  label: string;
  value: number;
  detail: string;
  icon: LucideIcon;
  iconClassName: string;
}) {
  return (
    <Card className="min-w-0 p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-500 sm:text-xs">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
            {value}
          </p>
        </div>
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-1 text-xs leading-5 text-slate-500">{detail}</p>
    </Card>
  );
}
