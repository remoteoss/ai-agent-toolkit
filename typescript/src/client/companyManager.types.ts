export interface CompanyManager {
  userId: string;
  userName: string;
  userEmail: string;
  role: string;
}

export interface ListCompanyManagersParams {
  company_id?: string;
  page?: number;
  page_size?: number;
}

export interface ListCompanyManagersResponse {
  data: {
    company_managers: CompanyManager[];
    current_page: number;
    total_count: number;
    total_pages: number;
  };
}
