import { loadEnvFile } from 'node:process';
import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

if (
  process.env.SPRINT6_AUDIT_ALLOW !== '1'
  && !process.argv.includes('--allow-dev')
) {
  throw new Error(
    '--allow-dev or SPRINT6_AUDIT_ALLOW=1 is required. Run this only against dev/staging.',
  );
}

loadEnvFile('.env.local');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const auditPassword =
  process.env.REMOTE_AUDIT_PASSWORD ?? 'SyntheticDemoOnly!2026';

if (!supabaseUrl || !publishableKey) {
  throw new Error('Missing public Supabase configuration in .env.local.');
}

const clientOptions = {
  auth: {
    autoRefreshToken: false,
    detectSessionInUrl: false,
    persistSession: false,
  },
  realtime: { transport: WebSocket },
};

function client() {
  return createClient(supabaseUrl, publishableKey, clientOptions);
}

const citizen = client();
const official = client();
const otherDepartmentOfficial = client();
const auditTitle = 'Sprint 6 deterministic workflow audit';

async function signIn(target, email) {
  const { data, error } = await target.auth.signInWithPassword({
    email,
    password: auditPassword,
  });
  if (error) throw error;
  if (!data.user) throw new Error(`Sign-in returned no user for ${email}.`);
  return data.user;
}

const citizenUser = await signIn(
  citizen,
  'synthetic.citizen@example.test',
);
const officialUser = await signIn(
  official,
  'synthetic.official@example.test',
);
await signIn(
  otherDepartmentOfficial,
  'synthetic.environment.official@example.test',
);

try {
  const { data: category, error: categoryError } = await citizen
    .from('categories')
    .select('id, department_id')
    .eq('slug', 'rruge-gropa')
    .single();
  if (categoryError) throw categoryError;
  if (!category.department_id) {
    throw new Error('Sprint 6 audit category has no department.');
  }

  let { data: report, error: reportError } = await citizen
    .from('reports')
    .select('id, status, report_number')
    .eq('title', auditTitle)
    .maybeSingle();
  if (reportError) throw reportError;

  if (!report) {
    const { data: created, error: createError } = await citizen
      .from('reports')
      .insert({
        title: auditTitle,
        description:
          'Synthetic report used only to verify the Sprint 6 official workflow.',
        category_id: category.id,
        citizen_id: citizenUser.id,
        status: 'submitted',
        priority: 'normal',
        department_id: null,
        assigned_official_id: null,
        is_public: false,
        location: 'SRID=4326;POINT(21.1655 42.6629)',
        address_text: 'Synthetic Sprint 6 audit location',
      })
      .select('id, status, report_number')
      .single();
    if (createError) throw createError;
    report = created;
  }

  if (report.status === 'rejected') {
    throw new Error('The deterministic Sprint 6 audit report is rejected.');
  }

  if (report.status === 'resolved') {
    const { error } = await citizen.rpc('reopen_resolved_report', {
      p_report_id: report.id,
      p_reason:
        'Synthetic reopening used to begin another complete Sprint 6 audit cycle.',
    });
    if (error) throw error;
    report.status = 'reopened';
  }

  if (report.status === 'submitted' || report.status === 'reopened') {
    const { error } = await official.rpc('transition_report_workflow', {
      p_report_id: report.id,
      p_target_status: 'under_review',
      p_note: 'Synthetic official started the verification.',
    });
    if (error) throw error;
    report.status = 'under_review';
  }

  if (report.status === 'under_review') {
    const { error } = await official.rpc('transition_report_workflow', {
      p_report_id: report.id,
      p_target_status: 'assigned',
      p_note: 'Synthetic report assigned to the infrastructure team.',
      p_department_id: category.department_id,
      p_assigned_official_id: officialUser.id,
      p_priority: 'high',
      p_is_public: true,
      p_public_title: 'Synthetic infrastructure issue',
      p_public_summary:
        'Synthetic public summary without citizen identity or exact location.',
    });
    if (error) throw error;
    report.status = 'assigned';
  }

  const { data: crossDepartmentRows, error: crossDepartmentError } =
    await otherDepartmentOfficial
      .from('reports')
      .select('id')
      .eq('id', report.id);
  if (crossDepartmentError) throw crossDepartmentError;
  if ((crossDepartmentRows ?? []).length !== 0) {
    throw new Error('A cross-department official can read the assigned report.');
  }

  if (report.status === 'assigned') {
    const { error } = await official.rpc('transition_report_workflow', {
      p_report_id: report.id,
      p_target_status: 'in_progress',
      p_note: 'Synthetic field work started.',
    });
    if (error) throw error;
    report.status = 'in_progress';
  }

  if (report.status === 'in_progress') {
    const { error } = await official.rpc('transition_report_workflow', {
      p_report_id: report.id,
      p_target_status: 'resolved',
      p_note:
        'Synthetic field work was completed and the outcome was verified.',
    });
    if (error) throw error;
    report.status = 'resolved';
  }

  const externalComment = `Citizen-visible Sprint 6 audit comment for ${report.id}.`;
  const internalComment = `Internal Sprint 6 audit note for ${report.id}.`;

  for (const [body, isInternal] of [
    [externalComment, false],
    [internalComment, true],
  ]) {
    const { error } = await official.rpc('add_report_comment', {
      p_report_id: report.id,
      p_body: body,
      p_is_internal: isInternal,
    });
    if (error) throw error;
  }

  const { data: citizenComments, error: commentsError } = await citizen
    .from('report_comments')
    .select('body, is_internal')
    .eq('report_id', report.id)
    .in('body', [externalComment, internalComment]);
  if (commentsError) throw commentsError;
  if (
    citizenComments?.length !== 1
    || citizenComments[0].body !== externalComment
    || citizenComments[0].is_internal
  ) {
    throw new Error('Internal staff comments crossed the citizen RLS boundary.');
  }

  const { data: notifications, error: notificationsError } = await citizen
    .from('notifications')
    .select('id, type, report_id')
    .eq('report_id', report.id);
  if (notificationsError) throw notificationsError;
  if (
    !notifications?.some((item) => item.type === 'report_status_changed')
    || !notifications.some((item) => item.type === 'report_comment_added')
  ) {
    throw new Error('Citizen workflow notifications were not generated.');
  }

  const { error: reopenError } = await citizen.rpc('reopen_resolved_report', {
    p_report_id: report.id,
    p_reason:
      'Synthetic citizen reports that the issue appeared again after resolution.',
  });
  if (reopenError) throw reopenError;

  const { data: reopened, error: reopenedError } = await citizen
    .from('reports')
    .select('status')
    .eq('id', report.id)
    .single();
  if (reopenedError) throw reopenedError;
  if (reopened.status !== 'reopened') {
    throw new Error('Citizen reopening did not persist the reopened status.');
  }
} finally {
  await Promise.all([
    citizen.auth.signOut(),
    official.auth.signOut(),
    otherDepartmentOfficial.auth.signOut(),
  ]);
}

console.log(
  'Sprint 6 remote verification passed: staff scope, complete status workflow, public/internal comments, citizen notifications, and controlled reopening.',
);
