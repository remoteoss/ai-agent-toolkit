import { z } from "zod";

// This is incomplete, built with Cursor checking our docs.
// TODO: Complete the types
export interface PayrollRun {
  id: string;
  status: string;
  period_start: string;
  period_end: string;
  processed_at?: string;
}

export interface ListPayrollRunsParams {
  payroll_period?: string;
  page?: number;
  page_size?: number;
}

export interface ListPayrollRunsResponse {
  payroll_runs: PayrollRun[];
}

export interface ShowPayrollRunParams {
  payroll_run_id: string;
}

export type ShowPayrollRunResponse = PayrollRun;

// Payslips Types

export interface ListPayslipsParams {
  employment_id?: string;
  start_date?: string; // Filters by payslips issued_at field, after or on the same day
  end_date?: string; // Filters by payslips issued_at field, before or on the same day
  expected_payout_start_date?: string; // Filters by payslips expected_payout_date field, after or on the same day
  expected_payout_end_date?: string; // Filters by payslips expected_payout_date field, before or on the same day
  page?: number;
  page_size?: number;
}

export interface PayslipEntry {
  employment_id: string;
  expected_payout_date: string | null; // API doc says date, example shows string, can be null
  id: string;
  issued_at: string; // API doc says date, example shows string
  net_pay_converted_amount?: number;
  net_pay_source_amount?: number;
}

export interface ListPayslipsResponse {
  current_page: number;
  payslips: PayslipEntry[];
  total_count: number;
  total_pages: number;
}
