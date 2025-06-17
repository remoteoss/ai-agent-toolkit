import { z } from 'zod';
import type { Context } from '../shared/configuration';
import type { Tool, ToolFactory } from '../shared/tools';
import type {
  SendBackTimesheetParams,
  SentBackTimesheetResponse,
} from '../client/timesheet.types';
import type { ApiClient } from '../client/api.client';

export const sendBackTimesheetPrompt: string = `
This tool sends a Timesheet back to the employee for review or modification by its ID in the Remote API.
`;

export const sendBackTimesheetParameters = (_context?: Context) =>
  z.object({
    id: z.string().describe('The ID of the timesheet to send back.'),
    sent_back_reason: z
      .string()
      .describe('The reason for sending the timesheet back.'),
  });

export const sendBackTimesheet = async (
  apiClient: ApiClient,
  _context: Context,
  params: any,
): Promise<SentBackTimesheetResponse | string> => {
  try {
    const { id, sent_back_reason } = params;
    const result = await apiClient.sendBackTimesheet(id, {
      sent_back_reason,
    } as SendBackTimesheetParams);
    return result;
  } catch (error) {
    console.error('Failed to send back timesheet:', error);
    if (error instanceof Error) {
      return `Failed to send back timesheet: ${error.message}`;
    }
    return 'Failed to send back timesheet due to an unexpected error.';
  }
};

const toolFactory: ToolFactory = (context: Context): Tool => ({
  method: 'send_back_timesheet',
  name: 'Send Back Timesheet',
  description: sendBackTimesheetPrompt,
  parameters: sendBackTimesheetParameters(context),
  execute: sendBackTimesheet,
});

export default toolFactory;
