import { z } from "zod";
import type { Context } from "../shared/configuration";
import type { Tool, ToolFactory } from "../shared/tools";
import type {
  ListPayslipsParams,
  ListPayslipsResponse,
} from "../client/payroll.types";
import type { ApiClient } from "../client/api.client";

export const listPayslipsPrompt: string = `
This tool lists payslips for a company.
You can filter by employment_id, issue date range (start_date, end_date), expected payout date range (expected_payout_start_date, expected_payout_end_date).
Pagination is supported with page and page_size.
`;

export const listPayslipsParameters = (_context?: Context) =>
  z.object({
    employment_id: z
      .string()
      .optional()
      .describe("The ID of the employment to filter payslips for."),
    start_date: z
      .string()
      .optional()
      .describe(
        "Filters by payslips issued_at field, for payslips issued on or after this date (YYYY-MM-DD).",
      ),
    end_date: z
      .string()
      .optional()
      .describe(
        "Filters by payslips issued_at field, for payslips issued on or before this date (YYYY-MM-DD).",
      ),
    expected_payout_start_date: z
      .string()
      .optional()
      .describe(
        "Filters by payslips expected_payout_date field, for payslips expected on or after this date (YYYY-MM-DD).",
      ),
    expected_payout_end_date: z
      .string()
      .optional()
      .describe(
        "Filters by payslips expected_payout_date field, for payslips expected on or before this date (YYYY-MM-DD).",
      ),
    page: z.number().optional().describe("The page number for pagination."),
    page_size: z
      .number()
      .optional()
      .describe(
        "The number of items per page for pagination (defaults to 20, max 100).",
      ),
  });

export const listPayslips = async (
  apiClient: ApiClient,
  _context: Context,
  params: z.infer<ReturnType<typeof listPayslipsParameters>>,
): Promise<ListPayslipsResponse | string> => {
  try {
    const parsedParams = listPayslipsParameters().parse(params);
    const result = await apiClient.listPayslips(
      parsedParams as ListPayslipsParams,
    );
    return result;
  } catch (error) {
    console.error("Failed to list payslips:", error);
    if (error instanceof Error) {
      return `Failed to list payslips: ${error.message}`;
    }
    return "Failed to list payslips due to an unexpected error.";
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: "list_payslips",
  name: "List Payslips",
  description: listPayslipsPrompt,
  parameters: listPayslipsParameters(context),
  execute: listPayslips,
});

export default toolFactory;
