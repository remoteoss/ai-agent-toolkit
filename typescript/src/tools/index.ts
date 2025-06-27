import type { Context } from '../shared/configuration';
import type { ToolFactory, ToolListFactory } from '../shared/tools';
import approveCancelRequestToolFactory from './approveCancelRequest';
import approveTimeOffToolFactory from './approveTimeOff';
import cancelTimeOffToolFactory from './cancelTimeOff';
import createTimeOffToolFactory from './createTimeOff';
import declineCancelRequestToolFactory from './declineCancelRequest';
import declineTimeOffToolFactory from './declineTimeOff';
import getTimeOffToolFactory from './getTimeOff';
import listCompanyManagersToolFactory from './listCompanyManagers';
import listEmploymentsToolFactory from './listEmployments';
import listPayrollRunsToolFactory from './listPayrollRuns';
import listTimeOffToolFactory from './listTimeOff';
import listTimeOffTypesToolFactory from './listTimeOffTypes';
import showEmploymentToolFactory from './showEmployment';
import showPayrollRunToolFactory from './showPayrollRun';
import updateTimeOffToolFactory from './updateTimeOff';
import leaveBalanceToolFactory from './leaveBalance';
import leavePoliciesDetailsToolFactory from './leavePoliciesDetails';
import listExpensesToolFactory from './listExpenses';
import createExpenseToolFactory from './createExpense';
import getExpenseToolFactory from './getExpense';
import updateExpenseToolFactory from './updateExpense';
import listTimesheetsToolFactory from './listTimesheets';
import getTimesheetToolFactory from './getTimesheet';
import approveTimesheetToolFactory from './approveTimesheet';
import sendBackTimesheetToolFactory from './sendBackTimesheet';
import listPayslipsToolFactory from './listPayslips';
import listBillingDocumentsToolFactory from './billing/listBillingDocuments';

export const toolFactories: ToolFactory[] = [
  listTimeOffToolFactory,
  listEmploymentsToolFactory,
  showEmploymentToolFactory,
  createTimeOffToolFactory,
  listCompanyManagersToolFactory,
  updateTimeOffToolFactory,
  getTimeOffToolFactory,
  approveTimeOffToolFactory,
  cancelTimeOffToolFactory,
  declineTimeOffToolFactory,
  approveCancelRequestToolFactory,
  declineCancelRequestToolFactory,
  listTimeOffTypesToolFactory,
  listPayrollRunsToolFactory,
  showPayrollRunToolFactory,
  leaveBalanceToolFactory,
  leavePoliciesDetailsToolFactory,
  listExpensesToolFactory,
  createExpenseToolFactory,
  getExpenseToolFactory,
  updateExpenseToolFactory,
  listTimesheetsToolFactory,
  getTimesheetToolFactory,
  approveTimesheetToolFactory,
  sendBackTimesheetToolFactory,
  listPayslipsToolFactory,
  listBillingDocumentsToolFactory,
];

const getAllTools: ToolListFactory = (context: Context) => {
  const allTools = toolFactories.map((factory) => factory(context));

  if (!context.allowedTools) {
    return allTools;
  }

  const filteredTools = allTools.filter((tool) => context.allowedTools!.includes(tool.name));

  if (filteredTools.length === 0) {
    console.warn(
      'No tools matched the allowedTools filter. Available tools:',
      allTools.map((t) => t.name).join(', '),
    );
  }

  return filteredTools;
};

export default getAllTools;
