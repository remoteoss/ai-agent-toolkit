import { z } from 'zod';
import type { Context } from '../../shared/configuration';
import type { Tool, ToolFactory } from '../../shared/tools';
import type {
  GetBillingDocumentBreakdownParams,
  GetBillingDocumentBreakdownResponse,
} from '../../client/billing.types';
import type { ApiClient } from '../../client/api.client';

export const getBillingDocumentBreakdownPrompt: string = `
This tool fetches the breakdown of a billing document by its ID from the Remote API.

It takes the following parameters:
- billing_document_id: The ID of the billing document to get the breakdown for.
- type: Filters the results by the type of the billing breakdown item.

It returns the following data:
- billing_document_breakdown: The detailed breakdown of the billing document.
`;

export const getBillingDocumentBreakdownParameters = (
  _context?: Context,
): z.ZodObject<{
  billing_document_id: z.ZodString;
}> =>
  z.object({
    billing_document_id: z
      .string()
      .min(1, 'Billing document ID cannot be empty')
      .describe(`The billing document's ID`),
    type: z.string().describe('Filters the results by the type of the billing breakdown item.'),
  });

export const getBillingDocumentBreakdown = async (
  apiClient: ApiClient,
  _context: Context,
  params: { [x: string]: any },
): Promise<GetBillingDocumentBreakdownResponse | string> => {
  try {
    const { billing_document_id, type } = params;
    const billingDocumentBreakdownData = await apiClient.getBillingDocumentBreakdown(
      billing_document_id,
      { type } as GetBillingDocumentBreakdownParams,
    );
    return billingDocumentBreakdownData;
  } catch (error) {
    console.error('Failed to get billing document breakdown:', error);
    if (error instanceof Error) {
      return `Failed to get billing document breakdown: ${error.message}`;
    }
    return 'Failed to get billing document breakdown due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'get_billing_document_breakdown',
  name: 'Get Billing Document Breakdown',
  description: getBillingDocumentBreakdownPrompt,
  parameters: getBillingDocumentBreakdownParameters(context),
  execute: getBillingDocumentBreakdown,
});

export default toolFactory;
