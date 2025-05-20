export interface ListTimeOffParams {
  employment_id?: string;
  timeoff_type?: string;
  status?: string;
  page?: number;
  page_size?: number;
}

export interface TimeOffDocument {
  id: string;
  inserted_at: string;
  name: string;
  sub_type: string;
  type: string;
}

export interface TimeOffLeavePolicy {
  leave_policy_variant_slug: string;
  leave_type: string;
  name: string;
}

export interface TimeOffDayEntry {
  day: string; // Date string
  hours: number;
}

export interface TimeOffEntry {
  id: string;
  employment_id: string;
  start_date: string; // Date string
  end_date: string; // Date string
  status: string;
  timeoff_type: string;
  timezone: string;
  notes?: string | null;
  approved_at?: string | null; // DateTime string
  approver_id?: string | null;
  automatic: boolean;
  cancel_reason?: string | null;
  cancelled_at?: string | null; // DateTime string
  document?: TimeOffDocument | null;
  leave_policy: TimeOffLeavePolicy;
  timeoff_days: TimeOffDayEntry[];
}

export interface ListTimeOffResponse {
  current_page: number;
  timeoffs: TimeOffEntry[];
  total_count: number;
  total_pages: number;
} 