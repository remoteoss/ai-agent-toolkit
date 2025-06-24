import { z } from 'zod';
import type { Context } from '../shared/configuration';
import type { Tool, ToolFactory } from '../shared/tools';
import type { ListIncentivesParams, ListIncentivesResponse } from '../client/incentives.types';
import type { ApiClient } from '../client/api.client';

export const listIncentivesPrompt: string = `
This tool lists Incentives from the Remote API.
It can be filtered by employment_id, status, recurring_incentive_id, and supports pagination.
`;

export const listIncentivesParameters = (
  _context?: Context,
): z.ZodObject<{
  amount: z.ZodOptional<z.ZodNumber>;
  amount_tax_type: z.ZodOptional<z.ZodString>;
  effective_date: z.ZodOptional<z.ZodString>;
  expected_payout_date: z.ZodOptional<z.ZodString>;
  note: z.ZodOptional<z.ZodString>;
  recurring_incentive_id: z.ZodOptional<z.ZodString>;
  status: z.ZodOptional<z.ZodString>;
  type: z.ZodOptional<z.ZodString>;
  employment_id: z.ZodOptional<z.ZodString>;
  page: z.ZodOptional<z.ZodNumber>;
  page_size: z.ZodOptional<z.ZodNumber>;
}> =>
  z.object({
    amount: z.number().optional().describe('Filter incentives by amount.'),
    amount_tax_type: z.string().optional().describe('Filter incentives by their amount tax type.'),
    effective_date: z.string().optional().describe('Filter incentives by their effective date.'),
    expected_payout_date: z
      .string()
      .optional()
      .describe('Filter incentives by their expected payout date.'),
    note: z.string().optional().describe('Filter incentives by their note.'),
    recurring_incentive_id: z
      .string()
      .optional()
      .describe('Filter incentives by their recurring incentive ID.'),
    status: z.string().optional().describe('Filter incentives by their status.'),
    type: z.string().optional().describe('Filter incentives by their type.'),
    employment_id: z
      .string()
      .optional()
      .describe(
        'Filter incentives for a specific employment ID. Must be a valid employment ID from the list_employments tool.',
      ),
    page: z.number().int().positive().optional().describe('Page number for pagination (>= 1).'),
    page_size: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe('Number of items per page (1-100).'),
  });

export const listIncentives = async (
  apiClient: ApiClient,
  _context: Context,
  params: z.infer<ReturnType<typeof listIncentivesParameters>>,
): Promise<ListIncentivesResponse | string> => {
  try {
    const incentivesData = await apiClient.listIncentives(params as ListIncentivesParams);
    return incentivesData;
  } catch (error) {
    console.error('Failed to list incentives:', error);
    if (error instanceof Error) {
      return `Failed to list incentives: ${error.message}`;
    }
    return 'Failed to list incentives due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'list_incentives',
  name: 'List Incentives',
  description: listIncentivesPrompt,
  parameters: listIncentivesParameters(context),
  execute: listIncentives,
});

export default toolFactory;
