// Types for Timesheet endpoints, generated from OpenAPI

export interface ListTimesheetsParams {
  status?: TimesheetStatus;
  order?: 'asc' | 'desc';
  sort_by?: 'submitted_at';
  page?: number;
  page_size?: number;
}

export enum TimesheetStatus {
  SUBMITTED = 'submitted',
  APPROVED = 'approved',
  SENT_BACK = 'sent_back',
  DRAFT = 'draft',
}

export interface HoursAndMinutes {
  hours: number;
  minutes: number;
}

export interface TimeTracking {
  clock_in: string;
  clock_out: string;
  has_holiday_hours: boolean;
  has_night_hours: boolean;
  has_weekend_hours: boolean;
  holiday_hours: HoursAndMinutes;
  night_hours: HoursAndMinutes;
  notes: string;
  time_breakdown: {
    day: {
      holiday: HoursAndMinutes;
      regular: HoursAndMinutes;
      weekend: HoursAndMinutes;
    };
    night: {
      holiday: HoursAndMinutes;
      regular: HoursAndMinutes;
      weekend: HoursAndMinutes;
    };
  };
  timezone: string;
  total_hours: HoursAndMinutes;
  type: string;
  weekend_hours: HoursAndMinutes;
}

export interface Timesheet {
  id: string;
  employment_id: string;
  start_date: string;
  end_date: string;
  status: TimesheetStatus;
  country_code: string;
  submitted_at: string;
  approval_required: boolean;
  notes?: string | null;
  regular_hours: HoursAndMinutes;
  total_hours: HoursAndMinutes;
  break_hours: HoursAndMinutes;
  unpaid_break_hours: HoursAndMinutes;
  overtime_hours: HoursAndMinutes;
  holiday_hours: HoursAndMinutes;
  weekend_hours: HoursAndMinutes;
  night_hours: HoursAndMinutes;
  on_call_hours: HoursAndMinutes;
  time_trackings: TimeTracking[];
}

export interface ListTimesheetsResponse {
  data: {
    current_page: number;
    timesheets: Timesheet[];
    total_count: number;
    total_pages: number;
  };
}

export interface GetTimesheetResponse {
  timesheet: Timesheet;
}

export interface ApproveTimesheetResponse {
  timesheet: Timesheet;
}

export interface SendBackTimesheetParams {
  sent_back_reason: string;
}

export interface SentBackTimesheetResponse {
  timesheet: Timesheet;
  sent_back_reason: string;
}
