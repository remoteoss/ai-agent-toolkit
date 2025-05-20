# Remote API Agent Toolkit

This project is a TypeScript-based toolkit designed to integrate with the [Remote API][https://developer.remote.com]. It provides ready-to-use tools for [LangChain](https://js.langchain.com/) agents and an [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server, allowing language models to interact with the Remote API's functionalities, such as listing time off requests.

## Features

- **API Client**: A typed client for interacting with the Remote API (initially targeting time off endpoints).
- **LangChain Tools**: Exposes Remote API functionalities as LangChain `StructuredTool` instances, compatible with agents.
- **MCP Server**: Runs an MCP server that exposes the tools, allowing integration with MCP-compatible clients like Claude Desktop.
- **Extensible**: Designed to easily add more tools for other Remote API endpoints.

## Roadmap / Future Development

Here are some potential next steps and areas for future development:

- **Add More Tools:**
  - Create Time Off
  - Delete Time Off
  - Approve Time Off
  - List Payroll Runs
  - _(Add other desired API functionalities as tools)_
- **Enhance Hackathon Demos:**
  - Create/improve LangChain tool usage examples for demonstration.
  - Create/improve MCP server usage examples for demonstration.
- **Implement Testing:**
  - Add unit tests for API client methods and tool execution logic.
  - Add integration tests for LangChain toolkit and MCP server functionality.
- **NPM Package Release:**
  - Refine the build process.
  - Update `package.json` for publishing (main, types, files, repository, author, license, keywords).
  - Add TSDoc comments and generate API documentation.
  - Publish to NPM.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

## Setup

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd remote-ai-agent-toolkit-ts
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
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const llm = new ChatOpenAI({
    model: "gpt-4o", // Or your preferred model
    temperature: 0,
  });

  const remoteApiKey = process.env.REMOTE_API_KEY;
  if (!remoteApiKey) {
    console.error("REMOTE_API_KEY is not set.");
    process.exit(1);
  }
  const remoteApiToolkit = new RemoteApiAgentToolkit({ apiKey: remoteApiKey });

  const tools = remoteApiToolkit.getTools();
  console.log(
    "Tools available to the agent:",
    tools.map((t) => t.name)
  );

  const prompt = await pull<ChatPromptTemplate>(
    "hwchase17/structured-chat-agent"
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
        "RemoteAPIToolkit": {
          // You can name this whatever you like
          "command": "/Users/<your_username>/Projects/<your_project_directory_name>/node_modules/.bin/ts-node",
          "args": [
            "/Users/<your_username>/Projects/<your_project_directory_name>/src/mcp/cli.ts"
          ],
          "env": {
            "REMOTE_API_KEY": "your_actual_remote_api_key_from_env_or_direct",
            "PATH": "/Users/<your_username>/.asdf/shims:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin" // Adjust if you use nvm or have node elsewhere; ensure your asdf/nvm shims or node bin path is first
          },
          "workingDirectory": "/Users/<your_username>/Projects/<your_project_directory_name>"
        }
      }
    }
    ```

    **Important Notes for Claude Desktop Config:**

    - **`command`**: This points to your locally installed `ts-node`. If `ts-node` is global and in Claude's PATH, you might simplify it. If you use `asdf` or `nvm`, the direct path to the `node` executable provided by them is most robust, see next point.
    - **`PATH` in `env`**: The provided `PATH` example includes a common location for `asdf` shims. **Adjust this PATH to ensure the `node` executable (used by `ts-node`) can be found.** If you use `nvm`, the path would look different. You can find your node path by running `which node` in your configured terminal. The specific path to the node executable can also be used as the `"command"`, with `ts-node`'s `bin.js` script as the first argument (see previous conversation history for this alternative).
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
