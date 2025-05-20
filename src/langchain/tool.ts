import { z } from 'zod';
import { StructuredTool, ToolParams } from '@langchain/core/tools';
import { CallbackManagerForToolRun } from '@langchain/core/callbacks/manager';
import type { ApiClient } from '../client';
import type { Tool as LocalTool } from '../shared'; // Our internal Tool definition
import type { Context } from '../shared';

export interface RemoteApiToolParams extends ToolParams {
  apiClient: ApiClient;
  toolDefinition: LocalTool;
  context: Context;
}

export class RemoteApiTool extends StructuredTool {
  protected apiClient: ApiClient;
  protected toolDefinition: LocalTool;
  protected context: Context;

  name: string;
  description: string;
  schema: z.ZodObject<any, any, any, any>; 

  constructor({
    apiClient,
    toolDefinition,
    context,
    ...rest 
  }: RemoteApiToolParams) {
    super(rest); 
    this.apiClient = apiClient;
    this.toolDefinition = toolDefinition;
    this.context = context;

    this.name = toolDefinition.name;
    this.description = toolDefinition.description;
    this.schema = toolDefinition.parameters as z.ZodObject<any, any, any, any>; 
  }

  protected async _call(
    arg: z.output<this['schema']>,
    _runManager?: CallbackManagerForToolRun,
    _config?: any
  ): Promise<string> {
    try {
      const result = await this.toolDefinition.execute(
        this.apiClient,
        this.context,
        arg
      );
      if (typeof result === 'string') {
        return result;
      }
      return JSON.stringify(result, null, 2); 
    } catch (error) {
      console.error(`Error executing tool ${this.name}:`, error);
      if (error instanceof Error) {
        return `Error in ${this.name}: ${error.message}`;
      }
      return `An unknown error occurred in ${this.name}.`;
    }
  }
} 