# Remote API Agent Toolkit for TypeScript

This package contains the TypeScript implementation of the Remote AI Agent Toolkit. It provides tools for integrating with the Remote API in agentic workflows.

## Installation

```bash
npm install @remoteoss/ai-agent-toolkit
```

## Requirements

- Node.js 18+
- A Remote API Key

## Usage

The library needs to be configured with your Remote API key.

### LangChain Toolkit

To use the toolkit with LangChain, you can instantiate `RemoteApiAgentToolkit` and pass the tools to your agent.

```typescript
import { RemoteApiAgentToolkit } from '@remoteoss/ai-agent-toolkit/langchain';
import { ChatOpenAI } from '@langchain/openai';
import { AgentExecutor, createStructuredChatAgent } from 'langchain/agents';
import { hub } from 'langchain/hub';

// Initialize the toolkit
const toolkit = new RemoteApiAgentToolkit({
  apiKey: process.env.REMOTE_API_KEY!,
});

const tools = toolkit.getTools();

// Initialize the LLM and agent
// This example uses OpenAI, but it's compatible with other models
const llm = new ChatOpenAI({ modelName: 'gpt-4o', temperature: 0 });
const prompt = await hub.pull<any>('hwchase17/structured-chat-agent');

const agent = await createStructuredChatAgent({
  llm,
  tools,
  prompt,
});

const agentExecutor = new AgentExecutor({
  agent,
  tools,
});

const result = await agentExecutor.invoke({
  input: 'Can you list the current employments?',
});

console.log(result);
```

### Tool Configuration

You can configure the tools available to the agent by passing the `allowedTools` array in the toolkit's constructor.

```typescript
const toolkit = new RemoteApiAgentToolkit({
  apiKey: process.env.REMOTE_API_KEY!,
  allowedTools: ['list_employments', 'create_time_off'],
});
```

### Model Context Protocol (MCP) Server

If you have cloned the repository, you can run the MCP server directly.

First, install the dependencies:

```bash
cd mcp
npm install
```

Then, run the server:

```bash
npm run start -- --api-key=YOUR_REMOTE_API_KEY
```

You can also set the `REMOTE_API_KEY` and `ALLOWED_TOOLS` environment variables instead of passing them as arguments.
