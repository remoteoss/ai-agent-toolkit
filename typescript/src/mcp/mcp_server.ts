import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { RequestHandlerExtra } from '@modelcontextprotocol/sdk/shared/protocol.js';
import { RemoteApiClient, type ApiClient } from '../client';
import getAllTools from '../tools';
import type { Context } from '../shared';
import { z } from 'zod';

const PACKAGE_VERSION = '0.1.0';

export interface RemoteApiMcpServerOptions {
  apiKey: string;
  apiBaseUrl?: string;
  allowedTools?: string[];
}

export class RemoteApiMcpServer extends McpServer {
  private apiClient: ApiClient;
  private internalContext: Context;

  constructor({ apiKey, apiBaseUrl, allowedTools }: RemoteApiMcpServerOptions) {
    super({
      name: 'RemoteApiToolkit',
      version: PACKAGE_VERSION,
      configuration: {
        context: {
          mode: 'modelcontextprotocol',
          apiKeyProvided: !!apiKey,
          allowedTools: allowedTools || undefined,
        },
      },
    });

    if (!apiKey) {
      throw new Error('API key is required for RemoteApiMcpServer');
    }
    this.apiClient = new RemoteApiClient(apiKey, apiBaseUrl);
    this.internalContext = { apiKey, allowedTools };

    this.registerTools();
  }

  private registerTools(): void {
    const tools = getAllTools(this.internalContext);

    tools.forEach((localTool) => {
      this.tool(
        localTool.method,
        localTool.description,
        localTool.parameters.shape as any,
        async (
          params: z.infer<typeof localTool.parameters>,
          _extra: RequestHandlerExtra<any, any>,
        ) => {
          try {
            const result = await localTool.execute(this.apiClient, this.internalContext, params);

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
                  text: `Error in ${localTool.method}: ${
                    error instanceof Error ? error.message : 'Unknown error'
                  }`,
                },
              ],
            };
          }
        },
      );
    });
  }

  public async startWithStdio(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.connect(transport);
  }
}

export default RemoteApiMcpServer;
