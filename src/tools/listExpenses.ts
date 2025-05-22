import { z } from "zod";
import type { Context } from "../shared/configuration";
import type { Tool, ToolFactory } from "../shared/tools";
import type {
  ListExpensesParams,
  ListExpensesResponse,
} from "../client/expense.types";
import type { ApiClient } from "../client/api.client";

export const listExpensesPrompt: string = `
This tool lists Expense records from the Remote API.  It can be used to get the expenses that requires action from the user (to approve or reject pending expense requests). Declined or Approved expenses do not require action from the user.
It supports pagination.
The amount is in cents, take that into account when returning the result, {"amount": 1000, "currency": "USD"} means 10 dollars.
`;

export const listExpensesParameters = (_context?: Context) =>
  z.object({
    page: z
      .number()
      .optional()
      .describe("Starts fetching records after the given page."),
    page_size: z
      .number()
      .optional()
      .describe(
        "Change the amount of records returned per page, defaults to 20, limited to 100.",
      ),
  });

export const listExpenses = async (
  apiClient: ApiClient,
  _context: Context,
  params: z.infer<ReturnType<typeof listExpensesParameters>>,
): Promise<ListExpensesResponse | string> => {
  try {
    const expenses = await apiClient.listExpenses(params as ListExpensesParams);
    return expenses;
  } catch (error) {
    console.error("Failed to list expenses:", error);
    if (error instanceof Error) {
      return `Failed to list expenses: ${error.message}`;
    }
    return "Failed to list expenses due to an unexpected error.";
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: "list_expenses",
  name: "List Expenses",
  description: listExpensesPrompt,
  parameters: listExpensesParameters(context),
  execute: listExpenses,
});

export default toolFactory;
