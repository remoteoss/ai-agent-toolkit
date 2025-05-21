import { z } from "zod";
import type { Context } from "../shared/configuration";
import type { Tool, ToolFactory } from "../shared/tools";
import type {
  CreateExpenseParams,
  CreateExpenseResponse,
} from "../client/expense.types";
import { ExpenseCategory } from "../client/expense.types";
import type { ApiClient } from "../client/api.client";

export const createExpensePrompt: string = `
This tool creates an approved expense in the Remote API.
The amount is expected to be in cents, confirm this with the user if unclear.
`;

const receiptSchema = z.object({
  content: z.string().describe("Base64 encoded file content."),
  name: z.string().describe("File name."),
});

export const createExpenseParameters = (_context?: Context) =>
  z.object({
    expense_date: z
      .string()
      .describe("Date of the purchase, must be in the past (YYYY-MM-DD)."),
    title: z.string().describe("Title of the expense."),
    amount: z
      .number()
      .describe(
        "Amount of the expense in the specified currency. The amount is in cents."
      ),
    currency: z
      .string()
      .describe("Three-letter code for the expense currency (e.g., USD, EUR)."),
    category: z
      .nativeEnum(ExpenseCategory)
      .describe("Category of the expense."),
    employment_id: z
      .string()
      .describe("The uuid of the employment to which this expense relates."),
    tax_amount: z.number().optional().describe("Tax amount for the expense."),
    receipt: receiptSchema
      .optional()
      .describe(
        "A single receipt file (base64 encoded). Cannot be used with receipts."
      ),
    receipts: z
      .array(receiptSchema)
      .max(5)
      .optional()
      .describe(
        "An array of up to 5 receipt files (base64 encoded). Cannot be used with receipt."
      ),
    reviewed_at: z
      .string()
      .optional()
      .describe("The date and time the expense was reviewed (ISO8601)."),
    reviewer_id: z
      .string()
      .optional()
      .describe(
        "User ID of the reviewer. If not provided, the user who created the token will be used."
      ),
    timezone: z.string().optional().describe("Timezone for the expense dates."),
  });

export const createExpense = async (
  apiClient: ApiClient,
  _context: Context,
  params: any
): Promise<CreateExpenseResponse | string> => {
  try {
    const result = await apiClient.createExpense(params as CreateExpenseParams);
    return result;
  } catch (error) {
    console.error("Failed to create expense:", error);
    if (error instanceof Error) {
      return `Failed to create expense: ${error.message}`;
    }
    return "Failed to create expense due to an unexpected error.";
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: "create_expense",
  name: "Create Expense",
  description: createExpensePrompt,
  parameters: createExpenseParameters(context),
  execute: createExpense,
});

export default toolFactory;
