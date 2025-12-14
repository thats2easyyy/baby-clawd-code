import React from 'react';
import { Box, Text, useStdout } from 'ink';
import { colors } from '../theme.js';

const InputField = ({ value, showCursor = true }) => {
  const { stdout } = useStdout();
  const terminalWidth = stdout?.columns || 80;

  // Create horizontal line that spans terminal width
  const line = '─'.repeat(terminalWidth - 2);

  return (
    <Box flexDirection="column">
      <Text color={colors.secondary}>{line}</Text>
      <Box>
        <Text color={colors.secondary}>{'>'} </Text>
        <Text>{value}</Text>
        {showCursor && <Text color={colors.selected}>|</Text>}
      </Box>
      <Text color={colors.secondary}>{line}</Text>
    </Box>
  );
};

export default InputField;
