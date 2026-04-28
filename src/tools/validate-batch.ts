/**
 * Tool: validate_batch
 * Validate multiple email addresses in bulk using EmailVerify API
 */

import type { EmailVerifyClient } from '../emailverify-client.js';
import {
  ToolHandler,
  createSuccessResponse,
  createErrorResponse,
  requireArray,
  requireString,
} from './types.js';

export const validateBatchTool: ToolHandler = {
  definition: {
    name: 'validate_batch',
    description:
      'Validate multiple email addresses in bulk. This starts an asynchronous task and returns a task_id which can be used to poll for results.',
    inputSchema: {
      type: 'object',
      properties: {
        emails: {
          type: 'array',
          items: {
            type: 'string',
          },
          description: 'Array of email addresses to validate',
        },
        title: {
          type: 'string',
          description: 'A descriptive title for this bulk validation task',
        },
      },
      required: ['emails', 'title'],
    },
  },
  handler: async (client: EmailVerifyClient, args: Record<string, unknown>) => {
    try {
      const emails = requireArray<string>(args.emails, 'emails');
      const title = requireString(args.title, 'title');

      const result = await client.validateBatch(emails, title);
      return createSuccessResponse(result);
    } catch (error) {
      return createErrorResponse(error);
    }
  },
};

