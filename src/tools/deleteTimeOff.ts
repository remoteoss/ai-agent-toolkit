import { z } from "zod";
import type { Context } from "../shared/configuration";
import type { Tool, ToolFactory } from "../shared/tools";
import type { DeleteTimeOffResponse } from "../client/timeoff.types";
import type { ApiClient } from "../client/api.client";

export const deleteTimeOffPrompt: string = `
This tool deletes a Time Off record by its ID from the Remote API.
`;

export const deleteTimeOffParameters = (_context?: Context) =>
  z.object({
    id: z.string().describe("The ID of the time off to delete."),
  });

export const deleteTimeOff = async (
  apiClient: ApiClient,
  _context: Context,
  params: any
): Promise<DeleteTimeOffResponse | string> => {
  try {
    const result = await apiClient.deleteTimeOff(params.id);
    return result;
  } catch (error) {
    console.error("Failed to delete time off:", error);
    if (error instanceof Error) {
      return `Failed to delete time off: ${error.message}`;
    }
    return "Failed to delete time off due to an unexpected error.";
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: "delete_time_off",
  name: "Delete Time Off",
  description: deleteTimeOffPrompt,
  parameters: deleteTimeOffParameters(context),
  execute: deleteTimeOff,
});

export default toolFactory;
