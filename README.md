# Email Verification & Discovery MCP Server (@emailverifyio/emailverify-mcp)

### Professional Email Validation & Discovery for AI Tools (Cursor, Claude, VS Code)

This is the official **MCP (Model Context Protocol)** server for **EmailVerify.io**. It enables AI coding assistants and LLMs to perform real-time **email verification**, **bulk email validation**, and **professional email discovery** directly within your conversation.

🚀 Boost your AI's capabilities with accurate, SMTP-level email intelligence.

- **Real-time Email Verification**: Instant SMTP-level checks.
- **Identify Risky Emails**: Detect disposable, catch-all, and fraudulent addresses.
- **Professional Email Finder**: Discover contact information by name and domain.
- **Account Credit Tracking**: Monitor your EmailVerify.io balance via AI.
- **High Performance**: Sub-100ms API response times.

👉 **Start for free:** [https://emailverify.io](https://emailverify.io)

---

## Why use EmailVerify.io for MCP?
- ⚡ **Turbo Speed**: Optimized for AI-workflow latency.
- 🎯 **Pinpoint Accuracy**: Advanced SMTP-level checks and domain analysis.
- 💰 **Cost-Efficient**: 10x more affordable than competitors.
- 🔌 **Universal Integration**: Fully compatible with Cursor, Claude, n8n, and more.

---

## 🚀 Get Started (Zero-Config Setup)

The easiest way to integrate EmailVerify with your AI tools is our built-in configuration tool.

1.  **Run the Master Setup**:
    ```bash
    npx @emailverifyio/emailverify-mcp setup
    ```
    *This will prompt you for your **API key**, validate it, and then offer to **automatically configure Claude Code** for you.*

2.  **Start Using**:
    * **Claude Code / CLI**: Simply run `claude` and start using the tools.
    * **Other Tools**: Follow the detailed guide below.

---

## 🔌 Manual Integration Guide

Since you've already run the `setup`, you don't need to pass your API key again. Use the commands below for your preferred tools:

### **Cursor IDE**
1. Open **Cursor Settings** (`Ctrl + Shift + J`).
2. Navigate to **General** -> **MCP**.
3. Click **+ Add New MCP Server**.
4. **Name**: `emailverify`
5. **Type**: `command`
6. **Command**:
   ```bash
   npx @emailverifyio/emailverify-mcp
   ```

### **Claude Desktop**
Add this to your configuration file (`claude_desktop_config.json`):

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

### **Zed Editor**
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

## 🛠 Available Tools (Operations)

### **1. Email Validation (`validate_email`)**
Verify if an email address is valid, deliverable, or disposable.
- **Parameters:** `email` (string)

### **2. Bulk Email Validation (`validate_batch`)**
Validate lists of up to 250 emails asynchronously.
- **Parameters:** `emails` (array), `title` (string)

### **3. Email Finder (`find_email`)**
Discover a professional's email address using their name and company domain.
- **Parameters:** `name` (string), `domain` (string)

### **4. Account Balance (`get_balance`)**
Check your API credits and subscription status.
- **Parameters:** None

---

## 💡 Practical AI Use Cases

### **Sales & Prospecting**
*"Find the email for John Doe at stripe.com and verify if it is safe to send."*

### **Data Quality**
*"I have a list of signups in this CSV. Use EmailVerify to flag any disposable or invalid emails."*

### **Lead Qualification**
*"Check if the users in this list have valid company emails before I add them to my CRM."*

---

## 🔧 Technical Details
- **Node.js**: Required version 18.0.0+
- **Security**: API keys are stored locally and never transmitted to third parties except for EmailVerify.io API calls.
- **Compliance**: Fully supports the Model Context Protocol (MCP) standard.

## 🔗 Official Links
- [EmailVerify.io Website](https://emailverify.io)
- [API Reference](https://app.emailverify.io/api-docs)
- [NPM Package](https://www.npmjs.com/package/@emailverifyio/emailverify-mcp)

## 📄 License
Apache-2.0
