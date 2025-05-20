import { z } from "zod";
import type { Context } from "../shared/configuration";
import type { Tool, ToolFactory } from "../shared/tools";
import type {
  ListEmploymentsParams,
  ListEmploymentsResponse,
} from "../client/employments.types";
import type { ApiClient } from "../client/api.client";

export const listEmploymentsPrompt: string = `
This tool lists all employments from the Remote API, except for deleted ones.
It supports pagination. Note that the response includes country-specific data,
where the exact fields will vary depending on which country the employment is in.
`;

export const listEmploymentsParameters = (
  _context?: Context,
): z.ZodObject<{
  page: z.ZodOptional<z.ZodNumber>;
  page_size: z.ZodOptional<z.ZodNumber>;
}> =>
  z.object({
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

export const listEmployments = async (
  apiClient: ApiClient,
  _context: Context,
  params: z.infer<ReturnType<typeof listEmploymentsParameters>>,
): Promise<ListEmploymentsResponse | string> => {
  try {
    const employmentsData = await apiClient.listEmployments(
      params as ListEmploymentsParams,
    );
    return employmentsData;
  } catch (error) {
    console.error("Failed to list employments:", error);
    if (error instanceof Error) {
      return `Failed to list employments: ${error.message}`;
    }
    return "Failed to list employments due to an unexpected error.";
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: "list_employments",
  name: "List Employments",
  description: listEmploymentsPrompt,
  parameters: listEmploymentsParameters(context),
  execute: listEmployments,
});

export default toolFactory;
