import { z } from 'zod';
import type { Context } from '../shared/configuration';
import type { Tool, ToolFactory } from '../shared/tools';
import type { ListEmploymentsParams, ListEmploymentsResponse } from '../client/employments.types';
import { employmentStatus, employmentType } from '../client/employments.types';
import type { ApiClient } from '../client/api.client';

export const listEmploymentsPrompt: string = `
This tool lists all employments from the Remote API, except for deleted ones.
It supports pagination. Note that the response includes country-specific data,
where the exact fields will vary depending on which country the employment is in.
`;

export const listEmploymentsParameters = (
  _context?: Context,
): z.ZodObject<{
  company_id: z.ZodOptional<z.ZodString>;
  email: z.ZodOptional<z.ZodString>;
  status: z.ZodOptional<z.ZodNativeEnum<typeof employmentStatus>>;
  employment_type: z.ZodOptional<z.ZodNativeEnum<typeof employmentType>>;
  page: z.ZodOptional<z.ZodNumber>;
  page_size: z.ZodOptional<z.ZodNumber>;
}> =>
  z.object({
    company_id: z.string().optional().describe('Company ID to filter by.'),
    email: z.string().optional().describe('Email to filter by.'),
    status: z.nativeEnum(employmentStatus).optional().describe('Status to filter by.'),
    employment_type: z
      .nativeEnum(employmentType)
      .optional()
      .describe('Employment type to filter by.'),
    page: z.number().int().positive().optional().describe('Page number for pagination (>= 1).'),
    page_size: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe('Number of items per page (1-100).'),
  });

export const listEmployments = async (
  apiClient: ApiClient,
  _context: Context,
  params: z.infer<ReturnType<typeof listEmploymentsParameters>>,
): Promise<ListEmploymentsResponse | string> => {
  try {
    const employmentsData = await apiClient.listEmployments(params as ListEmploymentsParams);
    return employmentsData;
  } catch (error) {
    console.error('Failed to list employments:', error);
    if (error instanceof Error) {
      return `Failed to list employments: ${error.message}`;
    }
    return 'Failed to list employments due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'list_employments',
  name: 'List Employments',
  description: listEmploymentsPrompt,
  parameters: listEmploymentsParameters(context),
  execute: listEmployments,
});

export default toolFactory;
