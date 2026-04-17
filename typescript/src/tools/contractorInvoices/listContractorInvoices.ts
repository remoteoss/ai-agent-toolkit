import { z } from 'zod';
import type { Context } from '../../shared/configuration';
import type { Tool, ToolFactory } from '../../shared/tools';
import type {
  ListContractorInvoicesParams,
  ListContractorInvoicesResponse,
} from '../../client/contractorInvoice.types';
import type { ApiClient } from '../../client/api.client';

export const listContractorInvoicesPrompt: string = `
This tool lists contractor invoices from the Remote API.

It takes the following parameters:
- status: Filter by invoice status (e.g. issued, paid_out, rejected).
- date_from / date_to: Filter by invoice issuance date range (YYYY-MM-DD).
- due_date_from / due_date_to: Filter by due date range (YYYY-MM-DD).
- approved_date_from / approved_date_to: Filter by approval date range (YYYY-MM-DD).
- paid_out_date_from / paid_out_date_to: Filter by paid out date range (YYYY-MM-DD).
- sort_by: Sort results by date, due_date, approved_at, or paid_out_at.
- order: Sort order (asc or desc).
- page: Page number (>= 1).
- page_size: Number of items per page (1-100), defaults to 20.
`;

const CONTRACTOR_INVOICE_STATUSES = [
  'issued',
  'pending_payment',
  'paid_out',
  'pay_out_failed',
  'rejected',
  'rejected_by_remote',
  'funds_returned',
  'externally_paid',
  'manual_payout',
  'blocked',
  'enqueued',
  'in_review',
  'processing',
] as const;

export const listContractorInvoicesParameters = (
  _context?: Context,
): z.ZodObject<{
  status: z.ZodOptional<z.ZodEnum<[string, ...string[]]>>;
  date_from: z.ZodOptional<z.ZodString>;
  date_to: z.ZodOptional<z.ZodString>;
  due_date_from: z.ZodOptional<z.ZodString>;
  due_date_to: z.ZodOptional<z.ZodString>;
  approved_date_from: z.ZodOptional<z.ZodString>;
  approved_date_to: z.ZodOptional<z.ZodString>;
  paid_out_date_from: z.ZodOptional<z.ZodString>;
  paid_out_date_to: z.ZodOptional<z.ZodString>;
  sort_by: z.ZodOptional<z.ZodEnum<['date', 'due_date', 'approved_at', 'paid_out_at']>>;
  order: z.ZodOptional<z.ZodEnum<['asc', 'desc']>>;
  page: z.ZodOptional<z.ZodNumber>;
  page_size: z.ZodOptional<z.ZodNumber>;
}> =>
  z.object({
    status: z
      .enum(CONTRACTOR_INVOICE_STATUSES)
      .optional()
      .describe('Filter by invoice status.'),
    date_from: z
      .string()
      .optional()
      .describe('Filter by invoice issuance start date (YYYY-MM-DD).'),
    date_to: z
      .string()
      .optional()
      .describe('Filter by invoice issuance end date (YYYY-MM-DD).'),
    due_date_from: z.string().optional().describe('Filter by due date start (YYYY-MM-DD).'),
    due_date_to: z.string().optional().describe('Filter by due date end (YYYY-MM-DD).'),
    approved_date_from: z
      .string()
      .optional()
      .describe('Filter by approval start date (YYYY-MM-DD).'),
    approved_date_to: z
      .string()
      .optional()
      .describe('Filter by approval end date (YYYY-MM-DD).'),
    paid_out_date_from: z
      .string()
      .optional()
      .describe('Filter by paid out start date (YYYY-MM-DD).'),
    paid_out_date_to: z
      .string()
      .optional()
      .describe('Filter by paid out end date (YYYY-MM-DD).'),
    sort_by: z
      .enum(['date', 'due_date', 'approved_at', 'paid_out_at'])
      .optional()
      .describe('Sort results by field.'),
    order: z.enum(['asc', 'desc']).optional().describe('Sort order (asc or desc).'),
    page: z
      .number()
      .int()
      .positive()
      .optional()
      .describe('Page number (>= 1).'),
    page_size: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe('Number of items per page (1-100), defaults to 20.'),
  });

export const listContractorInvoices = async (
  apiClient: ApiClient,
  _context: Context,
  params: z.infer<ReturnType<typeof listContractorInvoicesParameters>>,
): Promise<ListContractorInvoicesResponse | string> => {
  try {
    const data = await apiClient.listContractorInvoices(params as ListContractorInvoicesParams);
    return data;
  } catch (error) {
    console.error('Failed to list contractor invoices:', error);
    if (error instanceof Error) {
      return `Failed to list contractor invoices: ${error.message}`;
    }
    return 'Failed to list contractor invoices due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'list_contractor_invoices',
  name: 'List Contractor Invoices',
  description: listContractorInvoicesPrompt,
  parameters: listContractorInvoicesParameters(context),
  execute: listContractorInvoices,
});

export default toolFactory;
