import { z } from 'zod';
import type { ApiClient } from '../client/api.client';
import type { TimeOffActionResponse } from '../client/timeoff.types';
import type { Context } from '../shared/configuration';
import type { Tool, ToolFactory } from '../shared/tools';

export const declineCancelRequestPrompt: string = `
This tool declines a cancellation request for a Time Off by its ID in the Remote API.
`;

export const declineCancelRequestParameters = (_context?: Context) =>
  z.object({
    id: z.string().describe('The ID of the time off to decline cancellation for.'),
  });

export const declineCancelRequest = async (
  apiClient: ApiClient,
  _context: Context,
  params: any,
): Promise<TimeOffActionResponse | string> => {
  try {
    const result = await apiClient.declineCancelRequest(params.id);
    return result;
  } catch (error) {
    console.error('Failed to decline cancellation request:', error);
    if (error instanceof Error) {
      return `Failed to decline cancellation request: ${error.message}`;
    }
    return 'Failed to decline cancellation request due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'decline_cancel_request',
  name: 'Decline Cancel Request',
  description: declineCancelRequestPrompt,
  parameters: declineCancelRequestParameters(context),
  execute: declineCancelRequest,
});

export default toolFactory;
