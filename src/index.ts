/**
 * EmailVerify MCP Server
 * Model Context Protocol server for EmailVerify.io email validation
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { EmailVerifyClient } from './emailverify-client.js';
import { getAllTools, getToolRegistry } from './tools/index.js';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { execSync } from 'node:child_process';

interface ServerConfig {
  apiKey: string;
  baseUrl: string;
}

const CONFIG_FILE = join(homedir(), '.emailverify-mcp.json');

class EmailVerifyMCPServer {
  private server: Server;
  private client: EmailVerifyClient;
  private config: ServerConfig;

  constructor(config: ServerConfig) {
    this.config = config;
    this.client = new EmailVerifyClient({
      apiKey: config.apiKey,
      baseUrl: config.baseUrl,
    });

    this.server = new Server(
      {
        name: 'emailverify-mcp',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    const allTools = getAllTools();
    const toolRegistry = getToolRegistry();

    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: allTools.map((tool) => tool.definition),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      const handler = toolRegistry.get(name);
      if (!handler) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: Unknown tool: ${name}`,
            },
          ],
          isError: true,
        };
      }

      try {
        return await handler(this.client, args || {});
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        return {
          content: [
            {
              type: 'text',
              text: `Error executing tool ${name}: ${errorMessage}`,
            },
          ],
          isError: true,
        };
      }
    });

    this.server.setRequestHandler(ListResourcesRequestSchema, async () => ({
      resources: [
        {
          uri: 'emailverify://config',
          name: 'EmailVerify Configuration',
          description: 'Current EmailVerify API configuration',
          mimeType: 'application/json',
        },
      ],
    }));

    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;

      if (uri === 'emailverify://config') {
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(
                {
                  baseUrl: this.config.baseUrl,
                  apiKeyConfigured: !!this.config.apiKey,
                },
                null,
                2
              ),
            },
          ],
        };
      }

      throw new Error(`Unknown resource: ${uri}`);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('EmailVerify MCP server running on stdio');
  }
}

// Load config from file
function loadSavedConfig(): Partial<ServerConfig> {
  if (existsSync(CONFIG_FILE)) {
    try {
      return JSON.parse(readFileSync(CONFIG_FILE, 'utf-8'));
    } catch (e) {
      console.error(`Error reading config file: ${e}`);
    }
  }
  return {};
}

// Save config to file
function saveConfig(config: ServerConfig): void {
  try {
    writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2));
    console.log(`Config saved to ${CONFIG_FILE}`);
  } catch (e) {
    console.error(`Error saving config: ${e}`);
  }
}

// Interactive setup with validation
async function runSetup(): Promise<void> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('\n--- EmailVerify MCP Setup ---');
  
  let validKey = false;
  let apiKey = '';
  const baseUrl = 'https://app.emailverify.io';

  while (!validKey) {
    apiKey = await rl.question('Enter your EmailVerify API key: ');
    
    if (!apiKey) {
      console.error('Error: API Key is required.');
      continue;
    }

    console.log('Validating API key...');
    const client = new EmailVerifyClient({ apiKey, baseUrl });
    
    try {
      await client.validateKey();
      validKey = true;
      console.log('✅ API key is valid!');
    } catch (e) {
      console.error('❌ Error: Invalid API key. Please check your key and try again.');
    }
  }
  
  saveConfig({ apiKey, baseUrl });
  console.log('✅ Configuration saved successfully!');

  // Automatically try to add to Claude Code
  const integrate = await rl.question('\nWould you like to automatically add this server to Claude Code? (y/n): ');
  if (integrate.toLowerCase() === 'y' || integrate === '') {
    try {
      console.log('Integrating with Claude Code...');
      execSync('claude mcp add emailverify -- npx -y @emailverifyio/emailverify-mcp', { stdio: 'inherit' });
      console.log('✅ Successfully added to Claude Code!');
    } catch (e) {
      console.warn('⚠️ Could not automatically add to Claude Code. Please ensure "claude" CLI is installed.');
      console.log('You can manually add it by running: claude mcp add emailverify -- npx -y @emailverifyio/emailverify-mcp');
    }
  }

  rl.close();
  console.log('\nFinal Setup complete! You can now use EmailVerify in your AI tools.');
}

// Parse command line arguments
function parseArgs(): ServerConfig | 'setup' {
  const args = process.argv.slice(2);
  const saved = loadSavedConfig();

  const config: ServerConfig = {
    apiKey: args.find(a => a.startsWith('--api-key='))?.split('=')[1] || saved.apiKey || process.env.EMAILVERIFY_API_KEY || '',
    baseUrl: args.find(a => a.startsWith('--base-url='))?.split('=')[1] || saved.baseUrl || process.env.EMAILVERIFY_BASE_URL || 'https://app.emailverify.io',
  };

  // Check for positional arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === 'setup') return 'setup';

    if ((arg === '--api-key' || arg === '-k') && args[i + 1]) {
      config.apiKey = args[i + 1];
    } else if (arg === '--base-url' && args[i + 1]) {
      config.baseUrl = args[i + 1];
    }
  }

  return config;
}

// Main entry point
async function main(): Promise<void> {
  try {
    const configResult = parseArgs();

    if (configResult === 'setup') {
      await runSetup();
      return;
    }

    if (!configResult.apiKey) {
      console.error('\nError: EmailVerify API key is missing.');
      console.error('Run "emailverify-mcp setup" to configure, or provide it via --api-key flag.\n');
      process.exit(1);
    }

    const server = new EmailVerifyMCPServer(configResult);
    await server.run();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${errorMessage}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
