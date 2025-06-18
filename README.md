# Remote AI Agent Toolkit

The Remote AI Agent Toolkit enables popular agent frameworks, including LangChain and the Model Context Protocol (MCP), to integrate with the Remote APIs through function calling. The library is built on top of the [Remote API](https://developer.remote.com/docs/getting-started).

This repository contains:

- [TypeScript Toolkit](./typescript)
- [Model Context Protocol (MCP) server](./mcp)

## What can I use this for?

You can use this toolkit to build AI agents that can interact with your Remote account. For example, you could build an agent that does the following:

- **Automated HR Assistant**: An AI-powered chatbot that can answer employee questions about their leave balance, company policies, or the status of their time off requests. It could also help managers approve or decline time off requests directly from a chat interface like Slack.

- **Automated Onboarding/Offboarding**: When a new employee is hired (or leaves the company), an agent could automatically trigger a sequence of actions, like creating necessary accounts, scheduling introduction meetings, or ensuring final payslips are processed correctly.

- **Expense Management**: An agent could help employees submit expenses by guiding them through the process, and automatically categorize and submit them for approval.

## Getting Started

To use the toolkit, you need a Remote API key.

### Finding your API Key

You can create and find your API key in your Remote dashboard. For a detailed guide on how to get your API key, please follow the instructions in our **[Quick Start Guide](https://developer.remote.com/docs/quick-start-guide)**.

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

You can control which tools are available by passing the `allowedTools` option to the `RemoteApiAgentToolkit` constructor.

```typescript
const toolkit = new RemoteApiAgentToolkit({
  apiKey: process.env.REMOTE_API_KEY!,
  allowedTools: ["list_employments", "create_time_off"],
});

const tools = toolkit.getTools();
```

This will restrict the agent to only use the `list_employments` and `create_time_off` tools.

### Model Context Protocol (MCP)

The Remote Agent Toolkit also supports the Model Context Protocol (MCP). To run the MCP server, you can use `npx`:

```bash
npx -y @remoteoss/mcp --api-key=YOUR_REMOTE_API_KEY
```

Replace `YOUR_REMOTE_API_KEY` with your actual Remote API key, or set the `REMOTE_API_KEY` environment variable.

For more detailed information, please refer to the [MCP package README](./mcp/README.md).

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

For more detailed information, please refer to the [TypeScript package README](./typescript/README.md) and the [MCP package README](./mcp/README.md).
