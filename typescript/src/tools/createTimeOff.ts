import { z } from 'zod';
import type { Context } from '../shared/configuration';
import type { Tool, ToolFactory } from '../shared/tools';
import {
  TimeOffStatus,
  TimeOffType,
  TimeOffParams,
} from '../client/timeoff.types';
import type { ApiClient } from '../client/api.client';

export const createTimeOffPrompt: string = `
This tool creates a PRE-APPROVED Time Off record in the Remote API.
It requires employment_id, start_date, end_date, timeoff_type, timezone, and timeoff_days.
IMPORTANT: Because this tool creates a time off request with an 'approved' status, the 'timeoff_type' MUST be one of the available time off types from the list_time_off_types tool.
`;

export const createTimeOffParameters = (_context?: Context) =>
  z.object({
    employment_id: z
      .string()
      .describe('The ID of the employment for which to create the time off.'),
    start_date: z
      .string()
      .describe('The start date of the time off (YYYY-MM-DD).'),
    end_date: z.string().describe('The end date of the time off (YYYY-MM-DD).'),
    timeoff_type: z
      .nativeEnum(TimeOffType)
      .describe(
        'The type of time off. MUST be one of the available time off types from the list_time_off_types tool.',
      ),
    timezone: z.string().describe('The timezone for the time off dates.'),
    notes: z
      .string()
      .optional()
      .describe('Optional notes about the time off request.'),
    timeoff_days: z
      .array(
        z.object({
          day: z
            .string()
            .describe('The specific day for the time off entry (YYYY-MM-DD).'),
          hours: z
            .number()
            .describe('The number of hours for this specific day.'),
        }),
      )
      .describe('Array of specific day entries with hours.'),
    approver_id: z
      .string()
      .optional()
      .describe(
        'The user ID of the approver (company admin/manager). If not provided, the first company manager will be used.',
      ),
    approved_at: z
      .string()
      .optional()
      .describe(
        'The approval datetime in ISO8601 format. If not provided, the current date and time will be used.',
      ),
  });

export const createTimeOff = async (
  apiClient: ApiClient,
  _context: Context,
  params: z.infer<z.AnyZodObject>,
): Promise<any> => {
  try {
    // Validate and cast params to expected type
    const parsedParams = createTimeOffParameters().parse(params);
    // Get the first company manager as the approver if none is provided
    const approver =
      parsedParams.approver_id ||
      (await apiClient.listCompanyManagers({})).data.company_managers.at(0)
        ?.userId;

    // Prepare payload
    const payload: TimeOffParams = {
      employment_id: parsedParams.employment_id,
      start_date: parsedParams.start_date,
      end_date: parsedParams.end_date,
      timeoff_type: parsedParams.timeoff_type as TimeOffType,
      timezone: parsedParams.timezone,
      notes: parsedParams.notes,
      timeoff_days: parsedParams.timeoff_days,
      approver_id: approver,
      approved_at: parsedParams.approved_at || new Date().toISOString(),
      status: TimeOffStatus.APPROVED,
    };
    const result = await apiClient.createTimeOff(payload);
    return result;
  } catch (error) {
    console.error('Failed to create time off:', error);
    if (error instanceof Error) {
      return `Failed to create time off: ${error.message}`;
    }
    return 'Failed to create time off due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'create_time_off',
  name: 'Create Time Off',
  description: createTimeOffPrompt,
  parameters: createTimeOffParameters(context),
  execute: createTimeOff,
});

export default toolFactory;
