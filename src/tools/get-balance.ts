/**
 * Tool: get_balance
 * Get account balance and status from EmailVerify API
 */

import type { EmailVerifyClient } from '../emailverify-client.js';
import { ToolHandler, createSuccessResponse, createErrorResponse } from './types.js';

export const getBalanceTool: ToolHandler = {
  definition: {
    name: 'get_balance',
    description: 'Get account balance and status from EmailVerify API.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  handler: async (client: EmailVerifyClient) => {
    try {
      const result = await client.getAccountBalance();
      return createSuccessResponse(result);
    } catch (error) {
      return createErrorResponse(error);
    }
  },
};
