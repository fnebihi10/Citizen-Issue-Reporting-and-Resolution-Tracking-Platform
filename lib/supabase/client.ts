import { createBrowserClient } from '@supabase/ssr';
import { getPublicSupabaseConfig } from '@/lib/env';
import type { Database } from '@/types/supabase';

export function createClient() {
  const { supabasePublishableKey, supabaseUrl } = getPublicSupabaseConfig();

  return createBrowserClient<Database>(
    supabaseUrl,
    supabasePublishableKey,
  );
}
