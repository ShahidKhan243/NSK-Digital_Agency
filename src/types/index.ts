export type UserRole = 'customer' | 'employee' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  company_name?: string;
  employee_id?: string;
  avatar_url?: string;
  created_at?: string;
}

export interface Employee {
  id: string;
  employee_id: string; // e.g. EMP-001
  full_name: string;
  email: string;
  phone: string;
  role: 'developer' | 'designer' | 'manager' | 'employee' | 'admin';
  designation: string;
  status: 'active' | 'inactive';
  assigned_projects_count: number;
  password?: string; // stored hashed/plain for mock, auth handled in Supabase
  created_at: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  short_desc: string;
  full_desc: string;
  icon: string;
  image_url: string;
  starting_price?: number;
  currency: string;
  estimated_timeline: string;
  features: string[];
  deliverables: string[];
  process: { step: number; title: string; desc: string }[];
  is_active: boolean;
}

export type ProjectStatus =
  | 'Request Received'
  | 'Under Review'
  | 'Quote Sent'
  | 'Payment Pending'
  | 'Confirmed'
  | 'In Progress'
  | 'Design Stage'
  | 'Development Stage'
  | 'Testing'
  | 'Client Review'
  | 'Completed'
  | 'Cancelled';

export interface Project {
  id: string;
  request_code: string; // Format: NSK-2026-00001
  customer_id?: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  company_name?: string;
  service_id?: string;
  service_slug: string;
  service_title: string;
  project_title: string;
  description: string;
  required_features: string[];
  budget_range: string;
  preferred_deadline: string;
  reference_website?: string;
  status: ProjectStatus;
  progress_percentage: number;
  assigned_employee_id?: string;
  assigned_to?: string;
  internal_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectStatusHistoryItem {
  id: string;
  project_id: string;
  status: ProjectStatus;
  notes?: string;
  changed_by_name?: string;
  created_at: string;
}

export interface QuotationLineItem {
  id: string;
  name: string;
  desc?: string;
  amount: number;
}

export interface Quotation {
  id: string;
  project_id: string;
  quote_number: string;
  line_items: QuotationLineItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total_amount: number;
  currency: string;
  payment_terms: string;
  valid_until: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  client_response_notes?: string;
  created_at: string;
  updated_at?: string;
}

export interface Payment {
  id: string;
  project_id: string;
  quotation_id?: string;
  invoice_number: string;
  amount: number;
  currency: string;
  status: 'unpaid' | 'pending' | 'paid' | 'failed' | 'refunded';
  transaction_ref?: string;
  payment_method?: string;
  payment_date?: string;
  created_at: string;
}

export interface Message {
  id: string;
  project_id: string;
  sender_id?: string;
  sender_name: string;
  sender_role: 'customer' | 'employee' | 'admin' | 'system';
  message: string;
  attachments?: { name: string; url: string; size: string }[];
  is_read: boolean;
  created_at: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  uploader_id?: string;
  uploader_name: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  category: 'client_upload' | 'deliverable' | 'quotation_doc' | 'contract';
  created_at: string;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'in_progress' | 'resolved';
  admin_notes?: string;
  created_at: string;
}

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSettings {
  agency_name: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  business_hours: string;
  notification_email: string;
}
