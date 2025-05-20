import { BaseToolkit } from '@langchain/core/tools';
import { RemoteApiTool } from './tool';
import { RemoteApiClient, type ApiClient } from '../client';
import getAllToolsFunction from '../tools'; // This is our ToolListFactory
import type { Context } from '../shared';

export interface RemoteApiToolkitParams {
  apiKey: string;
  apiBaseUrl?: string;
}

export class RemoteApiAgentToolkit extends BaseToolkit {
  private _apiClient: ApiClient;
  private _context: Context;
  tools: RemoteApiTool[];

  constructor({ apiKey, apiBaseUrl }: RemoteApiToolkitParams) {
    super();
    if (!apiKey) {
      throw new Error('API key is required for RemoteApiAgentToolkit');
    }
    this._apiClient = new RemoteApiClient(apiKey, apiBaseUrl);
    this._context = { apiKey }; 

    const allToolFactories = getAllToolsFunction(this._context);

    this.tools = allToolFactories.map(
      (toolDefinition) =>
        new RemoteApiTool({
          apiClient: this._apiClient,
          toolDefinition,
          context: this._context,
        })
    );
  }

  getTools(): RemoteApiTool[] {
    return this.tools;
  }
} 