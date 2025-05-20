import { z } from "zod";
import type { Context } from "../shared/configuration";
import type { Tool, ToolFactory } from "../shared/tools";
import type { GetTimeOffResponse } from "../client/timeoff.types";
import type { ApiClient } from "../client/api.client";

export const getTimeOffPrompt: string = `
This tool fetches a single Time Off record by its ID from the Remote API.
`;

export const getTimeOffParameters = (_context?: Context) =>
  z.object({
    id: z.string().describe("The ID of the time off to fetch."),
  });

export const getTimeOff = async (
  apiClient: ApiClient,
  _context: Context,
  params: any,
): Promise<GetTimeOffResponse | string> => {
  try {
    const result = await apiClient.getTimeOff(params.id);
    return result;
  } catch (error) {
    console.error("Failed to fetch time off:", error);
    if (error instanceof Error) {
      return `Failed to fetch time off: ${error.message}`;
    }
    return "Failed to fetch time off due to an unexpected error.";
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: "get_time_off",
  name: "Get Time Off",
  description: getTimeOffPrompt,
  parameters: getTimeOffParameters(context),
  execute: getTimeOff,
});

export default toolFactory;
