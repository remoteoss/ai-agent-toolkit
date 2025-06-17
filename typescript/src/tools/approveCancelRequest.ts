import { z } from 'zod';
import type { Context } from '../shared/configuration';
import type { Tool, ToolFactory } from '../shared/tools';
import type { TimeOffActionResponse } from '../client/timeoff.types';
import type { ApiClient } from '../client/api.client';

export const approveCancelRequestPrompt: string = `
This tool approves a cancellation request for a Time Off by its ID in the Remote API.
`;

export const approveCancelRequestParameters = (_context?: Context) =>
  z.object({
    id: z
      .string()
      .describe('The ID of the time off to approve cancellation for.'),
  });

export const approveCancelRequest = async (
  apiClient: ApiClient,
  _context: Context,
  params: any,
): Promise<TimeOffActionResponse | string> => {
  try {
    const result = await apiClient.approveCancelRequest(params.id);
    return result;
  } catch (error) {
    console.error('Failed to approve cancellation request:', error);
    if (error instanceof Error) {
      return `Failed to approve cancellation request: ${error.message}`;
    }
    return 'Failed to approve cancellation request due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'approve_cancel_request',
  name: 'Approve Cancel Request',
  description: approveCancelRequestPrompt,
  parameters: approveCancelRequestParameters(context),
  execute: approveCancelRequest,
});

export default toolFactory;
