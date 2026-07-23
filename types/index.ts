import type { ReportStatus } from './database';

export * from './database';

export interface ReportFilterOptions {
  status?: string;
  category_id?: string;
  department_id?: string;
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
}

export interface SyntheticDatasetReport {
  id: string;
  report_number: number;
  title: string;
  description: string;
  category_slug: string;
  category_name: string;
  status: ReportStatus;
  latitude: number;
  longitude: number;
  public_location_precision_m: number;
  created_at: string;
  updated_at: string;
  sla_due_at: string;
  is_sla_overdue: boolean;
  is_public: boolean;
}
