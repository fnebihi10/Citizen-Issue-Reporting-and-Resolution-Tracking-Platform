import { createBrowserClient } from '@supabase/ssr';
import { getPublicSupabaseConfig } from '@/lib/env';

export function createClient() {
  const { supabasePublishableKey, supabaseUrl } = getPublicSupabaseConfig();

  return createBrowserClient(
    supabaseUrl,
    supabasePublishableKey,
  );
}
