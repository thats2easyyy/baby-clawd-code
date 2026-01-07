#!/usr/bin/env bun
import React from 'react';
import { render } from 'ink';
import Sidebar from './Sidebar.js';
import { spawnSidebar, closeSidebar, detectTerminal } from './terminal.js';
import { updateTodos, updateContext, updateTasks, sendToSidebar } from './ipc.js';

const args = process.argv.slice(2);
const command = args[0];

async function main() {
  switch (command) {
    case 'show': {
      // Render the sidebar in the current terminal
      console.clear();
      const { unmount } = render(<Sidebar />, { exitOnCtrlC: true });
      break;
    }

    case 'spawn': {
      // Spawn a new tmux pane with the sidebar
      const { inTmux } = detectTerminal();
      if (!inTmux) {
        console.error('Error: Must be running inside tmux');
        console.error('Start tmux first: tmux new-session');
        process.exit(1);
      }

      const paneId = await spawnSidebar();
      console.log(`Sidebar spawned in pane: ${paneId}`);
      break;
    }

    case 'close': {
      // Close the sidebar pane
      await closeSidebar();
      console.log('Sidebar closed');
      break;
    }

    case 'env': {
      // Show environment info
      const env = detectTerminal();
      console.log('Terminal environment:', env.summary);
      console.log('In tmux:', env.inTmux);
      break;
    }

    case 'update': {
      // Update sidebar data via IPC
      const dataType = args[1]; // todos, context, or tasks
      const dataJson = args[2]; // JSON string

      if (!dataType || !dataJson) {
        console.error('Usage: sidebar update <todos|context|tasks> <json>');
        process.exit(1);
      }

      try {
        const data = JSON.parse(dataJson);
        const result = await sendToSidebar({ type: dataType, data });
        console.log(result.ok ? 'Updated successfully' : 'Update failed');
      } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
      }
      break;
    }

    case 'demo': {
      // Demo: spawn sidebar with sample data
      const { inTmux } = detectTerminal();
      if (!inTmux) {
        console.error('Error: Must be running inside tmux');
        process.exit(1);
      }

      await spawnSidebar();

      // Wait for sidebar to start
      await Bun.sleep(500);

      // Send sample data
      await updateTodos([
        { content: 'Review pull request #42', status: 'completed' },
        { content: 'Fix authentication bug', status: 'in_progress' },
        { content: 'Write unit tests', status: 'pending' },
        { content: 'Update documentation', status: 'pending' },
      ]);

      await updateContext([
        { type: 'file', name: 'src/auth.js', description: 'Authentication module' },
        { type: 'file', name: 'src/api/users.js', description: 'User API endpoints' },
        { type: 'info', name: 'Branch: feature/auth', description: 'Current git branch' },
      ]);

      await updateTasks([
        { name: 'Run tests', description: 'bun test' },
        { name: 'Build', description: 'bun run build' },
        { name: 'Lint', description: 'bun run lint' },
        { name: 'Deploy', description: 'Deploy to staging' },
      ]);

      console.log('Demo sidebar spawned with sample data!');
      break;
    }

    default:
      console.log(`
Claude Code Sidebar

Usage:
  bun src/sidebar/cli.js <command>

Commands:
  spawn    Create a new sidebar pane (requires tmux)
  show     Render sidebar in current terminal
  close    Close the sidebar pane
  env      Show terminal environment info
  update   Update sidebar data via IPC
  demo     Spawn sidebar with sample data

Examples:
  # Start sidebar in tmux
  bun src/sidebar/cli.js spawn

  # Update todos
  bun src/sidebar/cli.js update todos '[{"content":"Fix bug","status":"pending"}]'
`);
  }
}

main().catch(console.error);
