'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getSessionRemainingMs } from '@/lib/auth/sessionExpiry';
import { createClient } from '@/lib/supabase/client';

export function SessionExpiryGuard() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    let timeoutId: number | undefined;

    async function expireCurrentSession() {
      const supabase = createClient();
      await supabase.auth.signOut({ scope: 'local' });
      if (cancelled) return;
      const nextPath = `${window.location.pathname}${window.location.search}`;
      router.replace(
        `/login?expired=1&next=${encodeURIComponent(nextPath || pathname)}`,
      );
      router.refresh();
    }

    async function scheduleExpiry() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (cancelled || !user) return;

      const remainingMs = getSessionRemainingMs(
        user.last_sign_in_at ?? user.created_at,
      );
      if (remainingMs === 0) {
        await expireCurrentSession();
        return;
      }

      timeoutId = window.setTimeout(() => {
        void expireCurrentSession();
      }, remainingMs);
    }

    void scheduleExpiry();

    return () => {
      cancelled = true;
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, [pathname, router]);

  return null;
}
