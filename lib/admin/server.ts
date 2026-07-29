import 'server-only';

import { redirect } from 'next/navigation';
import { getWorkspaceRequestContext } from '@/lib/auth/serverContext';
import { createClient } from '@/lib/supabase/server';

export async function requireAdmin(nextPath: string) {
  const context = await getWorkspaceRequestContext();
  if (!context) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  if (context.role !== 'admin') redirect('/account?error=forbidden');

  const supabase = await createClient();

  return {
    supabase,
    user: { id: context.userId },
    fullName: context.fullName,
    unreadCount: context.unreadCount,
    sessionStartedAt: context.sessionStartedAt,
  };
}
