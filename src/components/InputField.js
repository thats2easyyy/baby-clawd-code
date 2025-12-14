import React from 'react';
import { Box, Text, useStdout } from 'ink';
import { colors } from '../theme.js';

const InputField = ({ value, showCursor = true }) => {
  const { stdout } = useStdout();
  const terminalWidth = stdout?.columns || 80;

  // Create horizontal line that spans terminal width
  const line = '─'.repeat(terminalWidth);

  // Calculate padding to fill the line to match border width
  const promptLength = 2; // "> "
  const cursorLength = showCursor ? 1 : 0;
  const contentLength = promptLength + value.length + cursorLength;
  const padding = ' '.repeat(Math.max(0, terminalWidth - contentLength));

  return (
    <Box flexDirection="column">
      <Text color={colors.secondary}>{line}</Text>
      <Box>
        <Text color={colors.secondary}>{'>'} </Text>
        <Text>{value}</Text>
        {showCursor && <Text color={colors.selected}>|</Text>}
        <Text>{padding}</Text>
      </Box>
      <Text color={colors.secondary}>{line}</Text>
    </Box>
  );
};

export default InputField;
