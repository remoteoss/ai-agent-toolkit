import { z } from 'zod';
import type { Context } from '../shared/configuration';
import type { Tool, ToolFactory } from '../shared/tools';
import type { ShowEmploymentParams, ShowEmploymentResponse } from '../client/employments.types';
import type { ApiClient } from '../client/api.client';

export const showEmploymentPrompt: string = `
This tool fetches a single employment record by its ID from the Remote API.
It returns detailed information about the employment, including country-specific data
that varies depending on which country the employment is in.
`;

export const showEmploymentParameters = (
  _context?: Context,
): z.ZodObject<{
  employment_id: z.ZodString;
}> =>
  z.object({
    employment_id: z
      .string()
      .describe(
        'The ID of the employment to fetch. Must be a valid employment ID from the list_employments tool, in UUID format.',
      ),
  });

export const showEmployment = async (
  apiClient: ApiClient,
  _context: Context,
  params: { [x: string]: any },
): Promise<ShowEmploymentResponse | string> => {
  try {
    const employmentData = await apiClient.showEmployment(params as ShowEmploymentParams);
    return employmentData;
  } catch (error) {
    console.error('Failed to show employment:', error);
    if (error instanceof Error) {
      return `Failed to show employment: ${error.message}`;
    }
    return 'Failed to show employment due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'show_employment',
  name: 'Show Employment',
  description: showEmploymentPrompt,
  parameters: showEmploymentParameters(context),
  execute: showEmployment,
});

export default toolFactory;
