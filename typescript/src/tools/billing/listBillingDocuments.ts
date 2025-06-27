import { z } from 'zod';
import type { Context } from '../../shared/configuration';
import type { Tool, ToolFactory } from '../../shared/tools';
import type {
  ListBillingDocumentsParams,
  ListBillingDocumentsResponse,
} from '../../client/billing.types';
import type { ApiClient } from '../../client/api.client';

export const listBillingDocumentsPrompt: string = `
This tool lists billing documents for a company from the Remote API.

It takes the following parameters:
- period: The month for the billing documents (in ISO-8601 format), (YYYY-MM format like "2024-01").
- page: Starts fetching records after the given page (>= 1).
- page_size: Number of items per page (1-100), defaults to 20.
`;

export const listBillingDocumentsParameters = (
  _context?: Context,
): z.ZodObject<{
  period: z.ZodOptional<z.ZodString>;
  page: z.ZodOptional<z.ZodNumber>;
  page_size: z.ZodOptional<z.ZodNumber>;
}> =>
  z.object({
    period: z
      .string()
      .optional()
      .describe(
        'The month for the billing documents (in ISO-8601 format), (YYYY-MM format like "2024-01").',
      ),
    page: z
      .number()
      .int()
      .positive()
      .optional()
      .describe('Starts fetching records after the given page (>= 1).'),
    page_size: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe('Number of items per page (1-100), defaults to 20.'),
  });

export const listBillingDocuments = async (
  apiClient: ApiClient,
  _context: Context,
  params: z.infer<ReturnType<typeof listBillingDocumentsParameters>>,
): Promise<ListBillingDocumentsResponse | string> => {
  try {
    const billingDocumentsData = await apiClient.listBillingDocuments(
      params as ListBillingDocumentsParams,
    );
    return billingDocumentsData;
  } catch (error) {
    console.error('Failed to list billing documents:', error);
    if (error instanceof Error) {
      return `Failed to list billing documents: ${error.message}`;
    }
    return 'Failed to list billing documents due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'list_billing_documents',
  name: 'List Billing Documents',
  description: listBillingDocumentsPrompt,
  parameters: listBillingDocumentsParameters(context),
  execute: listBillingDocuments,
});

export default toolFactory;
