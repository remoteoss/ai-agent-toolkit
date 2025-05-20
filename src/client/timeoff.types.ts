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

export enum TimeOffType {
  PAID_TIME_OFF = "paid_time_off",
  SICK_LEAVE = "sick_leave",
  PUBLIC_HOLIDAY = "public_holiday",
  UNPAID_LEAVE = "unpaid_leave",
  EXTENDED_LEAVE = "extended_leave",
  IN_LIEU_TIME = "in_lieu_time",
  MATERNITY_LEAVE = "maternity_leave",
  PATERNITY_LEAVE = "paternity_leave",
  PARENTAL_LEAVE = "parental_leave",
  BEREAVEMENT = "bereavement",
  MILITARY_LEAVE = "military_leave",
  OTHER = "other",
}

export enum TimeOffStatus {
  APPROVED = "approved",
  CANCELLED = "cancelled",
  DECLINED = "declined",
  REQUESTED = "requested",
  TAKEN = "taken",
  CANCEL_REQUESTED = "cancel_requested",
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
  status: TimeOffStatus;
  timeoff_type: TimeOffType;
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

export interface CreateTimeOffDayEntry {
  day: string; // Date string
  hours: number;
}

export interface TimeOffParams {
  id?: string; // Time off ID to update (for PATCH)
  employment_id: string;
  start_date: string; // Date string
  end_date: string; // Date string
  timeoff_type: TimeOffType;
  timezone: string;
  timeoff_days: CreateTimeOffDayEntry[];
  notes?: string;
  document?: any; // Optional, can be refined
  status?: TimeOffStatus;
  approver_id?: string;
  approved_at?: string; // DateTime string
  edit_reason?: string; // Reason for editing the time off (for updates)
}

export interface UpdateTimeOffResponse {
  timeoff: TimeOffEntry;
}

export interface CreateTimeOffResponse {
  timeoff: TimeOffEntry;
}

export interface GetTimeOffResponse {
  timeoff: TimeOffEntry;
}

export interface DeleteTimeOffResponse {
  success: boolean;
  message?: string;
}

export interface TimeOffActionResponse {
  success: boolean;
  message?: string;
  timeoff?: TimeOffEntry;
}

export interface TimeOffTypeDetail {
  id: string;
  name: string;
  description?: string;
}

export interface ListTimeOffTypesResponse {
  timeoff_types: TimeOffTypeDetail[];
}

export interface TimeOffBalanceResponse {
  employment_id: string;
  balance: number;
  unit: string;
  details?: any;
}
