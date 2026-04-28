/**
 * Tool: get_bulk_results
 * Get the results of a bulk validation task using EmailVerify API
 */

import type { EmailVerifyClient } from '../emailverify-client.js';
import {
  ToolHandler,
  createSuccessResponse,
  createErrorResponse,
} from './types.js';

export const getBulkResultsTool: ToolHandler = {
  definition: {
    name: 'get_bulk_results',
    description: 'Get the results of a bulk validation task using EmailVerify API. Use the task_id returned by validate_batch.',
    inputSchema: {
      type: 'object',
      properties: {
        taskId: {
          type: 'number',
          description: 'The task ID of the bulk validation task',
        },
      },
      required: ['taskId'],
    },
  },
  handler: async (client: EmailVerifyClient, args: Record<string, unknown>) => {
    try {
      const taskId = args.taskId as number;
      if (!taskId) {
        throw new Error('taskId is required and must be a number');
      }

      const result = await client.getBulkResults(taskId);
      return createSuccessResponse(result);
    } catch (error) {
      return createErrorResponse(error);
    }
  },
};
