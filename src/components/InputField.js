import React from 'react';
import { Box, Text, useStdout } from 'ink';
import { colors } from '../theme.js';

const InputField = ({ value, showCursor = true, placeholder = '' }) => {
  const { stdout } = useStdout();
  const terminalWidth = stdout?.columns || 80;

  // Create horizontal line that spans terminal width
  const line = '─'.repeat(terminalWidth);

  // Show placeholder when value is empty
  const showPlaceholder = !value && placeholder;
  const displayText = showPlaceholder ? placeholder : value;

  // Calculate padding to fill the line to match border width
  const promptLength = 2; // "> "
  const cursorLength = showCursor ? 1 : 0;
  const contentLength = promptLength + displayText.length + cursorLength;
  const padding = ' '.repeat(Math.max(0, terminalWidth - contentLength));

  return (
    <Box flexDirection="column">
      <Text color={colors.secondary}>{line}</Text>
      <Box>
        <Text color={colors.secondary}>{'>'} </Text>
        {showPlaceholder ? (
          <Text color={colors.secondary}>{placeholder}</Text>
        ) : (
          <Text>{value}</Text>
        )}
        {showCursor && !showPlaceholder && <Text color={colors.selected}>|</Text>}
        <Text>{padding}</Text>
      </Box>
      <Text color={colors.secondary}>{line}</Text>
    </Box>
  );
};

export default InputField;
