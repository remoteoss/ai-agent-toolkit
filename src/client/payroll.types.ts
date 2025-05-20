import { z } from 'zod';

// Params for listing payroll runs
export const ListPayrollRunsParamsSchema = z.object({
  page: z.number().int().positive().optional().describe('Page number for pagination (>= 1).'),
  page_size: z.number().int().min(1).max(100).optional().describe('Number of items per page (1-100).'),
});

export type ListPayrollRunsParams = z.infer<typeof ListPayrollRunsParamsSchema>;

export interface PayrollRun {
  id: string;
  status: string;
  period_start: string;
  period_end: string;
  processed_at?: string;
}

export interface ListPayrollRunsResponse {
  payroll_runs: PayrollRun[];
  page: number;
  page_size: number;
  total_count: number;
}

// Params for showing a single payroll run
export const ShowPayrollRunParamsSchema = z.object({
  payroll_run_id: z.string().describe('The ID of the payroll run to fetch.'),
});

export type ShowPayrollRunParams = z.infer<typeof ShowPayrollRunParamsSchema>;

// Response for showing a single payroll run
export type ShowPayrollRunResponse = PayrollRun;
