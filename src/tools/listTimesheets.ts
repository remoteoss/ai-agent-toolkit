import { z } from "zod";
import type { Context } from "../shared/configuration";
import type { Tool, ToolFactory } from "../shared/tools";
import {
  ListTimesheetsParams,
  ListTimesheetsResponse,
  TimesheetStatus,
} from "../client/timesheet.types";
import type { ApiClient } from "../client/api.client";

export const listTimesheetsPrompt: string = `
This tool lists all timesheets from the Remote API.  It can be used to get the timesheets that requires action from the user (to approve or reject pending timesheet submissions).
It can be filtered by status and supports pagination and sorting.
`;

export const listTimesheetsParameters = (_context?: Context) =>
  z.object({
    status: z
      .nativeEnum(TimesheetStatus)
      .optional()
      .describe("Filter timesheets by their status"),
    order: z.enum(["asc", "desc"]).optional().describe("Sort order"),
    sort_by: z.enum(["submitted_at"]).optional().describe("Field to sort by"),
    page: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Page number for pagination (>= 1)."),
    page_size: z
      .number()
      .int()
      .min(1)
      .max(100)
      .optional()
      .describe("Number of items per page (1-100)."),
  });

export const listTimesheets = async (
  apiClient: ApiClient,
  _context: Context,
  params: z.infer<ReturnType<typeof listTimesheetsParameters>>,
): Promise<ListTimesheetsResponse | string> => {
  try {
    const timesheetsData = await apiClient.listTimesheets(
      params as ListTimesheetsParams,
    );
    return timesheetsData;
  } catch (error) {
    console.error("Failed to list timesheets:", error);
    if (error instanceof Error) {
      return `Failed to list timesheets: ${error.message}`;
    }
    return "Failed to list timesheets due to an unexpected error.";
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: "list_timesheets",
  name: "List Timesheets",
  description: listTimesheetsPrompt,
  parameters: listTimesheetsParameters(context),
  execute: listTimesheets,
});

export default toolFactory;
