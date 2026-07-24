const fs = require('node:fs');
const path = require('node:path');

const reportCount = 120;
const generationSeed = 20260723;
const referenceDate = Date.UTC(2026, 6, 1);

// This is an explicitly synthetic demo grid, not an address, municipality, or real incident location.
const syntheticMapCenter = { latitude: 42.0, longitude: 20.0 };

const categories = [
  { id: 'a1111111-1111-1111-1111-111111111111', slug: 'rruge-gropa', name: 'Rrugë dhe gropa', slaHours: 48, subjects: ['Gropë në segment rrugor', 'Trotuar i dëmtuar', 'Asfalt i dëmtuar'] },
  { id: 'b2222222-2222-2222-2222-222222222222', slug: 'ndricim-publik', name: 'Ndriçim publik', slaHours: 24, subjects: ['Ndriçim publik i fikur', 'Shtyllë ndriçimi e dëmtuar', 'Zonë publike pa ndriçim'] },
  { id: 'c3333333-3333-3333-3333-333333333333', slug: 'mbeturina', name: 'Mbeturina', slaHours: 24, subjects: ['Kontejner i mbushur', 'Mbeturina në hapësirë publike', 'Nevojë për pastrim'] },
  { id: 'd4444444-4444-4444-4444-444444444444', slug: 'sinjalistike', name: 'Sinjalistikë', slaHours: 72, subjects: ['Shenjë trafiku e dëmtuar', 'Vijëzim i zbehur', 'Sinjalistikë që mungon'] },
];

