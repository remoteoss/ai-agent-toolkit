import { z } from "zod";
import type { Context } from "../shared/configuration";
import type { Tool, ToolFactory } from "../shared/tools";
import type { ApproveTimesheetResponse } from "../client/timesheet.types";
import type { ApiClient } from "../client/api.client";

export const approveTimesheetPrompt: string = `
This tool approves a Timesheet by its ID in the Remote API.
`;

export const approveTimesheetParameters = (_context?: Context) =>
  z.object({
    id: z.string().describe("The ID of the timesheet to approve."),
  });

export const approveTimesheet = async (
  apiClient: ApiClient,
  _context: Context,
  params: any,
): Promise<ApproveTimesheetResponse | string> => {
  try {
    const result = await apiClient.approveTimesheet(params.id);
    return result;
  } catch (error) {
    console.error("Failed to approve timesheet:", error);
    if (error instanceof Error) {
      return `Failed to approve timesheet: ${error.message}`;
    }
    return "Failed to approve timesheet due to an unexpected error.";
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: "approve_timesheet",
  name: "Approve Timesheet",
  description: approveTimesheetPrompt,
  parameters: approveTimesheetParameters(context),
  execute: approveTimesheet,
});

export default toolFactory;
