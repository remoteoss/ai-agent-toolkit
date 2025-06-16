import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { ListTimeOffParams } from "../client/timeoff.types"; // To type the arguments

import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  console.log("Testing MCP Server...");

  const remoteApiKey = process.env.REMOTE_API_KEY;
  const remoteBaseUrl = process.env.REMOTE_API_BASE_URL;

  if (!remoteApiKey) {
    console.error(
      "Error: REMOTE_API_KEY environment variable is not set. Please set it to your Remote API key.",
    );
    process.exit(1);
  }

  const serverCommand = "ts-node";
  const serverArgs = [
    "src/mcp/cli.ts",
    `--api-key=${remoteApiKey}`,
    `--api-base-url=${remoteBaseUrl}`,
  ];

  console.log(
    `Starting MCP server with command: ${serverCommand} ${serverArgs.join(" ")}`,
  );

  const transport = new StdioClientTransport({
    command: serverCommand,
    args: serverArgs,
  });

  const client = new Client({
    name: "mcp-test-client",
    version: "0.1.0",
  });

  try {
    console.log("\nAttempting to connect to MCP server...");
    await client.connect(transport);
    console.log("Successfully connected to MCP server.");

    console.log("\nListing available tools...");
    const toolsResponse = await client.listTools();
    const availableTools = toolsResponse.tools.map(t => t.name);
    console.log("Available tools:", availableTools);

    const listTimeOffToolName = "list_time_off";
    if (!availableTools.includes(listTimeOffToolName)) {
      console.error(
        `Error: Tool '${listTimeOffToolName}' not found in MCP server.`,
      );
      return;
    }
    console.log(`Found tool: ${listTimeOffToolName}`);

    const params: ListTimeOffParams = {
      page: 1,
      page_size: 3,
      status: "approved",
    };
    console.log(`\nCalling tool '${listTimeOffToolName}' with params:`, params);

    const toolResult = await client.callTool({
      name: listTimeOffToolName,
      arguments: params as any, // Cast to any as MCP SDK expects {[key: string]: unknown}
    });

    console.log("\nTool call successful. Result:");
    if (
      toolResult.content &&
      Array.isArray(toolResult.content) &&
      toolResult.content.length > 0
    ) {
      const firstContent = toolResult.content[0] as {
        type?: string;
        text?: string;
      }; // Type assertion
      if (
        firstContent.type === "text" &&
        typeof firstContent.text === "string"
      ) {
        console.log(firstContent.text);
        try {
          const parsedJson = JSON.parse(firstContent.text);
          console.log("\nParsed JSON result:");
          console.log(JSON.stringify(parsedJson, null, 2));
        } catch (e) {}
      } else {
        console.log(JSON.stringify(toolResult, null, 2));
      }
    } else {
      console.log(JSON.stringify(toolResult, null, 2));
    }
  } catch (error) {
    console.error("\nError during MCP client interaction:");
    if (error instanceof Error) {
      console.error(error.message);
      if (error.stack) {
        console.error(error.stack);
      }
    } else {
      console.error(String(error));
    }
  } finally {
    try {
      console.log("\nClosing MCP client connection...");
      await client.close(); // Assuming client.close() is safe to call
      console.log("MCP client connection closed.");
    } catch (closeError) {
      console.error("Error closing MCP client:", closeError);
    }
  }
}

main().catch(error => {
  console.error("Unhandled error in main function for MCP test:", error);
});
