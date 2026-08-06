import type {
  PublicReport,
  PublicReportComment,
  PublicReportStatusHistory,
  ReportStatus,
} from '@/types/database';

export const publicStatusOptions: ReadonlyArray<{
  value: ReportStatus;
  label: string;
}> = [
  { value: 'submitted', label: 'Dorëzuar' },
  { value: 'under_review', label: 'Në verifikim' },
  { value: 'assigned', label: 'Caktuar' },
  { value: 'in_progress', label: 'Në proces' },
  { value: 'resolved', label: 'Zgjidhur' },
  { value: 'rejected', label: 'Refuzuar' },
  { value: 'reopened', label: 'Rihapur' },
];

export const publicPeriodOptions = [
  { value: 'all', label: 'Çdo periudhë', days: null },
  { value: '30', label: '30 ditët e fundit', days: 30 },
  { value: '90', label: '90 ditët e fundit', days: 90 },
  { value: '365', label: '12 muajt e fundit', days: 365 },
] as const;

export type PublicPeriod = (typeof publicPeriodOptions)[number]['value'];

export type PublicReportFilters = {
  query: string;
  category: string;
  status: ReportStatus | null;
  period: PublicPeriod;
};

export type PublicTransparencySummary = {
  total: number;
  active: number;
  resolved: number;
  rejected: number;
  resolutionRate: number;
  averageResolutionDays: number | null;
  statusCounts: Record<ReportStatus, number>;
  categoryCounts: Array<{ slug: string; name: string; count: number }>;
};

export type PublicDensityCell = {
  id: string;
  latitude: number;
  longitude: number;
  count: number;
  intensity: number;
};

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function normalizeSearch(value: string) {
  return value
    .normalize('NFKC')
    .replace(/[\u0000-\u001f\u007f]/g, '')
    .trim()
    .slice(0, 80);
}

export function parsePublicReportFilters(params: {
  q?: string | string[];
  category?: string | string[];
  status?: string | string[];
  period?: string | string[];
}): PublicReportFilters {
  const requestedStatus = firstValue(params.status);
  const requestedPeriod = firstValue(params.period);
  const status = publicStatusOptions.some(
    (option) => option.value === requestedStatus,
  )
    ? (requestedStatus as ReportStatus)
    : null;
  const period = publicPeriodOptions.some(
    (option) => option.value === requestedPeriod,
  )
    ? (requestedPeriod as PublicPeriod)
    : 'all';

  return {
    query: normalizeSearch(firstValue(params.q) ?? ''),
    category: normalizeSearch(firstValue(params.category) ?? '')
      .toLocaleLowerCase('sq-AL')
      .replace(/[^a-z0-9-]/g, ''),
    status,
    period,
  };
}

export function filterPublicReports(
  reports: PublicReport[],
  filters: PublicReportFilters,
  nowMs = Date.now(),
) {
  const search = filters.query.toLocaleLowerCase('sq-AL');
  const selectedPeriod = publicPeriodOptions.find(
    (option) => option.value === filters.period,
  );
  const cutoff =
    selectedPeriod?.days === null || selectedPeriod?.days === undefined
      ? null
      : nowMs - selectedPeriod.days * 24 * 60 * 60 * 1000;

  return reports.filter((report) => {
    if (filters.category && report.category_slug !== filters.category) {
      return false;
    }
    if (filters.status && report.status !== filters.status) return false;
    if (cutoff !== null && Date.parse(report.created_at) < cutoff) return false;
    if (!search) return true;

    const publicText = [
      String(report.report_number),
      report.title,
      report.summary ?? '',
      report.category_name,
    ]
      .join(' ')
      .toLocaleLowerCase('sq-AL');
    return publicText.includes(search);
  });
}

export function summarizePublicReports(
  reports: PublicReport[],
): PublicTransparencySummary {
  const statusCounts = Object.fromEntries(
    publicStatusOptions.map((option) => [option.value, 0]),
  ) as Record<ReportStatus, number>;
  const categories = new Map<string, { name: string; count: number }>();
  const resolutionDurations: number[] = [];

  reports.forEach((report) => {
    statusCounts[report.status] += 1;
    const category = categories.get(report.category_slug);
    categories.set(report.category_slug, {
      name: report.category_name,
      count: (category?.count ?? 0) + 1,
    });

    if (report.status === 'resolved' && report.resolved_at) {
      const duration = Date.parse(report.resolved_at) - Date.parse(report.created_at);
      if (Number.isFinite(duration) && duration >= 0) {
        resolutionDurations.push(duration);
      }
    }
  });

  const resolved = statusCounts.resolved;
  const rejected = statusCounts.rejected;
  const total = reports.length;

  return {
    total,
    active: total - resolved - rejected,
    resolved,
    rejected,
    resolutionRate: total === 0 ? 0 : Math.round((resolved / total) * 100),
    averageResolutionDays:
      resolutionDurations.length === 0
        ? null
        : Math.round(
            resolutionDurations.reduce((totalMs, value) => totalMs + value, 0)
              / resolutionDurations.length
              / (24 * 60 * 60 * 1000)
              * 10,
          ) / 10,
    statusCounts,
    categoryCounts: Array.from(categories, ([slug, value]) => ({
      slug,
      ...value,
    })).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name, 'sq')),
  };
}

export function aggregatePublicDensity(
  reports: PublicReport[],
  cellPrecision = 100,
): PublicDensityCell[] {
  const cells = new Map<
    string,
    { latitudeTotal: number; longitudeTotal: number; count: number }
  >();

  reports.forEach((report) => {
    const latitudeCell = Math.round(report.latitude * cellPrecision);
    const longitudeCell = Math.round(report.longitude * cellPrecision);
    const id = `${latitudeCell}:${longitudeCell}`;
    const cell = cells.get(id) ?? {
      latitudeTotal: 0,
      longitudeTotal: 0,
      count: 0,
    };
    cell.latitudeTotal += report.latitude;
    cell.longitudeTotal += report.longitude;
    cell.count += 1;
    cells.set(id, cell);
  });

  const maximum = Math.max(1, ...Array.from(cells.values(), (cell) => cell.count));
  return Array.from(cells, ([id, cell]) => ({
    id,
    latitude: cell.latitudeTotal / cell.count,
    longitude: cell.longitudeTotal / cell.count,
    count: cell.count,
    intensity: cell.count / maximum,
  })).sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));
}

export function toPublicReportComment(
  row: {
    id: string | null;
    report_id: string | null;
    body: string | null;
    author_label: string | null;
    created_at: string | null;
  },
): PublicReportComment | null {
  if (
    typeof row.id !== 'string'
    || typeof row.report_id !== 'string'
    || typeof row.body !== 'string'
    || (row.author_label !== 'Qytetar' && row.author_label !== 'Zyrtar komunal')
    || typeof row.created_at !== 'string'
  ) {
    return null;
  }
  return {
    id: row.id,
    report_id: row.report_id,
    body: row.body,
    author_label: row.author_label,
    created_at: row.created_at,
  };
}

export function toPublicReportStatusHistory(
  row: {
    id: string | null;
    report_id: string | null;
    previous_status: ReportStatus | null;
    new_status: ReportStatus | null;
    created_at: string | null;
  },
): PublicReportStatusHistory | null {
  if (
    typeof row.id !== 'string'
    || typeof row.report_id !== 'string'
    || row.new_status === null
    || typeof row.created_at !== 'string'
  ) {
    return null;
  }
  return {
    id: row.id,
    report_id: row.report_id,
    previous_status: row.previous_status,
    new_status: row.new_status,
    created_at: row.created_at,
  };
}

export function isPublicReportId(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}
