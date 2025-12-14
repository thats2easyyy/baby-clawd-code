import React from 'react';
import { Box, Text } from 'ink';
import { colors } from '../theme.js';

const InputField = ({ value, showCursor = true }) => {
  // Create horizontal line that spans terminal width
  const line = '─'.repeat(60);

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
