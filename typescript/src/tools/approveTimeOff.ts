import { z } from 'zod';
import type { Context } from '../shared/configuration';
import type { Tool, ToolFactory } from '../shared/tools';
import type { TimeOffActionResponse } from '../client/timeoff.types';
import type { ApiClient } from '../client/api.client';

export const approveTimeOffPrompt: string = `
This tool approves a Time Off request by its ID in the Remote API.
`;

export const approveTimeOffParameters = (_context?: Context) =>
  z.object({
    id: z
      .string()
      .describe(
        'The UUID of the time off to approve. Must be in valid UUID format from the listTimeOff tool',
      ),
    approver_id: z
      .string()
      .describe(
        "The UUID of the approver. The approver's user ID. If not provided, use the first company manager from the listCompanyManagers tool.",
      ),
  });

export const approveTimeOff = async (
  apiClient: ApiClient,
  _context: Context,
  params: any,
): Promise<TimeOffActionResponse | string> => {
  try {
    const result = await apiClient.approveTimeOff(params.id, params.approver_id);
    return result;
  } catch (error) {
    console.error('Failed to approve time off:', error);
    if (error instanceof Error) {
      return `Failed to approve time off: ${error.message}`;
    }
    return 'Failed to approve time off due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'approve_time_off',
  name: 'Approve Time Off',
  description: approveTimeOffPrompt,
  parameters: approveTimeOffParameters(context),
  execute: approveTimeOff,
});

export default toolFactory;
