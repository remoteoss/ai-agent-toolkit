import { z } from 'zod';
import type { ApiClient } from '../client/api.client';
import type {
  DeclineTimeOffParams,
  TimeOffActionResponse,
} from '../client/timeoff.types';
import type { Context } from '../shared/configuration';
import type { Tool, ToolFactory } from '../shared/tools';

export const declineTimeOffPrompt: string = `
This tool declines a Time Off request by its ID in the Remote API.
`;

export const declineTimeOffParameters = (_context?: Context) =>
  z.object({
    id: z.string().describe('The ID of the time off to decline.'),
    decline_reason: z
      .string()
      .describe('The reason for declining the time off.'),
  });

export const declineTimeOff = async (
  apiClient: ApiClient,
  _context: Context,
  params: any,
): Promise<TimeOffActionResponse | string> => {
  try {
    const result = await apiClient.declineTimeOff(
      params as DeclineTimeOffParams,
    );
    return result;
  } catch (error) {
    console.error('Failed to decline time off:', error);
    if (error instanceof Error) {
      return `Failed to decline time off: ${error.message}`;
    }
    return 'Failed to decline time off due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'decline_time_off',
  name: 'Decline Time Off',
  description: declineTimeOffPrompt,
  parameters: declineTimeOffParameters(context),
  execute: declineTimeOff,
});

export default toolFactory;
