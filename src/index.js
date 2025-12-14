import React from 'react';
import { render } from 'ink';
import App from './App.js';

// Clear the terminal to hide "bun run start" output
console.clear();

const { unmount } = render(<App />, { exitOnCtrlC: false });

process.on('SIGINT', () => {
  // Let the app handle Ctrl+C
});
