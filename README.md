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
import { RemoteApiAgentToolkit } from "@remoteoss/ai-agent-toolkit/langchain";
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

The toolkit provides a set of tools to interact with the Remote API. The following table shows all available tools, their purposes, and their internal names (for use with the `allowedTools` configuration):

| Tool Name                   | Purpose                                               | Internal Name                 |
| --------------------------- | ----------------------------------------------------- | ----------------------------- |
| Approve Cancel Request      | Approve a request to cancel time off                  | `approve_cancel_request`      |
| Approve Time Off            | Approve a pending time off request                    | `approve_time_off`            |
| Approve Timesheet           | Approve a submitted timesheet                         | `approve_timesheet`           |
| Cancel Time Off             | Cancel an existing time off request                   | `cancel_time_off`             |
| Create Expense              | Create a new expense record                           | `create_expense`              |
| Create Time Off             | Create a new time off request (pre-approved)          | `create_time_off`             |
| Decline Cancel Request      | Decline a request to cancel time off                  | `decline_cancel_request`      |
| Decline Time Off            | Decline a pending time off request                    | `decline_time_off`            |
| Get Expense                 | Retrieve details of a specific expense                | `get_expense`                 |
| Get Time Off                | Retrieve details of a specific time off request       | `get_time_off`                |
| Get Timesheet               | Retrieve details of a specific timesheet              | `get_timesheet`               |
| List Company Managers       | List all company managers                             | `list_company_managers`       |
| List Employments            | List employment records with filtering options        | `list_employments`            |
| List Expenses               | List expense records with filtering and pagination    | `list_expenses`               |
| List Incentives             | List incentive records                                | `list_incentives`             |
| List Leave Balances         | Get leave policy balances for an employment           | `list_leave_balances`         |
| List Leave Policies Details | Get detailed leave policy information                 | `list_leave_policies_details` |
| List Payroll Runs           | List payroll runs with filtering options              | `list_payroll_runs`           |
| List Payslips               | List payslips for employments                         | `list_payslips`               |
| List Time Off               | List time off requests with filtering and pagination  | `list_time_off`               |
| List Time Off Types         | List available time off types                         | `list_time_off_types`         |
| List Timesheets             | List timesheets with filtering options                | `list_timesheets`             |
| Send Back Timesheet         | Send back a timesheet for revision                    | `send_back_timesheet`         |
| Show Employment             | Get detailed information about a specific employment  | `show_employment`             |
| Show Payroll Run            | Get detailed information about a specific payroll run | `show_payroll_run`            |
| Update Expense              | Update an existing expense record                     | `update_expense`              |
| Update Time Off             | Update an existing time off request                   | `update_time_off`             |

For more detailed information, please refer to the [TypeScript package README](./typescript/README.md) and the [MCP package README](./mcp/README.md).
