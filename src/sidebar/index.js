// Sidebar module - spawn a Claude Code sidebar panel
export { spawnSidebar, closeSidebar, detectTerminal, SOCKET_PATH } from './terminal.js';
export { updateTodos, updateContext, updateTasks, sendToSidebar } from './ipc.js';
export { default as Sidebar } from './Sidebar.js';
