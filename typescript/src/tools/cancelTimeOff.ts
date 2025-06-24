import { z } from 'zod';
import type { Context } from '../shared/configuration';
import type { Tool, ToolFactory } from '../shared/tools';
import type { TimeOffActionResponse } from '../client/timeoff.types';
import type { ApiClient } from '../client/api.client';

export const cancelTimeOffPrompt: string = `
This tool cancels a Time Off request by its ID in the Remote API.
`;

export const cancelTimeOffParameters = (_context?: Context) =>
  z.object({
    id: z
      .string()
      .describe('The UUID of the time off to cancel. Use list_time_off to get the UUID.'),
    cancel_reason: z.string().describe('The reason for cancelling the time off.'),
  });

export const cancelTimeOff = async (
  apiClient: ApiClient,
  _context: Context,
  params: any,
): Promise<TimeOffActionResponse | string> => {
  try {
    const result = await apiClient.cancelTimeOff(params.id, params.cancel_reason);
    return result;
  } catch (error) {
    console.error('Failed to cancel time off:', error);
    if (error instanceof Error) {
      return `Failed to cancel time off: ${error.message}`;
    }
    return 'Failed to cancel time off due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'cancel_time_off',
  name: 'Cancel Time Off',
  description: cancelTimeOffPrompt,
  parameters: cancelTimeOffParameters(context),
  execute: cancelTimeOff,
});

export default toolFactory;
