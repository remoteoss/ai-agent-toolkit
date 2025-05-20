import { z } from "zod";
import type { Context } from "../shared/configuration";
import type { Tool, ToolFactory } from "../shared/tools";
import type {
  ListTimeOffParams,
  ListTimeOffResponse,
} from "../client/timeoff.types";
import type { ApiClient } from "../client/api.client";

export const listTimeOffPrompt: string = `
This tool lists Time Off records from the Remote API.
It can be filtered by employment_id, timeoff_type, status, and supports pagination and sorting.
`;

export const listTimeOffParameters = (
  _context?: Context
): z.ZodObject<{
  employment_id: z.ZodOptional<z.ZodString>;
  timeoff_type: z.ZodOptional<z.ZodString>;
  status: z.ZodOptional<z.ZodString>;
  order: z.ZodOptional<z.ZodEnum<["asc", "desc"]>>;
  sort_by: z.ZodOptional<z.ZodString>;
  page: z.ZodOptional<z.ZodNumber>;
  page_size: z.ZodOptional<z.ZodNumber>;
}> =>
  z.object({
    employment_id: z
      .string()
      .optional()
      .describe("Filter time off for a specific employment ID."),
    timeoff_type: z
      .string()
      .optional()
      .describe(
        "Filter time off by its type (e.g., sick_leave, paid_time_off)."
      ),
    status: z
      .string()
      .optional()
      .describe("Filter time off by its status (e.g., approved, requested)."),
    order: z
      .enum(["asc", "desc"])
      .optional()
      .describe("Sort order: asc or desc."),
    sort_by: z
      .string()
      .optional()
      .describe("Field to sort by (e.g., timeoff_type, start_date)."),
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

export const listTimeOff = async (
  apiClient: ApiClient,
  _context: Context,
  params: z.infer<ReturnType<typeof listTimeOffParameters>>
): Promise<ListTimeOffResponse | string> => {
  try {
    const timeOffData = await apiClient.listTimeOff(
      params as ListTimeOffParams
    );
    return timeOffData;
  } catch (error) {
    console.error("Failed to list time off:", error);
    if (error instanceof Error) {
      return `Failed to list time off: ${error.message}`;
    }
    return "Failed to list time off due to an unexpected error.";
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: "list_time_off",
  name: "List Time Off",
  description: listTimeOffPrompt,
  parameters: listTimeOffParameters(context),
  execute: listTimeOff,
});

export default toolFactory;