const statuses = ['submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'rejected', 'reopened'];
const syntheticCitizenIds = [
  '00000000-0000-4000-8000-000000000001',
  '00000000-0000-4000-8000-000000000002',
  '00000000-0000-4000-8000-000000000003',
];

function seededRandom(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

const random = seededRandom(generationSeed);
const choose = (items) => items[Math.floor(random() * items.length)];
const between = (minimum, maximum) => minimum + random() * (maximum - minimum);
const round = (value, decimals) => Number(value.toFixed(decimals));

const dataset = Array.from({ length: reportCount }, (_, index) => {
  const category = choose(categories);
  const status = choose(statuses);
  const createdAt = new Date(Date.UTC(2026, 0, 1) + Math.floor(random() * 155 * 24 * 60 * 60 * 1000));
  const updatedAt = new Date(createdAt.getTime() + Math.floor(random() * 72 * 60 * 60 * 1000));
  const slaDueAt = new Date(createdAt.getTime() + category.slaHours * 60 * 60 * 1000);
  const isTerminal = status === 'resolved' || status === 'rejected';

  return {
    id: `SYN-${String(index + 1).padStart(4, '0')}`,
    report_number: 1001 + index,
    title: `${choose(category.subjects)} — rast sintetik ${index + 1}`,
    description: `Përshkrim sintetik për kategorinë ${category.name.toLowerCase()}. Nuk përfaqëson problem, person ose adresë reale.`,
    category_slug: category.slug,
    category_name: category.name,
    status,
    latitude: round(between(syntheticMapCenter.latitude - 0.025, syntheticMapCenter.latitude + 0.025), 4),
    longitude: round(between(syntheticMapCenter.longitude - 0.025, syntheticMapCenter.longitude + 0.025), 4),
    public_location_precision_m: 500,
    created_at: createdAt.toISOString(),
    updated_at: updatedAt.toISOString(),
    sla_due_at: slaDueAt.toISOString(),
    is_sla_overdue: !isTerminal && slaDueAt.getTime() < referenceDate,
    is_public: status !== 'submitted',
  };
});

function sqlString(value) {
  return `'${String(value).replaceAll("'", "''")}'`;
}

function reportUuid(index) {
  return `10000000-0000-4000-8000-${String(index + 1).padStart(12, '0')}`;
}

function sqlUuidList(reportRows) {
  return reportRows
    .map((report) => `    ${sqlString(report.databaseId)}::uuid`)
    .join(',\n');
}

function buildDatabaseSeed(reports) {
  const categoryIds = new Map(categories.map((category) => [category.slug, category.id]));
  const databaseReports = reports.map((report, index) => {
    const categoryId = categoryIds.get(report.category_slug);
    if (!categoryId) {
      throw new Error(`Unknown category slug: ${report.category_slug}`);
    }

    return {
      ...report,
      categoryId,
      citizenId: syntheticCitizenIds[index % syntheticCitizenIds.length],
      databaseId: reportUuid(index),
    };
  });

  const allIds = sqlUuidList(databaseReports);
  const values = databaseReports.map((report) => `  (
    ${sqlString(report.databaseId)}::uuid,
    ${sqlString(report.title)},
    ${sqlString(report.description)},
    ${sqlString(report.categoryId)}::uuid,
    ${sqlString(report.citizenId)}::uuid,
    'submitted',
    'normal',
    extensions.st_setsrid(
      extensions.st_makepoint(${report.longitude}, ${report.latitude}),
      4326
    )::extensions.geography,
    false,
    ${sqlString(report.created_at)}::timestamptz
  )`).join(',\n');

  function transition(targetStatuses, statement) {
    const targets = databaseReports.filter((report) => targetStatuses.includes(report.status));
    if (targets.length === 0) return '';
    return `${statement}
where id in (
${sqlUuidList(targets)}
);
`;
  }

  const toUnderReview = transition(
    ['under_review', 'assigned', 'in_progress', 'resolved', 'rejected', 'reopened'],
    `update public.reports
set status = 'under_review'`,
  );
  const toRejected = transition(
    ['rejected'],
    `update public.reports
set
  status = 'rejected',
  rejected_reason = 'Refuzim sintetik për demonstrim.'`,
  );
  const toAssigned = transition(
    ['assigned', 'in_progress', 'resolved', 'reopened'],
    `update public.reports
set
  status = 'assigned',
  department_id = (
    select c.department_id
    from public.categories c
    where c.id = reports.category_id
  )`,
  );
  const toInProgress = transition(
    ['in_progress', 'resolved', 'reopened'],
    `update public.reports
set status = 'in_progress'`,
  );
  const toResolved = transition(
    ['resolved', 'reopened'],
    `update public.reports
set
  status = 'resolved',
  resolution_notes = 'Zgjidhje sintetike për demonstrim.'`,
  );
  const toReopened = transition(
    ['reopened'],
    `update public.reports
set status = 'reopened'`,
  );
  const toPublic = transition(
    ['under_review', 'assigned', 'in_progress', 'resolved', 'rejected', 'reopened'],
    `update public.reports
set
  is_public = true,
  public_title = title,
  public_summary = pg_catalog.left(description, 1000)`,
  );

  const slaValues = databaseReports
    .map((report) => `    (${sqlString(report.databaseId)}::uuid, ${sqlString(report.sla_due_at)}::timestamptz)`)
    .join(',\n');

  return `-- GENERATED FILE. Run \`npm run generate:dataset\` to rebuild it.
-- Contains only synthetic development/staging data. Never seed production.

begin;

-- Replace only deterministic synthetic reports; user-created data is untouched.
delete from public.audit_logs
where entity_type = 'report'
  and entity_id in (
${allIds}
  );

delete from public.reports
where id in (
${allIds}
);

insert into public.reports (
  id,
  title,
  description,
  category_id,
  citizen_id,
  status,
  priority,
  location,
  is_public,
  created_at
)
values
${values};

${toUnderReview}
${toRejected}
${toAssigned}
${toInProgress}
${toResolved}
${toReopened}
${toPublic}
update public.reports as reports
set sla_due_at = seed_values.sla_due_at
from (
  values
${slaValues}
) as seed_values(id, sla_due_at)
where reports.id = seed_values.id;

do $$
begin
  if (
    select count(*)
    from public.reports
    where id in (
${allIds}
    )
  ) <> ${reportCount} then
    raise exception 'SYNTHETIC_REPORT_SEED_COUNT_MISMATCH';
  end if;

  if exists (
    select 1
    from public.reports
    where id in (
${allIds}
    )
      and is_public = true
      and (
        public_location is null
        or extensions.st_distance(location, public_location) < 50
      )
  ) then
    raise exception 'SYNTHETIC_PUBLIC_LOCATION_NOT_GENERALIZED';
  end if;
end;
$$;

commit;
`;
}

function writeOrCheck(filePath, content, checkOnly) {
  if (checkOnly) {
    const existing = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, 'utf8')
      : '';
    if (existing !== content) {
      console.error(`Generated artifact is stale: ${path.relative(__dirname, filePath)}`);
      process.exitCode = 1;
    }
    return;
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

const checkOnly = process.argv.includes('--check');
const datasetPath = path.join(__dirname, 'dataset', 'synthetic_dataset.json');
const databaseSeedPath = path.join(__dirname, 'supabase', 'seeds', 'synthetic_reports.sql');
writeOrCheck(datasetPath, `${JSON.stringify(dataset, null, 2)}\n`, checkOnly);
writeOrCheck(databaseSeedPath, buildDatabaseSeed(dataset), checkOnly);

if (!checkOnly) {
  console.log(`Generated ${reportCount} deterministic synthetic reports and the database seed.`);
} else if (!process.exitCode) {
  console.log('Synthetic dataset and database seed are synchronized.');
}
