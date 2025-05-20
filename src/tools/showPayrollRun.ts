import { z } from 'zod';
import type { Context } from '../shared/configuration';
import type { Tool, ToolFactory } from '../shared/tools';
import type { ShowPayrollRunParams, ShowPayrollRunResponse } from '../client/payroll.types';
import type { ApiClient } from '../client/api.client';

export const showPayrollRunPrompt: string = `
This tool fetches a single payroll run by its ID from the Remote API.
`;

export const showPayrollRunParameters = (
  _context?: Context
): z.ZodObject<{
  payroll_run_id: z.ZodString;
}> =>
  z.object({
    payroll_run_id: z.string().describe('The ID of the payroll run to fetch.'),
  });

export const showPayrollRun = async (
  apiClient: ApiClient,
  _context: Context,
  params: { [x: string]: any; }
): Promise<ShowPayrollRunResponse | string> => {
  try {
    const payrollRun = await apiClient.showPayrollRun(params as ShowPayrollRunParams);
    return payrollRun;
  } catch (error) {
    console.error('Failed to fetch payroll run:', error);
    if (error instanceof Error) {
      return `Failed to fetch payroll run: ${error.message}`;
    }
    return 'Failed to fetch payroll run due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'show_payroll_run',
  name: 'Show Payroll Run',
  description: showPayrollRunPrompt,
  parameters: showPayrollRunParameters(context),
  execute: showPayrollRun,
});

export default toolFactory;
