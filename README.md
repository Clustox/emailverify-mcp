# EmailVerify MCP Server

[![npm version](https://img.shields.io/npm/v/@emailverifyio/emailverify-mcp.svg)](https://www.npmjs.com/package/@emailverifyio/emailverify-mcp)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE)

A Model Context Protocol (MCP) server for [EmailVerify.io](https://app.emailverify.io). This server enables AI coding assistants and MCP-compatible clients to perform email validation, bulk verification, and email finding directly through the EmailVerify.io API.

## Features

- **Single Email Validation**: Get instant status and sub-status for any email address.
- **Bulk Email Validation**: Start asynchronous bulk verification tasks (Max 250 emails per task).
- **Email Finder**: Locate email addresses using a person's name and domain.
- **Bulk Result Polling**: Fetch results for your bulk tasks once processing is complete.
- **Account Management**: Real-time checking of API credits and account status.
- **Native Implementation**: Built with zero external HTTP dependencies (uses native fetch) for maximum reliability and speed.

## Installation

### Global Installation (Recommended)
You can install the server globally to use it as a command:
```bash
npm install -g @emailverifyio/emailverify-mcp
```

### From Source
1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`

## Configuration

To use this server with an MCP client (like Cursor, VS Code, or Claude Desktop), add it to your configuration.

### 1. Get your API Key
Sign in to your [EmailVerify.io Dashboard](https://app.emailverify.io) to obtain your API key.

### 2. Configure Client

#### Cursor / Claude Desktop / VS Code
Add the following to your MCP settings file:

```json
{
  "mcpServers": {
    "emailverify": {
      "command": "emailverify-mcp",
      "args": ["--api-key=YOUR_API_KEY"]
    }
  }
}
```

*Note: If you are running from source, use the absolute path to `dist/index.js` instead:*
```json
"command": "node",
"args": ["/path/to/emailverify-mcp/dist/index.js", "--api-key=YOUR_KEY"]
```

## Tools

### Validation
- `validate_email`: Validate a single email address.
- `validate_batch`: Start a bulk verification task.
  - `emails`: Array of email addresses (Max 250).
  - `title`: Descriptive title for the task.

### Email Finder
- `find_email`: Search for an email by name and domain.
  - `name`: Full name of the person.
  - `domain`: Company domain (e.g., example.com).

### Account & Results
- `get_balance`: Check your remaining credits and API status.
- `get_bulk_results`: Get results for a bulk task using its `taskId`.

## Development

- **Build**: `npm run build`
- **Watch**: `npm run dev`
- **Test**: `node test-mcp.js`

## Security

Treat your API key as a sensitive password. Never commit it to version control or share your configuration files publicly.

## License

Apache-2.0
