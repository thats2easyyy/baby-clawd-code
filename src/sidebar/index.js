// Sidebar module - spawn a Claude Code sidebar panel
export { spawnSidebar, closeSidebar, detectTerminal, SOCKET_PATH } from './terminal.js';
export { updateTodos, updateContext, updateTasks, sendToSidebar } from './ipc.js';
export { default as Sidebar } from './Sidebar.js';

// Data file paths
export const DATA_DIR = process.env.HOME + '/.claude-sidebar';
export const TASKS_FILE = DATA_DIR + '/tasks.json';
export const TODOS_FILE = DATA_DIR + '/todos.json';
export const SELECTED_FILE = DATA_DIR + '/selected.json';
export const CONTEXT_FILE = DATA_DIR + '/context.json';
