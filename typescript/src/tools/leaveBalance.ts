import { z } from 'zod';
import type { Context } from '../shared/configuration';
import type { Tool, ToolFactory } from '../shared/tools';
import type { ListLeavePoliciesSummaryResponse } from '../client/timeoff.types';
import type { ApiClient } from '../client/api.client';

export const leaveBalancePrompt: string = `
This tool lists all leave policy balances for a given employment from the Remote API.
It returns a summary of all leave policies and their balances for the specified employment_id.
`;

export const leaveBalanceParameters = (_context?: Context) =>
  z.object({
    employment_id: z
      .string()
      .describe(
        'The employment ID to fetch leave balances for. Must be a valid employment ID from the list_employments tool, in UUID format.',
      ),
  });

export const leaveBalance = async (
  apiClient: ApiClient,
  _context: Context,
  params: any,
): Promise<ListLeavePoliciesSummaryResponse | string> => {
  try {
    const { employment_id } = params as { employment_id: string };
    const result = await apiClient.getLeavePoliciesSummary(employment_id);
    return result;
  } catch (error) {
    console.error('Failed to fetch leave balances:', error);
    if (error instanceof Error) {
      return `Failed to fetch leave balances: ${error.message}`;
    }
    return 'Failed to fetch leave balances due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'list_leave_balances',
  name: 'List Leave Balances',
  description: leaveBalancePrompt,
  parameters: leaveBalanceParameters(context),
  execute: leaveBalance,
});

export default toolFactory;
