import Link from 'next/link';
import { Bell, Check, CheckCheck, ExternalLink } from 'lucide-react';
import { redirect } from 'next/navigation';
import {
  markAllNotificationsRead,
  markNotificationRead,
} from '@/app/(workspace)/workflow/actions';
import { WorkspaceHeader } from '@/components/layout/WorkspaceHeader';
import { EmptyState, ErrorState } from '@/components/ui/FeedbackState';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { Card } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import type { Notification, UserRole } from '@/types/database';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login?next=/notifications');

  const [{ data: profile }, { data, error }] = await Promise.all([
    supabase.from('profiles').select('role').eq('id', user.id).maybeSingle(),
    supabase
      .from('notifications')
      .select('id, recipient_id, report_id, type, title, message, read_at, created_at')
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false })
      .limit(100),
  ]);

  const role: UserRole = profile?.role ?? 'citizen';
  const notifications: Notification[] = data ?? [];
  const unreadCount = notifications.filter((notification) => !notification.read_at).length;
  const reportBase =
    role === 'official' || role === 'admin'
      ? '/official/reports'
      : '/citizen/reports';

  return (
    <div className="min-h-screen">
      <WorkspaceHeader role={role} unreadCount={unreadCount} />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
              Përditësimet e tua
            </p>
            <h1 className="mt-3 text-3xl font-black tracking-[-0.045em] text-slate-950 sm:text-4xl">
              Njoftimet
            </h1>
            <p className="mt-3 text-base leading-7 text-slate-600">
              Ndryshimet e statusit dhe komentet e reja shfaqen këtu.
            </p>
          </div>
          {unreadCount > 0 ? (
            <form action={markAllNotificationsRead}>
              <SubmitButton variant="secondary" pendingLabel="Duke shënuar...">
                <CheckCheck className="h-4 w-4" aria-hidden="true" />
                Shëno të gjitha të lexuara
              </SubmitButton>
            </form>
          ) : null}
        </div>

        <div className="mt-8">
          {error ? (
            <ErrorState description="Njoftimet nuk mund të ngarkohen tani." />
          ) : notifications.length === 0 ? (
            <EmptyState
              icon={Bell}
              title="Nuk ke njoftime"
              description="Kur statusi ose biseda e një raportimi të ndryshojë, përditësimi do të shfaqet këtu."
            />
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={[
                    'p-5 shadow-sm',
                    notification.read_at ? 'bg-white' : 'border-blue-200 bg-blue-50/50',
                  ].join(' ')}
                >
                  <div className="flex gap-4">
                    <span
                      className={[
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                        notification.read_at
                          ? 'bg-slate-100 text-slate-500'
                          : 'bg-blue-600 text-white',
                      ].join(' ')}
                    >
                      <Bell className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h2 className="text-sm font-black text-slate-950">
                            {notification.title}
                          </h2>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {notification.message}
                          </p>
                        </div>
                        <time className="text-xs text-slate-500">
                          {formatDate(notification.created_at)}
                        </time>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3">
                        {notification.report_id ? (
                          <Link
                            href={`${reportBase}/${notification.report_id}`}
                            className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-blue-700 hover:text-blue-800"
                          >
                            Hape raportimin
                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                          </Link>
                        ) : null}
                        {!notification.read_at ? (
                          <form action={markNotificationRead}>
                            <input
                              type="hidden"
                              name="notificationId"
                              value={notification.id}
                            />
                            <button
                              type="submit"
                              className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900"
                            >
                              <Check className="h-4 w-4" aria-hidden="true" />
                              Shëno si të lexuar
                            </button>
                          </form>
                        ) : (
                          <span className="inline-flex min-h-11 items-center gap-2 text-xs font-bold text-emerald-700">
                            <Check className="h-4 w-4" aria-hidden="true" />
                            Lexuar
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
