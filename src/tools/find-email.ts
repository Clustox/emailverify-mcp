/**
 * Tool: find_email
 * Find an email address based on domain and name
 */

import type { EmailVerifyClient } from '../emailverify-client.js';
import {
  ToolHandler,
  createSuccessResponse,
  createErrorResponse,
  requireString,
} from './types.js';

export const findEmailTool: ToolHandler = {
  definition: {
    name: 'find_email',
    description: 'Find an email address based on domain and name using EmailVerify API.',
    inputSchema: {
      type: 'object',
      properties: {
        domain: {
          type: 'string',
          description: 'Domain to search for email addresses (e.g., example.com)',
        },
        name: {
          type: 'string',
          description: 'Full name of the person',
        },
      },
      required: ['domain', 'name'],
    },
  },
  handler: async (client: EmailVerifyClient, args: Record<string, unknown>) => {
    try {
      const domain = requireString(args.domain, 'domain');
      const name = requireString(args.name, 'name');

      const result = await client.findEmail(name, domain);
      return createSuccessResponse(result);
    } catch (error) {
      return createErrorResponse(error);
    }
  },
};

