/**
 * Tools Index
 * Exports all tools for use in the MCP server
 */

import { ToolHandler } from './types.js';

// Validation tools
import { validateEmailTool } from './validate-email.js';
import { validateBatchTool } from './validate-batch.js';

// Account tools
import { getBalanceTool } from './get-balance.js';

// Email Finder tools
import { findEmailTool } from './find-email.js';

// Bulk result tools
import { getBulkResultsTool } from './get-bulk-results.js';

// Re-export all tools
export {
  validateEmailTool,
  validateBatchTool,
  getBalanceTool,
  findEmailTool,
  getBulkResultsTool,
};

/**
 * Get all tools as an array
 */
export function getAllTools(): ToolHandler[] {
  return [
    validateEmailTool,
    validateBatchTool,
    getBalanceTool,
    findEmailTool,
    getBulkResultsTool,
  ];
}

/**
 * Get tool registry (map of tool name to handler)
 */
export function getToolRegistry(): Map<string, ToolHandler['handler']> {
  const registry = new Map<string, ToolHandler['handler']>();
  const allTools = getAllTools();

  for (const tool of allTools) {
    registry.set(tool.definition.name, tool.handler);
  }

  return registry;
}

