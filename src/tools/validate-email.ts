/**
 * Tool: validate_email
 * Validate a single email address using EmailVerify API
 */

import type { EmailVerifyClient } from '../emailverify-client.js';
import {
  ToolHandler,
  createSuccessResponse,
  createErrorResponse,
  requireString,
} from './types.js';

export const validateEmailTool: ToolHandler = {
  definition: {
    name: 'validate_email',
    description:
      'Validate a single email address using EmailVerify API. Returns validation results including status and sub-status.',
    inputSchema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          description: 'The email address to validate',
        },
      },
      required: ['email'],
    },
  },
  handler: async (client: EmailVerifyClient, args: Record<string, unknown>) => {
    try {
      const email = requireString(args.email, 'email');

      const result = await client.validateEmail(email);
      return createSuccessResponse(result);
    } catch (error) {
      return createErrorResponse(error);
    }
  },
};

