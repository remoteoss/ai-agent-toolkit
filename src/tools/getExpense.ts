import { z } from "zod";
import type { Context } from "../shared/configuration";
import type { Tool, ToolFactory } from "../shared/tools";
import type { GetExpenseResponse } from "../client/expense.types";
import type { ApiClient } from "../client/api.client";

export const getExpensePrompt: string = `
This tool fetches a single expense record by its ID from the Remote API.
The amount is in cents, take that into account when returning the result, {"amount": 1000, "currency": "USD"} means 10 dollars.
`;

export const getExpenseParameters = (_context?: Context) =>
  z.object({
    id: z.string().describe("The ID of the expense to fetch."),
  });

export const getExpense = async (
  apiClient: ApiClient,
  _context: Context,
  params: any,
): Promise<GetExpenseResponse | string> => {
  try {
    const result = await apiClient.getExpense(params.id);
    return result;
  } catch (error) {
    console.error("Failed to fetch expense:", error);
    if (error instanceof Error) {
      return `Failed to fetch expense: ${error.message}`;
    }
    return "Failed to fetch expense due to an unexpected error.";
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: "get_expense",
  name: "Get Expense",
  description: getExpensePrompt,
  parameters: getExpenseParameters(context),
  execute: getExpense,
});

export default toolFactory;
