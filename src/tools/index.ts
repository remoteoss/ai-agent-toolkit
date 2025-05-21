import type { Context } from "../shared/configuration";
import type { ToolFactory, ToolListFactory } from "../shared/tools";
import approveCancelRequestToolFactory from "./approveCancelRequest";
import approveTimeOffToolFactory from "./approveTimeOff";
import cancelTimeOffToolFactory from "./cancelTimeOff";
import createTimeOffToolFactory from "./createTimeOff";
import declineCancelRequestToolFactory from "./declineCancelRequest";
import declineTimeOffToolFactory from "./declineTimeOff";
import getTimeOffToolFactory from "./getTimeOff";
import listCompanyManagersToolFactory from "./listCompanyManagers";
import listEmploymentsToolFactory from "./listEmployments";
import listPayrollRunsToolFactory from "./listPayrollRuns";
import listTimeOffToolFactory from "./listTimeOff";
import listTimeOffTypesToolFactory from "./listTimeOffTypes";
import showPayrollRunToolFactory from "./showPayrollRun";
import updateTimeOffToolFactory from "./updateTimeOff";
import leaveBalanceToolFactory from "./leaveBalance";
import leavePoliciesDetailsToolFactory from "./leavePoliciesDetails";
import listExpensesToolFactory from "./listExpenses";
import createExpenseToolFactory from "./createExpense";
import getExpenseToolFactory from "./getExpense";
import updateExpenseToolFactory from "./updateExpense";

const toolFactories: ToolFactory[] = [
  listTimeOffToolFactory,
  listEmploymentsToolFactory,
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
  // Expense tools
  listExpensesToolFactory,
  createExpenseToolFactory,
  getExpenseToolFactory,
  updateExpenseToolFactory,
  // Add other tool factories here as they are created
  // e.g., createTimeOffToolFactory,
];

const getAllTools: ToolListFactory = (context: Context) =>
  toolFactories.map(factory => factory(context));

export default getAllTools;
