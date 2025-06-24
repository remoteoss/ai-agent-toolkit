import { z } from 'zod';
import type { Context } from '../shared/configuration';
import type { Tool, ToolFactory } from '../shared/tools';
import type { ListPayrollRunsParams, ListPayrollRunsResponse } from '../client/payroll.types';
import type { ApiClient } from '../client/api.client';

export const listPayrollRunsPrompt: string = `
This tool lists all payroll runs for a company from the Remote API.
It supports pagination.
`;

export const listPayrollRunsParameters = (
  _context?: Context,
): z.ZodObject<{
  payroll_period: z.ZodOptional<z.ZodString>;
  page: z.ZodOptional<z.ZodNumber>;
  page_size: z.ZodOptional<z.ZodNumber>;
}> =>
  z.object({
    payroll_period: z
      .string()
      .optional()
      .describe('The payroll period to fetch. Must be in YYYY-MM-DD format.'),
    page: z.number().int().positive().optional().describe('Page number for pagination (>= 1).'),
    page_size: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe('Number of items per page (1-100).'),
  });

export const listPayrollRuns = async (
  apiClient: ApiClient,
  _context: Context,
  params: z.infer<ReturnType<typeof listPayrollRunsParameters>>,
): Promise<ListPayrollRunsResponse | string> => {
  try {
    const payrollRunsData = await apiClient.listPayrollRuns(params as ListPayrollRunsParams);
    return payrollRunsData;
  } catch (error) {
    console.error('Failed to list payroll runs:', error);
    if (error instanceof Error) {
      return `Failed to list payroll runs: ${error.message}`;
    }
    return 'Failed to list payroll runs due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'list_payroll_runs',
  name: 'List Payroll Runs',
  description: listPayrollRunsPrompt,
  parameters: listPayrollRunsParameters(context),
  execute: listPayrollRuns,
});

export default toolFactory;
