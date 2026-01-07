#!/usr/bin/env bun
/**
 * Claude Code Hook: Sync TodoWrite updates to the sidebar
 *
 * This hook runs after TodoWrite tool calls and syncs the todos
 * to ~/.claude-sidebar/todos.json for the sidebar to display.
 *
 * Configure in .claude/settings.json:
 * {
 *   "hooks": {
 *     "PostToolUse": [{
 *       "matcher": "TodoWrite",
 *       "command": "bun /path/to/sync-todos-hook.js"
 *     }]
 *   }
 * }
 */

import { mkdir } from 'node:fs/promises';

const DATA_DIR = process.env.HOME + '/.claude-sidebar';
const TODOS_FILE = DATA_DIR + '/todos.json';

async function main() {
  // Read hook input from stdin (Claude Code passes tool result as JSON)
  let input = '';
  for await (const chunk of Bun.stdin.stream()) {
    input += new TextDecoder().decode(chunk);
  }

  if (!input.trim()) {
    // No input - might be called directly for testing
    console.log('No input received. This hook expects TodoWrite output on stdin.');
    return;
  }

  try {
    const hookData = JSON.parse(input);

    // Extract todos from the tool input (TodoWrite receives todos as parameter)
    const todos = hookData?.tool_input?.todos || hookData?.todos || [];

    if (todos.length > 0) {
      // Ensure directory exists
      await mkdir(DATA_DIR, { recursive: true });

      // Write todos to file
      await Bun.write(TODOS_FILE, JSON.stringify(todos, null, 2));

      // Also try to send via IPC if sidebar is running
      try {
        const socket = await Bun.connect({
          unix: '/tmp/claude-sidebar.sock',
          socket: {
            data() {},
            open(socket) {
              socket.write(JSON.stringify({ type: 'todos', data: todos }));
              socket.end();
            },
            error() {},
            connectError() {},
          },
        });
      } catch {
        // Sidebar not running, that's fine
      }
    }
  } catch (err) {
    // Silent fail - don't break Claude Code
    console.error('Hook error:', err.message);
  }
}

main();
