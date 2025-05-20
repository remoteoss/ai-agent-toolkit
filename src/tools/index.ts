import type { Context } from "../shared/configuration";
import type { ToolFactory, ToolListFactory } from "../shared/tools";
import approveCancelRequestToolFactory from "./approveCancelRequest";
import approveTimeOffToolFactory from "./approveTimeOff";
import cancelTimeOffToolFactory from "./cancelTimeOff";
import createTimeOffToolFactory from "./createTimeOff";
import declineCancelRequestToolFactory from "./declineCancelRequest";
import declineTimeOffToolFactory from "./declineTimeOff";
import deleteTimeOffToolFactory from "./deleteTimeOff";
import getTimeOffToolFactory from "./getTimeOff";
import getTimeOffBalanceToolFactory from "./getTimeOffBalance";
import listCompanyManagersToolFactory from "./listCompanyManagers";
import listEmploymentsToolFactory from "./listEmployments";
import listPayrollRunsToolFactory from "./listPayrollRuns";
import listTimeOffToolFactory from "./listTimeOff";
import listTimeOffTypesToolFactory from "./listTimeOffTypes";
import showPayrollRunToolFactory from "./showPayrollRun";
import updateTimeOffToolFactory from "./updateTimeOff";

const toolFactories: ToolFactory[] = [
  listTimeOffToolFactory,
  listEmploymentsToolFactory,
  createTimeOffToolFactory,
  listCompanyManagersToolFactory,
  updateTimeOffToolFactory,
  getTimeOffToolFactory,
  deleteTimeOffToolFactory,
  approveTimeOffToolFactory,
  cancelTimeOffToolFactory,
  declineTimeOffToolFactory,
  approveCancelRequestToolFactory,
  declineCancelRequestToolFactory,
  listTimeOffTypesToolFactory,
  getTimeOffBalanceToolFactory,
  listPayrollRunsToolFactory,
  showPayrollRunToolFactory,
  // Add other tool factories here as they are created
  // e.g., createTimeOffToolFactory,
];

const getAllTools: ToolListFactory = (context: Context) =>
  toolFactories.map(factory => factory(context));

export default getAllTools;
