# Remote API Agent Toolkit

This project is a TypeScript-based toolkit designed to integrate with the [Remote API](https://developer.remote.com). It provides ready-to-use tools for [LangChain](https://js.langchain.com/) agents and an [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server, allowing language models to interact with the Remote API's functionalities, such as listing time off requests.

## Features

- **Comprehensive API Client**: A typed client for interacting with a wide range of Remote API endpoints.
- **Extensive LangChain Tools**: Exposes numerous Remote API functionalities as LangChain `StructuredTool` instances, including:
  - Time Off Management (list, create, get, update, cancel, approve, decline, balance, policies)
  - Employment Data (list, show)
  - Expense Management (list, get, create, update)
  - Timesheet Handling (list, get, approve, send back)
  - Payroll Information (list runs, show run)
  - Company Information (list managers)
- **MCP Server**: Runs an MCP server that exposes all implemented tools, allowing integration with MCP-compatible clients like Claude Desktop.
- **Conversational Slack Bot Example**: An `hr-assistant-slack-bot.ts` demonstrating:
  - Tool usage within a LangChain agent.
  - Conversational memory management.
  - Interaction in Slack DMs and the AI Agent container.
  - Real-time status updates (e.g., "thinking...") in the AI container.
- **Extensible**: Designed to easily add more tools for other Remote API endpoints.

## Roadmap / Future Development

Here are some potential next steps and areas for future development:

- **Tool Enhancements & Bug Fixes:**
  - Investigate and fix the 404 error associated with the `listTimeOffTypes` tool.
  - Improve the reliability of complex multi-parameter tools (e.g., `createTimeOff`, `createExpense`) within the agent, potentially by refining tool descriptions or agent prompting.
- **Slack Bot Improvements:**
  - Implement persistent storage for conversation history (e.g., Redis, database) instead of in-memory.
  - Explore more robust Slack message formatting using Block Kit for richer UI than `mrkdwn` alone.
  - Enhance error handling and feedback to the user in the Slack bot.
- **Testing:**
  - Add comprehensive unit tests for API client methods and tool execution logic.
  - Add integration tests for LangChain toolkit, MCP server, and Slack bot functionality.
- **NPM Package Release:**
  - Refine the build process.
  - Update `package.json` for publishing (main, types, files, repository, author, license, keywords).
  - Add TSDoc comments and generate API documentation.
  - Publish to NPM.
- **Add More Tools (General):**
  - Continuously evaluate and add tools for other useful Remote API functionalities based on user needs.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Setup

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd remote-api-agent-toolkit-ts
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project and add your API keys:
    ```env
    REMOTE_API_KEY=your_remote_api_key_here
    OPENAI_API_KEY=your_openai_api_key_here # Required for LangChain example
    ```
    - `REMOTE_API_KEY`: Your API key for the Remote API.
    - `OPENAI_API_KEY`: Your OpenAI API key, needed to run the LangChain agent example.

## LangChain Toolkit Integration

The toolkit provides `RemoteApiAgentToolkit` for easy integration with LangChain agents.

**Example Usage (`src/examples/test-list-timeoff-tool.ts`):**

```typescript
import { RemoteApiAgentToolkit } from "../langchain/toolkit";
import { ChatOpenAI } from "@langchain/openai";
import type { ChatPromptTemplate } from "@langchain/core/prompts";
import { pull } from "langchain/hub";
import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";

async function main() {
  const llm = new ChatOpenAI({
    model: "gpt-4o", // Or your preferred model
    temperature: 0,
  });

  const remoteApiToolkit = new RemoteApiAgentToolkit({ apiKey: remoteApiKey });

  const tools = remoteApiToolkit.getTools();
  const prompt = await pull<ChatPromptTemplate>(
    "hwchase17/structured-chat-agent",
  );

  const agent = await createStructuredChatAgent({
    llm,
    tools,
    prompt,
  });

  const agentExecutor = new AgentExecutor({
    agent,
    tools,
    verbose: true,
  });

  const input =
    "Can you list the first 2 approved time off requests for employment ID emp_123?";
  const response = await agentExecutor.invoke({
    input: input,
  });

  console.log(JSON.stringify(response, null, 2));
}

main().catch(console.error);
```

**To run this example:**
Ensure your `.env` file has `REMOTE_API_KEY` and `OPENAI_API_KEY`.

```bash
npm install -D ts-node # if not already installed
npx ts-node src/examples/test-list-timeoff-tool.ts
```

## MCP Server

The MCP server exposes the toolkit's functionalities to MCP clients like Claude Desktop.

**Running the MCP Server:**

Ensure your `.env` file has `REMOTE_API_KEY` or provide it as a command-line argument.

```bash
# Using environment variable from .env
npm run start:mcp
# or
yarn start:mcp

# Explicitly passing API key (if not in .env)
# ts-node src/mcp/cli.ts --api-key=your_remote_api_key_here
```

**Configuring with Claude Desktop:**

To use this MCP server with Claude Desktop, you'll need to edit your `claude_desktop_config.json` file.

1.  **Locate/Create `claude_desktop_config.json`:**

    - **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
    - **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

2.  **Add the server configuration:**
    Replace `<your_username>` and `<your_project_directory_name>` with your actual details.
    The example assumes your project is at `/Users/<your_username>/Projects/<your_project_directory_name>`.

    ```json
    {
      "mcpServers": {
        "RemoteAIToolkit": {
          "command": "/Users/jeroen.vandergeer/.asdf/installs/nodejs/23.11.0/bin/node",
          "args": [
            "/Users/jeroen.vandergeer/Projects/remote-ai-agent-toolkit-ts/node_modules/ts-node/dist/bin.js",
            "/Users/jeroen.vandergeer/Projects/remote-ai-agent-toolkit-ts/src/mcp/cli.ts"
          ],
          "env": {
            "REMOTE_API_KEY": "YOUR_API_KEY"
          },
          "workingDirectory": "/Users/jeroen.vandergeer/Projects/remote-ai-agent-toolkit-ts"
        }
      }
    }
    ```

    **Important Notes for Claude Desktop Config:**

    - **`command`**: This points to your locally installed `ts-node`. If `ts-node` is global and in Claude's PATH, you might simplify it. If you use `asdf` or `nvm`, the direct path to the `node` executable provided by them is most robust. Using relative paths likely will not work
    - **`REMOTE_API_KEY`**: Ensure this is set to your actual key.
    - **`workingDirectory`**: Set to the root of this project.

3.  **Restart Claude Desktop** after saving the configuration.

**Testing the MCP Server (Standalone Client):**

You can also test the MCP server with the example client script:

```bash
npx ts-node src/examples/test-mcp-server.ts
```

This script requires `REMOTE_API_KEY` to be set in your `.env` file.

## Development

- **Adding New Tools**:
  1.  Define new request/response types in `src/client/timeoff.types.ts` (or a new types file).
  2.  Add the corresponding method to `ApiClient` and `RemoteApiClient` in `src/client/api.client.ts`.
  3.  Create a new tool file (e.g., `src/tools/yourNewTool.ts`) similar to `listTimeOff.ts`, defining the prompt, Zod parameters, and execution logic.
  4.  Add the new tool factory to `src/tools/index.ts`.
- **Building for Production (Optional for publishing):**
  ```bash
  npm run build
  ```
  This will compile TypeScript to JavaScript in the `dist` folder.

## Project Structure

- `src/client/`: API client and type definitions for API interaction.
- `src/langchain/`: LangChain specific wrappers and toolkit.
- `src/mcp/`: MCP server implementation and CLI.
- `src/shared/`: Shared types and configurations (Context, Tool definition).
- `src/tools/`: Individual tool definitions and factory aggregation.
- `src/examples/`: Example scripts for testing.
