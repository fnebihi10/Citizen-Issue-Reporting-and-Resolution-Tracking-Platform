import { loadEnvFile } from 'node:process';
import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

if (
  process.env.REMOTE_AUDIT_ALLOW !== '1'
  && !process.argv.includes('--allow-dev')
) {
  throw new Error(
    '--allow-dev or REMOTE_AUDIT_ALLOW=1 is required. Run this only against dev/staging.',
  );
}

loadEnvFile('.env.local');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const auditEmail =
  process.env.REMOTE_AUDIT_EMAIL ?? 'synthetic.citizen@example.test';
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
  realtime: {
    transport: WebSocket,
  },
};
const anonymousClient = createClient(
  supabaseUrl,
  publishableKey,
  clientOptions,
);
const authenticatedClient = createClient(
  supabaseUrl,
  publishableKey,
  clientOptions,
);

const { data: publicRows, error: publicError } = await anonymousClient
  .from('public_reports')
  .select(
    'id, category_slug, status, latitude, longitude, created_at',
  )
  .limit(500);

if (publicError) throw publicError;

const syntheticPublicCount = (publicRows ?? []).filter((row) =>
  row.id?.startsWith('10000000-0000-4000-8000-')
).length;

if (syntheticPublicCount !== 104) {
  throw new Error(
    `Expected 104 public synthetic reports, received ${syntheticPublicCount}.`,
  );
}

const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
const suggestionCandidate = (publicRows ?? []).find((row) =>
  row.id?.startsWith('10000000-0000-4000-8000-')
  && row.status !== 'resolved'
  && row.status !== 'rejected'
  && typeof row.latitude === 'number'
  && typeof row.longitude === 'number'
  && typeof row.created_at === 'string'
  && new Date(row.created_at).getTime() > ninetyDaysAgo
);

if (!suggestionCandidate?.category_slug) {
  throw new Error(
    'No recent active synthetic public report is available for the RPC smoke test.',
  );
}

const { data: category, error: categoryError } = await anonymousClient
  .from('categories')
  .select('id')
  .eq('slug', suggestionCandidate.category_slug)
  .single();

if (categoryError) throw categoryError;

const { error: anonymousRpcError } = await anonymousClient.rpc(
  'suggest_similar_reports',
  {
    p_category_id: category.id,
    p_latitude: suggestionCandidate.latitude,
    p_longitude: suggestionCandidate.longitude,
    p_radius_m: 1000,
  },
);

if (!anonymousRpcError) {
  throw new Error('Anonymous duplicate-suggestion RPC unexpectedly succeeded.');
}

const { data: signInData, error: signInError } =
  await authenticatedClient.auth.signInWithPassword({
    email: auditEmail,
    password: auditPassword,
  });
if (signInError) throw signInError;

