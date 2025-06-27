import { z } from 'zod';
import type { Context } from '../../shared/configuration';
import type { Tool, ToolFactory } from '../../shared/tools';
import type {
  ShowBillingDocumentParams,
  ShowBillingDocumentResponse,
} from '../../client/billing.types';
import type { ApiClient } from '../../client/api.client';

export const showBillingDocumentPrompt: string = `
This tool fetches a single billing document by its ID from the Remote API.

It takes the following parameters:
- billing_document_id: The ID of the billing document to fetch.

It returns the following data:
- billing_document: The billing document details.
`;

export const showBillingDocumentParameters = (
  _context?: Context,
): z.ZodObject<{
  billing_document_id: z.ZodString;
}> =>
  z.object({
    billing_document_id: z
      .string()
      .min(1, 'Billing document ID cannot be empty')
      .describe('The ID of the billing document to fetch.'),
  });

export const showBillingDocument = async (
  apiClient: ApiClient,
  _context: Context,
  params: { [x: string]: any },
): Promise<ShowBillingDocumentResponse | string> => {
  try {
    const billingDocumentData = await apiClient.showBillingDocument(
      params as ShowBillingDocumentParams,
    );
    return billingDocumentData;
  } catch (error) {
    console.error('Failed to show billing document:', error);
    if (error instanceof Error) {
      return `Failed to show billing document: ${error.message}`;
    }
    return 'Failed to show billing document due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'show_billing_document',
  name: 'Show Billing Document',
  description: showBillingDocumentPrompt,
  parameters: showBillingDocumentParameters(context),
  execute: showBillingDocument,
});

export default toolFactory;
