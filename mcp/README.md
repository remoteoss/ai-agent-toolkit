# Remote API - Model-Context-Protocol (MCP) Server

This directory contains a standalone server that implements the [Model-Context-Protocol (MCP)](https://github.com/model-context-protocol/specification). It acts as a bridge between an AI agent and the Remote API, allowing the agent to access a suite of tools for interacting with Remote's services.

## What is it for?

You can run this server as a separate process that your AI agent can connect to. The agent communicates with this server using the MCP standard over standard I/O. The server then translates the agent's requests into calls to the Remote API, returning the results back to the agent.

This is useful for:

- Integrating Remote's features into any MCP-compatible AI agent.
- Offloading API authentication and interaction from the main agent process.
- Selectively exposing only a specific set of Remote API tools to an agent.

## Setup

First, install the dependencies:

```bash
npm install
```

## Running the server

You can start the server from the root of this `mcp` directory. You will need a Remote API key.

```bash
npx ts-node src/index.ts --api-key=YOUR_REMOTE_API_KEY
```

The server will start and listen for MCP messages on `stdin`. All server logs and status messages are printed to `stderr`, while `stdout` is reserved for MCP communication with the agent.

When the server is running successfully, you'll see:

```
✅ Remote API MCP Server running on stdio
```

## Configuration

The server can be configured via command-line arguments or environment variables.

| Argument         | Environment Variable   | Description                                                                                                    | Required |
| ---------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------- | -------- |
| `--api-key`      | `REMOTE_API_KEY`       | Your Remote API key.                                                                                           | Yes      |
| `--api-base-url` | `REMOTE_API_BASE_URL`  | The base URL for the Remote API. Defaults to the production URL.                                               | No       |
| `--tools`        | `REMOTE_ALLOWED_TOOLS` | A comma-separated list of tool names to expose to the agent. If not provided, all available tools are exposed. | No       |

### Exposing Specific Tools

You can limit which tools the agent can access using the `--allowed-tools` flag. This is useful for security and for ensuring the agent only has access to the functions it needs for a specific task.

Provide a comma-separated list of tool names. For example, to only allow the agent to list countries and time off requests, you would run:

```bash
npx ts-node src/index.ts \
  --api-key=YOUR_REMOTE_API_KEY \
  --allowed-tools=listCountries,listTimeOffRequests
```

This enhances security by restricting the capabilities of the agent to only what's necessary.
