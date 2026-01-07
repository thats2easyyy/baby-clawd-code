#!/usr/bin/env bun
/**
 * Get the currently selected task from the sidebar
 *
 * Usage:
 *   bun src/sidebar/get-selected-task.js
 *
 * Returns the selected task as JSON, or null if none selected.
 * Use this in CLAUDE.md to let Claude know what task the user wants to work on.
 */

const SELECTED_FILE = process.env.HOME + '/.claude-sidebar/selected.json';

async function main() {
  try {
    const file = Bun.file(SELECTED_FILE);
    if (await file.exists()) {
      const task = await file.json();
      console.log(JSON.stringify(task, null, 2));
      return task;
    }
  } catch {}

  console.log('null');
  return null;
}

main();
