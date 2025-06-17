import { z } from 'zod';
import type { Context } from '../shared/configuration';
import type { Tool, ToolFactory } from '../shared/tools';
import type { ListLeavePoliciesDetailsResponse } from '../client/timeoff.types';
import type { ApiClient } from '../client/api.client';

export const leavePoliciesDetailsPrompt: string = `
This tool lists all leave policy details for a given employment from the Remote API.
It returns a list of leave policies (custom or not) for the specified employment_id.
`;

export const leavePoliciesDetailsParameters = (_context?: Context) =>
  z.object({
    employment_id: z
      .string()
      .describe(
        'The employment ID to fetch leave policy details for. Must be a valid employment ID from the list_employments tool, in UUID format.',
      ),
  });

export const leavePoliciesDetails = async (
  apiClient: ApiClient,
  _context: Context,
  params: any,
): Promise<ListLeavePoliciesDetailsResponse | string> => {
  try {
    const { employment_id } = params as { employment_id: string };
    const result = await apiClient.getLeavePoliciesDetails(employment_id);
    return result;
  } catch (error) {
    console.error('Failed to fetch leave policy details:', error);
    if (error instanceof Error) {
      return `Failed to fetch leave policy details: ${error.message}`;
    }
    return 'Failed to fetch leave policy details due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'list_leave_policies_details',
  name: 'List Leave Policies Details',
  description: leavePoliciesDetailsPrompt,
  parameters: leavePoliciesDetailsParameters(context),
  execute: leavePoliciesDetails,
});

export default toolFactory;
