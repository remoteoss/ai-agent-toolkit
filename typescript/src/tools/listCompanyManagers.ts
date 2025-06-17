import { z } from 'zod';
import type { Context } from '../shared/configuration';
import type { Tool, ToolFactory } from '../shared/tools';
import type {
  ListCompanyManagersParams,
  ListCompanyManagersResponse,
} from '../client/companyManager.types';
import type { ApiClient } from '../client/api.client';

export const listCompanyManagersPrompt: string = `
This tool lists company managers (approvers) from the Remote API.
You can optionally filter by company_id, and supports pagination.
`;

export const listCompanyManagersParameters = (_context?: Context) =>
  z.object({
    company_id: z.string().optional().describe('Filter by company ID.'),
    page: z
      .number()
      .int()
      .positive()
      .optional()
      .describe('Page number for pagination (>= 1).'),
    page_size: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe('Number of items per page (1-100).'),
  });

export const listCompanyManagers = async (
  apiClient: ApiClient,
  _context: Context,
  params: z.infer<ReturnType<typeof listCompanyManagersParameters>>,
): Promise<ListCompanyManagersResponse | string> => {
  try {
    const managersResp = await apiClient.listCompanyManagers(
      params as ListCompanyManagersParams,
    );
    return managersResp;
  } catch (error) {
    console.error('Failed to list company managers:', error);
    if (error instanceof Error) {
      return `Failed to list company managers: ${error.message}`;
    }
    return 'Failed to list company managers due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'list_company_managers',
  name: 'List Company Managers',
  description: listCompanyManagersPrompt,
  parameters: listCompanyManagersParameters(context),
  execute: listCompanyManagers,
});

export default toolFactory;
