import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { getPublicSupabaseConfig } from '@/lib/env';
import type { Database } from '@/types/supabase';

const { supabasePublishableKey, supabaseUrl } = getPublicSupabaseConfig();
const publicSupabase = createClient<Database>(
  supabaseUrl,
  supabasePublishableKey,
  {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  },
);

export const getPublicReportsData = unstable_cache(
  async () => {
    const { data, error } = await publicSupabase
      .from('public_reports')
      .select(
        'id, report_number, title, summary, category_slug, category_name, status, priority, latitude, longitude, created_at, updated_at, resolved_at',
      )
      .order('updated_at', { ascending: false })
      .limit(500);

    return {
      rows: data ?? [],
      error: error?.message ?? null,
    };
  },
  ['public-transparency-reports-v1'],
  {
    revalidate: 30,
    tags: ['public-transparency'],
  },
);

export const getPublicReportDetailData = unstable_cache(
  async (reportId: string) => {
    const [report, comments, history] = await Promise.all([
      publicSupabase
        .from('public_reports')
        .select(
          'id, report_number, title, summary, category_slug, category_name, status, priority, latitude, longitude, created_at, updated_at, resolved_at',
        )
        .eq('id', reportId)
        .maybeSingle(),
      publicSupabase
        .from('public_report_comments')
        .select('id, report_id, body, author_label, created_at')
        .eq('report_id', reportId)
        .order('created_at', { ascending: true }),
      publicSupabase
        .from('public_report_status_history')
        .select('id, report_id, previous_status, new_status, created_at')
        .eq('report_id', reportId)
        .order('created_at', { ascending: true }),
    ]);

    return {
      reportRow: report.data,
      reportError: report.error?.message ?? null,
      commentRows: comments.data ?? [],
      commentsError: comments.error?.message ?? null,
      historyRows: history.data ?? [],
      historyError: history.error?.message ?? null,
    };
  },
  ['public-transparency-report-detail-v1'],
  {
    revalidate: 30,
    tags: ['public-transparency'],
  },
);
