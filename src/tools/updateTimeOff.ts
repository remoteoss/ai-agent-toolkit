import { z } from "zod";
import type { Context } from "../shared/configuration";
import type { Tool, ToolFactory } from "../shared/tools";
import type {
  TimeOffParams,
  UpdateTimeOffResponse,
} from "../client/timeoff.types";
import type { ApiClient } from "../client/api.client";

export const updateTimeOffPrompt: string = `
This tool updates a Time Off record in the Remote API.
You must provide the time off ID and any fields you wish to update.
`;

export const updateTimeOffParameters = (_context?: Context) =>
  z.object({
    id: z.string().describe("The ID of the time off to update."),
    employment_id: z.string().optional().describe("The employment ID."),
    start_date: z.string().optional().describe("The start date (YYYY-MM-DD)."),
    end_date: z.string().optional().describe("The end date (YYYY-MM-DD)."),
    timeoff_type: z.string().optional().describe("The type of time off."),
    timezone: z.string().optional().describe("The timezone."),
    edit_reason: z.string().optional().describe("The reason for the edit."),
    timeoff_days: z
      .array(
        z.object({
          day: z.string().describe("The day (YYYY-MM-DD)."),
          hours: z.number().describe("The number of hours."),
        }),
      )
      .optional()
      .describe("Array of day/hour entries."),
    notes: z.string().optional().describe("Notes for the time off."),
    document: z.any().optional().describe("Optional document."),
    approver_id: z.string().optional().describe("The approver's user ID."),
    approved_at: z
      .string()
      .optional()
      .describe("The approval datetime (ISO8601)."),
  });

export const updateTimeOff = async (
  apiClient: ApiClient,
  _context: Context,
  params: any,
): Promise<UpdateTimeOffResponse | string> => {
  try {
    const result = await apiClient.updateTimeOff(params as TimeOffParams);
    return result;
  } catch (error) {
    console.error("Failed to update time off:", error);
    if (error instanceof Error) {
      return `Failed to update time off: ${error.message}`;
    }
    return "Failed to update time off due to an unexpected error.";
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: "update_time_off",
  name: "Update Time Off",
  description: updateTimeOffPrompt,
  parameters: updateTimeOffParameters(context),
  execute: updateTimeOff,
});

export default toolFactory;
