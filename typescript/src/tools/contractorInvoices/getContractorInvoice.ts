import { z } from 'zod';
import type { Context } from '../../shared/configuration';
import type { Tool, ToolFactory } from '../../shared/tools';
import type { GetContractorInvoiceResponse } from '../../client/contractorInvoice.types';
import type { ApiClient } from '../../client/api.client';

export const getContractorInvoicePrompt: string = `
This tool fetches a single contractor invoice by its ID from the Remote API.

It takes the following parameters:
- id: The ID of the contractor invoice to fetch.

It returns the contractor invoice details including line items, amounts, currencies, status, and payment information.
`;

export const getContractorInvoiceParameters = (
  _context?: Context,
): z.ZodObject<{
  id: z.ZodString;
}> =>
  z.object({
    id: z
      .string()
      .min(1, 'Contractor invoice ID cannot be empty')
      .describe('The ID of the contractor invoice to fetch.'),
  });

export const getContractorInvoice = async (
  apiClient: ApiClient,
  _context: Context,
  params: { [x: string]: any },
): Promise<GetContractorInvoiceResponse | string> => {
  try {
    const data = await apiClient.getContractorInvoice(params.id);
    return data;
  } catch (error) {
    console.error('Failed to get contractor invoice:', error);
    if (error instanceof Error) {
      return `Failed to get contractor invoice: ${error.message}`;
    }
    return 'Failed to get contractor invoice due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'get_contractor_invoice',
  name: 'Get Contractor Invoice',
  description: getContractorInvoicePrompt,
  parameters: getContractorInvoiceParameters(context),
  execute: getContractorInvoice,
});

export default toolFactory;
