export interface ListIncentivesParams {
  employment_id?: string;
  status?: string;
  recurring_incentive_id?: string;
  page?: number;
  page_size?: number;
}

export interface Incentive {
  amount: number;
  amount_tax_type: string;
  effective_date: string | null;
  employment_id: string;
  expected_payout_date: string | null;
  id: string;
  note: string | null;
  recurring_incentive_id: string | null;
  status: string;
  type: string;
}

export interface ListIncentivesResponse {
  current_page: number;
  incentives: Incentive[];
  total_count: number;
  total_pages: number;
}