try {
  const auditUserId = signInData.user?.id;
  if (!auditUserId) {
    throw new Error('Synthetic audit sign-in returned no user ID.');
  }

  const auditReportTitle = 'Remote audit verification report (RBAC)';
  const {
    data: existingAuditReport,
    error: existingAuditReportError,
  } = await authenticatedClient
    .from('reports')
    .select('id, priority, report_number')
    .eq('title', auditReportTitle)
    .maybeSingle();

  if (existingAuditReportError) throw existingAuditReportError;

  let ownReport = existingAuditReport;

  if (!ownReport) {
    const { data: insertedAuditReport, error: auditInsertError } =
      await authenticatedClient
        .from('reports')
        .insert({
          title: auditReportTitle,
          description:
            'Synthetic private report used only to verify the hosted development workflow.',
          category_id: category.id,
          citizen_id: auditUserId,
          status: 'submitted',
          priority: 'normal',
          department_id: null,
          assigned_official_id: null,
          is_public: false,
          location: 'SRID=4326;POINT(21.1655 42.6629)',
          address_text: 'Synthetic audit location',
        })
        .select('id, priority, report_number')
        .single();

    if (auditInsertError) throw auditInsertError;
    ownReport = insertedAuditReport;
  }

  if (
    !ownReport
    || ownReport.priority !== 'normal'
    || !Number.isInteger(ownReport.report_number)
  ) {
    throw new Error('Authenticated citizen report creation returned invalid data.');
  }

  const { data: tamperedRows, error: tamperError } = await authenticatedClient
    .from('reports')
    .update({ priority: 'urgent' })
    .eq('id', ownReport.id)
    .select('id');

  if (tamperError) throw tamperError;
  if ((tamperedRows ?? []).length > 0) {
    await authenticatedClient
      .from('reports')
      .update({ priority: ownReport.priority })
      .eq('id', ownReport.id);
    throw new Error('Citizen report UPDATE unexpectedly passed RLS.');
  }

  const { data: suggestions, error: suggestionError } =
    await authenticatedClient.rpc('suggest_similar_reports', {
      p_category_id: category.id,
      p_latitude: suggestionCandidate.latitude,
      p_longitude: suggestionCandidate.longitude,
      p_radius_m: 1000,
    });

  if (suggestionError) throw suggestionError;
  if (!suggestions || suggestions.length === 0) {
    throw new Error('Authenticated duplicate suggestions returned no rows.');
  }

  const objectPath = `reports/${ownReport.id}/remote-audit-evidence.png`;
  const syntheticPng = Uint8Array.from(
    Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
      'base64',
    ),
  );

  const {
    data: existingAttachment,
    error: existingAttachmentError,
  } = await authenticatedClient
    .from('report_attachments')
    .select('id')
    .eq('report_id', ownReport.id)
    .eq('object_path', objectPath)
    .maybeSingle();

  if (existingAttachmentError) throw existingAttachmentError;

  if (!existingAttachment) {
    let { error: uploadError } = await authenticatedClient.storage
      .from('report-evidence')
      .upload(objectPath, syntheticPng, {
        contentType: 'image/png',
        upsert: false,
      });

    // Recover only the deterministic synthetic audit object if an earlier
    // interrupted run uploaded it before registering its metadata.
    if (uploadError) {
      const { error: orphanRemovalError } = await authenticatedClient.storage
        .from('report-evidence')
        .remove([objectPath]);
      if (orphanRemovalError) throw uploadError;

      ({ error: uploadError } = await authenticatedClient.storage
        .from('report-evidence')
        .upload(objectPath, syntheticPng, {
          contentType: 'image/png',
          upsert: false,
        }));
    }

    if (uploadError) throw uploadError;

    const { error: attachmentInsertError } = await authenticatedClient
      .from('report_attachments')
      .insert({
        report_id: ownReport.id,
        uploaded_by: auditUserId,
        bucket_id: 'report-evidence',
        object_path: objectPath,
        kind: 'evidence',
        mime_type: 'image/png',
        size_bytes: syntheticPng.byteLength,
      });

    if (attachmentInsertError) {
      await authenticatedClient.storage
        .from('report-evidence')
        .remove([objectPath]);
      throw attachmentInsertError;
    }
  }

  const { data: downloadedEvidence, error: downloadError } =
    await authenticatedClient.storage
      .from('report-evidence')
      .download(objectPath);

  if (downloadError) throw downloadError;
  if (!downloadedEvidence || downloadedEvidence.size !== syntheticPng.byteLength) {
    throw new Error('Authenticated evidence download returned unexpected data.');
  }

  const { error: anonymousDownloadError } = await anonymousClient.storage
    .from('report-evidence')
    .download(objectPath);

  if (!anonymousDownloadError) {
    throw new Error('Anonymous evidence download unexpectedly succeeded.');
  }

  await authenticatedClient.storage
    .from('report-evidence')
    .remove([objectPath]);

  const { data: immutableEvidence, error: immutableDownloadError } =
    await authenticatedClient.storage
      .from('report-evidence')
      .download(objectPath);

  if (immutableDownloadError || !immutableEvidence) {
    throw new Error(
      'Registered evidence was deleted even though Storage evidence is immutable.',
    );
  }
} finally {
  await authenticatedClient.auth.signOut();
}

console.log(
  'Remote dev verification passed: 104 public synthetic reports, citizen report creation, RPC access boundaries, report immutability, and private immutable evidence Storage.',
);
