import type { Database, Tables } from './supabase';

export type UserRole = Database['public']['Enums']['user_role'];
export type ReportStatus = Database['public']['Enums']['report_status'];
export type ReportPriority = Database['public']['Enums']['report_priority'];
export type AttachmentKind = Database['public']['Enums']['attachment_kind'];

export type Department = Tables<'departments'>;
export type Category = Tables<'categories'>;
export type Profile = Tables<'profiles'>;
export type Report = Tables<'reports'>;

export type CitizenReportListItem = Pick<
  Report,
  | 'id'
  | 'report_number'
  | 'title'
  | 'description'
  | 'category_id'
  | 'department_id'
  | 'assigned_official_id'
  | 'citizen_id'
  | 'status'
  | 'priority'
  | 'address_text'
  | 'sla_due_at'
  | 'is_public'
  | 'public_title'
  | 'public_summary'
  | 'resolution_notes'
  | 'rejected_reason'
  | 'resolved_at'
  | 'created_at'
  | 'updated_at'
>;

export interface PublicReport {
  id: string;
  report_number: number;
  title: string;
  summary: string | null;
  category_slug: string;
  category_name: string;
  status: ReportStatus;
  priority: ReportPriority;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
}

export type PublicReportRow = Tables<'public_reports'>;
export type ReportStatusHistory = Tables<'report_status_history'>;
export type ReportComment = Tables<'report_comments'>;

export interface PublicReportComment {
  id: string;
  report_id: string;
  body: string;
  author_label: 'Qytetar' | 'Zyrtar komunal';
  created_at: string;
}

export type ReportAttachment = Tables<'report_attachments'>;
export type Notification = Tables<'notifications'>;
export type AuditLog = Tables<'audit_logs'>;

export type SimilarReportSuggestion =
  Database['public']['Functions']['suggest_similar_reports']['Returns'][number];
