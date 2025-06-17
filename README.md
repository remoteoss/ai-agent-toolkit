# Remote AI Agent Toolkit

The Remote AI Agent Toolkit enables popular agent frameworks, including LangChain and the Model Context Protocol (MCP), to integrate with the Remote APIs through function calling. The library is built on top of the [Remote API](https://developer.remote.com/docs/getting-started).

This repository contains:

- [TypeScript Toolkit](./typescript)

## TypeScript

### Installation

You don't need to clone this repository to use the toolkit. You can install it directly from npm:

```bash
npm install @remoteoss/ai-agent-toolkit
```

### Requirements

- Node.js 18+

### Usage

The library needs to be configured with your Remote API key.

#### LangChain

The toolkit can be passed as a list of tools to a LangChain agent.

```typescript
import { RemoteApiAgentToolkit } from "remote-ai-agent-toolkit/langchain";
import { AgentExecutor, createStructuredChatAgent } from "langchain/agents";

const toolkit = new RemoteApiAgentToolkit({
  apiKey: process.env.REMOTE_API_KEY!,
});

const tools = toolkit.getTools();

// ... create your agent with the tools
const agentExecutor = new AgentExecutor({
  agent,
  tools,
});
```

#### Tool Configuration

You can control which tools are available by setting the `ALLOWED_TOOLS` environment variable with a comma-separated list of tool names.

```bash
export ALLOWED_TOOLS="list_employments,create_time_off"
```

This will restrict the agent to only use the `list_employments` and `create_time_off` tools.

### Model Context Protocol (MCP)

The Remote Agent Toolkit also supports the Model Context Protocol (MCP). To run the MCP server, you can use `npx`:

```bash
npx -y @remoteoss/mcp --api-key=YOUR_REMOTE_API_KEY
```

Replace `YOUR_REMOTE_API_KEY` with your actual Remote API key, or set the `REMOTE_API_KEY` environment variable.

## Supported API Methods

The toolkit provides a set of tools to interact with the Remote API. The available tools include:

- Approve a Cancel Request
- Approve a Time Off request
- Approve a Timesheet
- Cancel a Time Off request
- Create an Expense
- Create a Time Off request
- Decline a Cancel Request
- Decline a Time Off request
- Get an Expense
- Get a Timesheet
- Get a Time Off request
- Get Leave Balance
- Get Leave Policies Details
- List Company Managers
- List Employments
- List Expenses
- List Payslips
- List Payroll Runs
- List Time Off requests
- List Time Off Types
- List Timesheets
- Send Back a Timesheet
- Show an Employment
- Show a Payroll Run
- Update an Expense
- Update a Time Off request

For more detailed information, please refer to the [TypeScript package README](./typescript/README.md).
