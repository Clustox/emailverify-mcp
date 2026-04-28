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

interface ServerConfig {
  apiKey: string;
  baseUrl: string;
}

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

// Parse command line arguments
function parseArgs(): ServerConfig {
  const args = process.argv.slice(2);
  const config: ServerConfig = {
    apiKey: '',
    baseUrl: 'https://app.emailverify.io',
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const nextArg = args[i + 1];

    if (arg === '--api-key' || arg === '-k') {
      if (nextArg) {
        config.apiKey = nextArg;
        i++;
      } else {
        throw new Error('--api-key requires a value');
      }
    } else if (arg.startsWith('--api-key=')) {
      config.apiKey = arg.split('=')[1];
    } else if (arg === '--base-url') {
      if (nextArg) {
        config.baseUrl = nextArg;
        i++;
      } else {
        throw new Error('--base-url requires a value');
      }
    } else if (arg.startsWith('--base-url=')) {
      config.baseUrl = arg.split('=')[1];
    }
  }

  if (!config.apiKey) {
    throw new Error(
      'EmailVerify API key is required. Provide it via --api-key flag.'
    );
  }

  return config;
}

// Main entry point
async function main(): Promise<void> {
  try {
    const config = parseArgs();
    const server = new EmailVerifyMCPServer(config);
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

