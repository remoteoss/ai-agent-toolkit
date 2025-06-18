# Remote AI Agent Toolkit: Model Context Protocol

The Remote Agent Toolkit supports the Model Context Protocol (MCP).

## Getting Started

You don't need to clone this repository to use the toolkit. You can run the MCP server directly using `npx`.

The server acts as a bridge between an AI agent and the Remote API, allowing the agent to access a suite of tools for interacting with Remote's services.

### Requirements

- Node.js 18+
- A Remote API key

## Usage

To run the MCP server, you can use `npx`:

```bash
npx -y @remoteoss/mcp --api-key=YOUR_REMOTE_API_KEY
```

Replace `YOUR_REMOTE_API_KEY` with your actual Remote API key. Alternatively, you can set the `REMOTE_API_KEY` environment variable.

The server will start and listen for MCP messages on `stdin` and `stdout`. All server logs and status messages are printed to `stderr`.

When the server is running successfully, you'll see:

```
✅ Remote API MCP Server running on stdio
```

## Tool Configuration

You can control which tools are available by passing the `--tools` option to the `npx` command. This is useful for security and for ensuring the agent only has access to the functions it needs for a specific task.

Provide a comma-separated list of tool names. For example, to only allow the agent to list employments and create time off requests, you would run:

```bash
npx -y @remoteoss/mcp \
  --api-key=YOUR_REMOTE_API_KEY \
  --tools=list_employments,create_time_off
```

This enhances security by restricting the capabilities of the agent to only what's necessary.

## Advanced Configuration

The server can be configured via command-line arguments or environment variables.

| Argument         | Environment Variable   | Description                                                                                                    | Required |
| ---------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------- | -------- |
| `--api-key`      | `REMOTE_API_KEY`       | Your Remote API key.                                                                                           | Yes      |
| `--tools`        | `REMOTE_ALLOWED_TOOLS` | A comma-separated list of tool names to expose to the agent. If not provided, all available tools are exposed. | No       |
| `--api-base-url` | `REMOTE_API_BASE_URL`  | The base URL for the Remote API. Defaults to the production URL.                                               | No       |

## Usage with Claude Desktop

Add the following to your claude_desktop_config.json. See [here](https://modelcontextprotocol.io/quickstart/user) for more details.

```json
{
  "mcpServers": {
    "remote": {
      "command": "npx",
      "args": ["-y", "@remoteoss/mcp", "--api-key=REMOTE_API_KEY"]
    }
  }
}
```
