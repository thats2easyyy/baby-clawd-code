import React from 'react';
import { render } from 'ink';
import App from './App.js';

const { unmount } = render(<App />, { exitOnCtrlC: false });

process.on('SIGINT', () => {
  // Let the app handle Ctrl+C
});
