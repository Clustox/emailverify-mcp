#!/usr/bin/env node

/**
 * Test script for EmailVerify MCP Server
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const apiKey = process.argv[2] || 'TEST_KEY';
const toolToCall = process.argv[3];
const toolArgs = process.argv[4] ? JSON.parse(process.argv[4]) : {};

const SERVER_PATH = join(__dirname, 'dist', 'index.js');

console.log(`Starting EmailVerify MCP server test...`);
console.log(`Server path: ${SERVER_PATH}`);
console.log(`Mode: ${toolToCall ? `Call Tool [${toolToCall}]` : 'List Tools Only'}`);

const server = spawn('node', [SERVER_PATH, `--api-key=${apiKey}`], {
  stdio: ['pipe', 'pipe', 'pipe'],
});

server.stderr.on('data', (data) => {
  console.error(`[SERVER STDERR] ${data}`);
});

server.stdout.on('data', (data) => {
  const line = data.toString();
  console.log(`[SERVER STDOUT] ${line}`);
  
  try {
    const response = JSON.parse(line);
    if (response.id === 1) {
       if (toolToCall) {
         // Call specific tool
         const callTool = {
           jsonrpc: '2.0',
           id: 2,
           method: 'tools/call',
           params: {
             name: toolToCall,
             arguments: toolArgs
           }
         };
         server.stdin.write(JSON.stringify(callTool) + '\n');
       } else {
         // Send list tools request
         const listTools = {
           jsonrpc: '2.0',
           id: 2,
           method: 'tools/list',
         };
         server.stdin.write(JSON.stringify(listTools) + '\n');
       }
    } else if (response.id === 2) {
       if (toolToCall) {
         console.log('\n--- TOOL RESULT ---');
         console.log(JSON.stringify(response.result, null, 2));
       } else {
         console.log('Tools found:', response.result.tools.map(t => t.name).join(', '));
       }
       process.exit(0);
    }
  } catch (e) {
    // Not JSON
  }
});

// Initialize request
const initRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: { name: 'test-client', version: '1.0.0' },
  },
};

server.stdin.write(JSON.stringify(initRequest) + '\n');

setTimeout(() => {
  console.error('Test timed out');
  server.kill();
  process.exit(1);
}, 5000);
