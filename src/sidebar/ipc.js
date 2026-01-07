import { SOCKET_PATH } from './terminal.js';
import { unlinkSync } from 'node:fs';

/**
 * Create a Unix socket server to receive updates from Claude Code
 */
export function createServer(onMessage) {
  // Clean up old socket
  try {
    unlinkSync(SOCKET_PATH);
  } catch {}

  const server = Bun.listen({
    unix: SOCKET_PATH,
    socket: {
      data(socket, data) {
        try {
          const message = JSON.parse(data.toString());
          onMessage(message);
          socket.write(JSON.stringify({ ok: true }));
        } catch (err) {
          socket.write(JSON.stringify({ ok: false, error: err.message }));
        }
      },
      open(socket) {},
      close(socket) {},
      error(socket, error) {
        console.error('Socket error:', error);
      },
    },
  });

  // Cleanup on exit
  process.on('exit', () => {
    server.stop();
    try { unlinkSync(SOCKET_PATH); } catch {}
  });

  return server;
}

/**
 * Send a message to the sidebar
 */
export async function sendToSidebar(message) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Timeout waiting for sidebar response'));
    }, 2000);

    const socket = Bun.connect({
      unix: SOCKET_PATH,
      socket: {
        data(socket, data) {
          clearTimeout(timeout);
          try {
            const response = JSON.parse(data.toString());
            resolve(response);
          } catch {
            resolve({ ok: false });
          }
          socket.end();
        },
        open(socket) {
          socket.write(JSON.stringify(message));
        },
        error(socket, error) {
          clearTimeout(timeout);
          reject(error);
        },
        connectError(socket, error) {
          clearTimeout(timeout);
          reject(error);
        },
      },
    });
  });
}

/**
 * Update todos in the sidebar
 */
export async function updateTodos(todos) {
  return sendToSidebar({ type: 'todos', data: todos });
}

/**
 * Update context in the sidebar
 */
export async function updateContext(context) {
  return sendToSidebar({ type: 'context', data: context });
}

/**
 * Update tasks in the sidebar
 */
export async function updateTasks(tasks) {
  return sendToSidebar({ type: 'tasks', data: tasks });
}
