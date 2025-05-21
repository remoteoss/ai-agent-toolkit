import { z } from "zod";
import type { Context } from "../shared/configuration";
import type { Tool, ToolFactory } from "../shared/tools";
import type { GetTimesheetResponse } from "../client/timesheet.types";
import type { ApiClient } from "../client/api.client";

export const getTimesheetPrompt: string = `
This tool fetches a single Timesheet record by its ID from the Remote API.
`;

export const getTimesheetParameters = (_context?: Context) =>
  z.object({
    id: z.string().describe("The ID of the timesheet to fetch."),
  });

export const getTimesheet = async (
  apiClient: ApiClient,
  _context: Context,
  params: any,
): Promise<GetTimesheetResponse | string> => {
  try {
    const result = await apiClient.getTimesheet(params.id);
    return result;
  } catch (error) {
    console.error("Failed to fetch timesheet:", error);
    if (error instanceof Error) {
      return `Failed to fetch timesheet: ${error.message}`;
    }
    return "Failed to fetch timesheet due to an unexpected error.";
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: "get_timesheet",
  name: "Get Timesheet",
  description: getTimesheetPrompt,
  parameters: getTimesheetParameters(context),
  execute: getTimesheet,
});

export default toolFactory;
