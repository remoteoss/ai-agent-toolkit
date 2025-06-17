type IncompleteEmploymentStatus =
  | 'created'
  | 'created_awaiting_reserve'
  | 'created_reserve_paid'
  | 'initiated'
  | 'pending'
  | 'invited'
  | 'review'
  | 'pre_hire'
  | 'job_title_review';
type OffboardedEmploymentStatus = 'archived' | 'deleted';

export type EmploymentStatus =
  | 'active'
  | IncompleteEmploymentStatus
  | OffboardedEmploymentStatus;

export const employmentStatus: Record<string, EmploymentStatus> = {
  ACTIVE: 'active',
  CREATED: 'created',
  CREATED_AWAITING_RESERVE: 'created_awaiting_reserve',
  CREATED_RESERVE_PAID: 'created_reserve_paid',
  INITIATED: 'initiated',
  PENDING: 'pending',
  INVITED: 'invited',
  REVIEW: 'review',
  PRE_HIRE: 'pre_hire',
  JOB_TITLE_REVIEW: 'job_title_review',
  ARCHIVED: 'archived',
  DELETED: 'deleted',
} as const;

export type EmploymentType =
  | 'contractor'
  | 'direct_employee'
  | 'employee'
  | 'global_payroll_employee';

export const employmentType: Record<string, EmploymentType> = {
  CONTRACTOR: 'contractor',
  DIRECT_EMPLOYEE: 'direct_employee',
  EMPLOYEE: 'employee',
  GLOBAL_PAYROLL_EMPLOYEE: 'global_payroll_employee',
} as const;
export interface ListEmploymentsParams {
  company_id?: string;
  email?: string;
  status?: EmploymentStatus;
  employment_type?: EmploymentType;
  page?: number;
  page_size?: number;
}

export interface Employment {
  id: string;
  company_id: string;
  user_id: string;
  status: string;
  job_title: string;
  department?: string;
  employment_type: string;
  start_date: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
  // Note: Additional fields will be country-specific and returned based on the employment's country
}

export interface ListEmploymentsResponse {
  current_page: number;
  employments: Employment[];
  total_count: number;
  total_pages: number;
}

export interface ShowEmploymentParams {
  employment_id: string;
}

export interface ShowEmploymentResponse extends Employment {
  // Note: The response will include all Employment fields plus additional country-specific data
}
