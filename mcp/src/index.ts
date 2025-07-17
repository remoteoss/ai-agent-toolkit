#!/usr/bin/env node

import { RemoteApiMcpServer } from '@remoteoss/ai-agent-toolkit';
import { green } from 'colors';

interface CliOptions {
  apiKey?: string;
  apiBaseUrl?: string;
  allowedTools?: string[];
}

export function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {};
  for (const arg of args) {
    if (arg.startsWith('--api-key=')) {
      options.apiKey = arg.substring('--api-key='.length);
    } else if (arg.startsWith('--api-base-url=')) {
      options.apiBaseUrl = arg.substring('--api-base-url='.length);
    } else if (arg.startsWith('--tools=')) {
      options.allowedTools = arg.substring('--tools='.length).split(',');
    } else if (arg.startsWith('--')) {
      console.warn(`Warning: Unknown argument ${arg} ignored.`);
    }
  }

  if (!options.apiKey) {
    options.apiKey = process.env.REMOTE_API_KEY;
  }

  if (!options.apiBaseUrl && process.env.REMOTE_API_BASE_URL) {
    options.apiBaseUrl = process.env.REMOTE_API_BASE_URL;
  }

  if (!options.allowedTools && process.env.REMOTE_ALLOWED_TOOLS) {
    options.allowedTools = process.env.REMOTE_ALLOWED_TOOLS.split(',');
  }

  if (!options.apiKey) {
    throw new Error(
      'API key not provided. Please pass it as --api-key=$KEY or set the REMOTE_API_KEY environment variable.',
    );
  }

  return options;
}

function handleError(error: any, messagePrefix: string = 'Error'): void {
  console.error(`\n${messagePrefix}:\n`);
  console.error(`   ${error.message || 'An unknown error occurred'}\n`);
  process.exit(1);
}

export async function main() {
  try {
    const options = parseArgs(process.argv.slice(2));

    const server = new RemoteApiMcpServer({
      apiKey: options.apiKey!,
      apiBaseUrl: options.apiBaseUrl,
      allowedTools: options.allowedTools,
    });

    await server.startWithStdio();

    // console.log messes up the MCP server
    console.error(green('✅ Remote API MCP Server running on stdio'));
  } catch (error) {
    handleError(error, 'Failed to start Remote API MCP Server');
  }
}

main().catch((error) => {
  handleError(error, 'Fatal error in MCP server CLI');
});
