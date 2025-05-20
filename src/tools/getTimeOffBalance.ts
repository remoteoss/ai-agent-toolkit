import { z } from "zod";
import type { Context } from "../shared/configuration";
import type { Tool, ToolFactory } from "../shared/tools";
import type { TimeOffBalanceResponse } from "../client/timeoff.types";
import type { ApiClient } from "../client/api.client";

export const getTimeOffBalancePrompt: string = `
This tool fetches the time off balance for a given employment from the Remote API.
`;

export const getTimeOffBalanceParameters = (_context?: Context) =>
  z.object({
    employment_id: z
      .string()
      .describe("The employment ID to fetch the time off balance for."),
  });

export const getTimeOffBalance = async (
  apiClient: ApiClient,
  _context: Context,
  params: any,
): Promise<TimeOffBalanceResponse | string> => {
  try {
    const result = await apiClient.getTimeOffBalance(params.employment_id);
    return result;
  } catch (error) {
    console.error("Failed to fetch time off balance:", error);
    if (error instanceof Error) {
      return `Failed to fetch time off balance: ${error.message}`;
    }
    return "Failed to fetch time off balance due to an unexpected error.";
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: "get_time_off_balance",
  name: "Get Time Off Balance",
  description: getTimeOffBalancePrompt,
  parameters: getTimeOffBalanceParameters(context),
  execute: getTimeOffBalance,
});

export default toolFactory;
