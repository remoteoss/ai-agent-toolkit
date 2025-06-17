import { z } from 'zod';
import type { Context } from '../shared/configuration';
import type { Tool, ToolFactory } from '../shared/tools';
import type { ListTimeOffTypesResponse } from '../client/timeoff.types';
import type { ApiClient } from '../client/api.client';

export const listTimeOffTypesPrompt: string = `
This tool lists all available time off types from the Remote API.
`;

export const listTimeOffTypesParameters = (_context?: Context) => z.object({});

export const listTimeOffTypes = async (
  apiClient: ApiClient,
  _context: Context,
  _params: any,
): Promise<ListTimeOffTypesResponse | string> => {
  try {
    const result = await apiClient.listTimeOffTypes();
    return result;
  } catch (error) {
    console.error('Failed to list time off types:', error);
    if (error instanceof Error) {
      return `Failed to list time off types: ${error.message}`;
    }
    return 'Failed to list time off types due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'list_time_off_types',
  name: 'List Time Off Types',
  description: listTimeOffTypesPrompt,
  parameters: listTimeOffTypesParameters(context),
  execute: listTimeOffTypes,
});

export default toolFactory;
