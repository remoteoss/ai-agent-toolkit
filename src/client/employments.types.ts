type IncompleteEmploymentStatus =
  | "created"
  | "created_awaiting_reserve"
  | "created_reserve_paid"
  | "initiated"
  | "pending"
  | "invited"
  | "review"
  | "pre_hire"
  | "job_title_review";
type OffboardedEmploymentStatus = "archived" | "deleted";
export type EmploymentStatus =
  | "active"
  | IncompleteEmploymentStatus
  | OffboardedEmploymentStatus;

export type EmploymentType =
  | "contractor"
  | "direct_employee"
  | "employee"
  | "global_payroll_employee";
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
