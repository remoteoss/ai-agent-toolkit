import { z } from 'zod';
import type { Context } from '../shared/configuration';
import type { Tool, ToolFactory } from '../shared/tools';
import type {
  UpdateExpenseParams,
  UpdateExpenseResponse,
} from '../client/expense.types';
import type { ApiClient } from '../client/api.client';

export const updateExpensePrompt: string = `
This tool updates an expense (e.g., approve or decline) in the Remote API.
`;

export const updateExpenseParameters = (_context?: Context) =>
  z.object({
    id: z.string().describe('The ID of the expense to update.'),
    status: z
      .enum(['approved', 'declined'])
      .describe('The new status for the expense.'),
    reason: z
      .string()
      .describe(
        'The reason for the status change. Should only be provided if the status is declined.',
      )
      .optional(),
  });

export const updateExpense = async (
  apiClient: ApiClient,
  _context: Context,
  params: any,
): Promise<UpdateExpenseResponse | string> => {
  try {
    const { id, ...rest } = params;
    const result = await apiClient.updateExpense(
      id,
      rest as UpdateExpenseParams,
    );
    return result;
  } catch (error) {
    console.error('Failed to update expense:', error);
    if (error instanceof Error) {
      return `Failed to update expense: ${error.message}`;
    }
    return 'Failed to update expense due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'update_expense',
  name: 'Update Expense',
  description: updateExpensePrompt,
  parameters: updateExpenseParameters(context),
  execute: updateExpense,
});

export default toolFactory;
