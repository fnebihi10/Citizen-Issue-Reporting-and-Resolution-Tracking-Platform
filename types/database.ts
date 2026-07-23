export type UserRole = 'citizen' | 'official' | 'admin';

export type ReportStatus =
  | 'submitted'
  | 'under_review'
  | 'assigned'
  | 'in_progress'
  | 'resolved'
  | 'rejected'
  | 'reopened';

export type ReportPriority = 'low' | 'normal' | 'high' | 'urgent';
export type AttachmentKind = 'evidence' | 'resolution';

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  icon_key: string;
  default_sla_hours: number;
  department_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: UserRole;
  department_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: string;
  report_number: number;
  title: string;
  description: string;
  category_id: string;
  department_id: string | null;
  assigned_official_id: string | null;
  citizen_id: string;
  status: ReportStatus;
  priority: ReportPriority;
  latitude: number;
  longitude: number;
  address_text: string | null;
  sla_due_at: string;
  is_public: boolean;
  public_title: string | null;
  public_summary: string | null;
  resolution_notes: string | null;
  rejected_reason: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}

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

export interface ReportStatusHistory {
  id: string;
  report_id: string;
  previous_status: ReportStatus | null;
  new_status: ReportStatus;
  changed_by: string | null;
  note: string | null;
  created_at: string;
}

export interface ReportComment {
  id: string;
  report_id: string;
  author_id: string;
  body: string;
  is_internal: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublicReportComment {
  id: string;
  report_id: string;
  body: string;
  author_label: 'Qytetar' | 'Zyrtar komunal';
  created_at: string;
}

export interface ReportAttachment {
  id: string;
  report_id: string;
  uploaded_by: string;
  bucket_id: string;
  object_path: string;
  kind: AttachmentKind;
  mime_type: string;
  size_bytes: number;
  is_internal: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  recipient_id: string;
  report_id: string | null;
  type: string;
  title: string;
  message: string;
  read_at: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown>;
  created_at: string;
}
