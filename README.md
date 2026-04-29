# EmailVerify MCP Server

A Model Context Protocol (MCP) server that provides professional email validation and discovery capabilities using [EmailVerify.io](https://emailverify.io). This server enables LLMs to verify email deliverability, detect risky addresses, and find professional contact information directly within your AI chat.

## Key Features

- **Sub-100ms API Response**: Optimized for real-time AI workflows.
- **High Accuracy**: Advanced SMTP-level verification and domain analysis.
- **Enterprise Ready**: Detects catch-all, disposable, and fraudulent emails.
- **Professional Discovery**: Find verified email addresses by name and domain.
- **Deterministic Tools**: Structured data output for reliable LLM reasoning.

## Requirements

- **Node.js**: 18.0.0 or newer
- **MCP Client**: Cursor, Claude Desktop, Claude Code, VS Code, or any other compatible client.

## Getting started

First, install and configure the EmailVerify MCP server using the Master Setup command.

### 🚀 Master Setup (Zero-Config)

```bash
npx @emailverifyio/emailverify-mcp setup
```
*This command will prompt you for your API key, validate it, and automatically offer to configure Claude Code for you. Your key is saved locally in `~/.emailverify-mcp.json`.*

### Standard Configuration

For most tools, use the following JSON configuration:

```json
{
  "mcpServers": {
    "emailverify": {
      "command": "npx",
      "args": [
        "-y",
        "@emailverifyio/emailverify-mcp"
      ]
    }
  }
}
```

---

## 🔌 Integration Guide (All Clients)

### Amp
Add via the Amp VS Code extension settings screen or by updating your `settings.json` file:
```json
"amp.mcpServers": {
  "emailverify": {
    "command": "npx",
    "args": ["-y", "@emailverifyio/emailverify-mcp"]
  }
}
```

### Antigravity
Add via the Antigravity settings or by updating your configuration file:
```json
"mcpServers": {
  "emailverify": {
    "command": "npx",
    "args": ["-y", "@emailverifyio/emailverify-mcp"]
  }
}
```

### Claude Code
Use the Claude Code CLI to add the server:
```bash
claude mcp add emailverify -- npx -y @emailverifyio/emailverify-mcp
```

### Claude Desktop
Add to your `claude_desktop_config.json` (Windows: `%APPDATA%\Claude\`, Mac/Linux: `~/.config/Claude/`):
```json
{
  "mcpServers": {
    "emailverify": {
      "command": "npx",
      "args": ["-y", "@emailverifyio/emailverify-mcp"]
    }
  }
}
```

### Cline
Add the standard config to your `cline_mcp_settings.json` file:
```json
{
  "mcpServers": {
    "emailverify": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@emailverifyio/emailverify-mcp"]
    }
  }
}
```

### Codex
Use the Codex CLI:
```bash
codex mcp add emailverify npx "@emailverifyio/emailverify-mcp"
```

### Copilot CLI
Use the interactively or add to `~/.copilot/mcp-config.json`:
```json
{
  "mcpServers": {
    "emailverify": {
      "command": "npx",
      "args": ["-y", "@emailverifyio/emailverify-mcp"]
    }
  }
}
```

### Cursor
Go to **Cursor Settings** -> **MCP** -> **Add new MCP Server**. 
- **Name**: `emailverify`
- **Type**: `command`
- **Command**: `npx @emailverifyio/emailverify-mcp`

### Factory / Droid
Use the Factory CLI:
```bash
droid mcp add emailverify "npx -y @emailverifyio/emailverify-mcp"
```

### Gemini CLI
Follow the MCP install guide and use the standard config.

### Goose
Go to **Advanced settings** -> **Extensions** -> **Add custom extension**.
- **Type**: `STDIO`
- **Command**: `npx`
- **Args**: `["-y", "@emailverifyio/emailverify-mcp"]`

### Junie
Add to `.junie/mcp/mcp.json`:
```json
{
  "mcpServers": {
    "emailverify": {
      "command": "npx",
      "args": ["-y", "@emailverifyio/emailverify-mcp"]
    }
  }
}
```

### Kiro
Add to `.kiro/settings/mcp.json`:
```json
{
  "mcpServers": {
    "emailverify": {
      "command": "npx",
      "args": ["-y", "@emailverifyio/emailverify-mcp"]
    }
  }
}
```

### LM Studio
Go to **Program** -> **Install** -> **Edit mcp.json** and use the standard config.

### opencode
Add to `~/.config/opencode/opencode.json`:
```json
"mcp": {
  "emailverify": {
    "type": "local",
    "command": ["npx", "-y", "@emailverifyio/emailverify-mcp"],
    "enabled": true
  }
}
```

### Qodo Gen
Open Qodo Gen chat panel -> **Connect more tools** -> **+ Add new MCP** -> Paste standard config.

### VS Code
Use the VS Code CLI:
```bash
code --add-mcp '{"name":"emailverify","command":"npx","args":["-y","@emailverifyio/emailverify-mcp"]}'
```

### Warp
Go to **Settings** -> **AI** -> **Manage MCP Servers** -> **+ Add** and use the standard config.

### Windsurf
Follow Windsurf MCP documentation and use the standard config.

### Zed Editor
Add this to your `settings.json`:
```json
{
  "node": {
    "mcp_servers": {
      "emailverify": {
        "command": "npx",
        "args": ["-y", "@emailverifyio/emailverify-mcp"]
      }
    }
  }
}
```

---

## 🛠 Tools

### Core Validation

| Tool | Description | Parameters |
|------|-------------|------------|
| `validate_email` | Verify a single email address for deliverability and risk. | `email` (string) |
| `validate_batch` | Start an asynchronous task to validate up to 250 emails. | `emails` (array), `title` (string) |

### Discovery & Account

| Tool | Description | Parameters |
|------|-------------|------------|
| `find_email` | Discover a professional email using a person's name and domain. | `name` (string), `domain` (string) |
| `get_balance` | Check your remaining credits and account status. | None |
| `get_bulk_results` | Retrieve results for a previously started bulk validation task. | `taskId` (string) |

---

## 💡 Practical AI Use Cases

### **Sales & Prospecting**
> "Find the email for John Doe at stripe.com and tell me if it's safe to send."

### **List Cleaning**
> "I have a list of emails in this file. Use EmailVerify to check them and highlight which ones are disposable or catch-all."

---

## ⚙️ Configuration

The server supports the following command-line flags:

| Option | Description | Environment Variable |
|--------|-------------|----------------------|
| `--api-key` | Your EmailVerify.io API Key | `EMAILVERIFY_API_KEY` |
| `--base-url` | API Base URL (Default: https://app.emailverify.io) | `EMAILVERIFY_BASE_URL` |

---

## 🔗 Resources
- [EmailVerify.io Website](https://emailverify.io)
- [API Documentation](https://app.emailverify.io/api-docs)

## 📄 License
Apache-2.0
