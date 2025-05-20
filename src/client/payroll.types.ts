import { z } from 'zod';

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
