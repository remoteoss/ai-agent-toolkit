import listTimeOffToolFactory from './listTimeOff';
import listEmploymentsToolFactory from './listEmployments';
import listPayrollRunsToolFactory from './listPayrollRuns';
import showPayrollRunToolFactory from './showPayrollRun';
import type { ToolListFactory, ToolFactory } from '../shared/tools';
import type { Context } from '../shared/configuration';

const toolFactories: ToolFactory[] = [
  listTimeOffToolFactory,
  listEmploymentsToolFactory,
  listPayrollRunsToolFactory,
  showPayrollRunToolFactory,
  // Add other tool factories here as they are created
  // e.g., createTimeOffToolFactory,
];


const getAllTools: ToolListFactory = (context: Context) =>
  toolFactories.map(factory => factory(context));

export default getAllTools;
