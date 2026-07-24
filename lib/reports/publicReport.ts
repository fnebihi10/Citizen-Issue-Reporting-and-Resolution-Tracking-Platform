import type { PublicReport, PublicReportRow } from '@/types/database';

export function toPublicReport(row: PublicReportRow): PublicReport | null {
  if (
    typeof row.id !== 'string'
    || typeof row.report_number !== 'number'
    || typeof row.title !== 'string'
    || typeof row.category_slug !== 'string'
    || typeof row.category_name !== 'string'
    || row.status === null
    || row.priority === null
    || typeof row.latitude !== 'number'
    || !Number.isFinite(row.latitude)
    || typeof row.longitude !== 'number'
    || !Number.isFinite(row.longitude)
    || typeof row.created_at !== 'string'
    || typeof row.updated_at !== 'string'
  ) {
    return null;
  }

  return {
    id: row.id,
    report_number: row.report_number,
    title: row.title,
    summary: row.summary,
    category_slug: row.category_slug,
    category_name: row.category_name,
    status: row.status,
    priority: row.priority,
    latitude: row.latitude,
    longitude: row.longitude,
    created_at: row.created_at,
    updated_at: row.updated_at,
    resolved_at: row.resolved_at,
  };
}
