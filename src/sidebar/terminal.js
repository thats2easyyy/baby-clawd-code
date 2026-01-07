import { $ } from 'bun';

const PANE_ID_FILE = '/tmp/claude-sidebar-pane-id';
const SOCKET_PATH = '/tmp/claude-sidebar.sock';

/**
 * Detect if we're running inside tmux
 */
export function detectTerminal() {
  const inTmux = !!process.env.TMUX;
  return { inTmux, summary: inTmux ? 'tmux' : 'no tmux' };
}

/**
 * Get the cached sidebar pane ID if it still exists
 */
async function getExistingPaneId() {
  try {
    const file = Bun.file(PANE_ID_FILE);
    if (!await file.exists()) return null;

    const paneId = (await file.text()).trim();
    if (!paneId) return null;

    // Verify pane still exists
    const result = await $`tmux display-message -p -t ${paneId} '#{pane_id}'`.quiet().nothrow();
    if (result.exitCode === 0) {
      return paneId;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Create a new tmux pane for the sidebar
 */
async function createNewPane(command) {
  // Split horizontally, giving sidebar 30% width on the right
  const result = await $`tmux split-window -h -p 30 -P -F '#{pane_id}' ${command}`.quiet();
  const paneId = result.stdout.toString().trim();

  // Cache the pane ID
  await Bun.write(PANE_ID_FILE, paneId);

  return paneId;
}

/**
 * Reuse an existing pane by sending a new command
 */
async function reuseExistingPane(paneId, command) {
  // Send Ctrl+C to stop any running process
  await $`tmux send-keys -t ${paneId} C-c`.quiet().nothrow();
  await Bun.sleep(150);

  // Send the new command
  await $`tmux send-keys -t ${paneId} ${command} Enter`.quiet();

  return paneId;
}

/**
 * Spawn the sidebar in a tmux pane
 */
export async function spawnSidebar(options = {}) {
  const { inTmux } = detectTerminal();

  if (!inTmux) {
    console.error('Error: Must be running inside tmux to spawn sidebar');
    process.exit(1);
  }

  const scriptPath = import.meta.dir + '/cli.js';
  const command = `bun ${scriptPath} show`;

  // Try to reuse existing pane
  const existingPaneId = await getExistingPaneId();

  if (existingPaneId) {
    return reuseExistingPane(existingPaneId, command);
  }

  return createNewPane(command);
}

/**
 * Close the sidebar pane
 */
export async function closeSidebar() {
  const paneId = await getExistingPaneId();
  if (paneId) {
    await $`tmux kill-pane -t ${paneId}`.quiet().nothrow();
    await Bun.file(PANE_ID_FILE).unlink().catch(() => {});
  }
}

export { SOCKET_PATH, PANE_ID_FILE };
