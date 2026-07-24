'use client';

import dynamic from 'next/dynamic';
import type { PublicReport } from '@/types/database';

const PublicIssueMap = dynamic(() => import('./PublicIssueMap'), {
  ssr: false,
  loading: () => <div className="flex h-[420px] items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-sm font-semibold text-slate-500 sm:h-[560px]">Duke përgatitur hartën publike...</div>,
});

export function PublicIssueMapLoader({ reports }: { reports: PublicReport[] }) {
  return <PublicIssueMap reports={reports} />;
}
