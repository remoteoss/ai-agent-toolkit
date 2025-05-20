import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import { RemoteApiClient, type ApiClient } from '../client';
import getAllToolsFunction from '../tools';
import type { Context, Tool as LocalTool } from '../shared';
import { z } from 'zod';

const PACKAGE_VERSION = '0.1.0'; 

export interface RemoteApiMcpServerOptions {
  apiKey: string;
  apiBaseUrl?: string;
}

export class RemoteApiMcpServer extends McpServer {
  private apiClient: ApiClient;
  private internalContext: Context; 

  constructor({ apiKey, apiBaseUrl }: RemoteApiMcpServerOptions) {
    super({
      name: 'RemoteApiToolkit',
      version: PACKAGE_VERSION, 
      configuration: {
        context: {
          mode: 'modelcontextprotocol',
          apiKeyProvided: !!apiKey,
        },
      },
    });

    if (!apiKey) {
      throw new Error('API key is required for RemoteApiMcpServer');
    }
    this.apiClient = new RemoteApiClient(apiKey, apiBaseUrl);
    this.internalContext = { apiKey }; 

    this.registerTools();
  }

  private registerTools(): void {
    const allLocalTools = getAllToolsFunction(this.internalContext);

    allLocalTools.forEach((localTool) => {
      this.tool(
        localTool.method,
        localTool.description,
        localTool.parameters.shape as any,
        async (params: z.infer<typeof localTool.parameters>, _extra: RequestHandlerExtra<any, any>) => {
          console.error(`MCP Server: Received call for ${localTool.method} with params:`, params);
          try {
            const result = await localTool.execute(
              this.apiClient,
              this.internalContext,
              params
            );
            
            console.error(`MCP Server: Execution of ${localTool.method} successful.`);
            return {
              content: [
                {
                  type: 'text' as const,
                  text: typeof result === 'string' ? result : JSON.stringify(result, null, 2),
                },
              ],
            };
          } catch (error) {
            console.error(`MCP Server: Error executing ${localTool.method}:`, error);
            return {
                content: [
                    {
                        type: 'text' as const,
                        text: `Error in ${localTool.method}: ${error instanceof Error ? error.message : 'Unknown error'}`
                    }
                ],
            };
          }
        }
      );
      console.error(`MCP Server: Registered tool ${localTool.method}`);
    });
  }

  public async startWithStdio(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.connect(transport);
    console.error('Remote API MCP Server connected and running on stdio.');
  }
} 