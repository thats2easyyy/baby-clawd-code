import React from 'react';
import { Box, Text } from 'ink';
import { colors } from '../theme.js';

// Different hint modes for different contexts
const HINTS = {
  command: '↑↓ navigate · Enter select',
  tabs: 'Enter to select · Tab switch · Esc to exit',
  detail: 'Enter to select · Esc to go back',
  initial: 'Type / for commands',
};

const NavHints = ({ mode = 'initial' }) => {
  const hint = HINTS[mode] || HINTS.initial;

  return (
    <Box marginTop={1}>
      <Text color={colors.secondary}>{hint}</Text>
    </Box>
  );
};

export default NavHints;
