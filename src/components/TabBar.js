import React from 'react';
import { Box, Text } from 'ink';
import { colors } from '../theme.js';

const TabBar = ({ tabs, selectedIndex }) => {
  // Build three lines: top border, tab names, bottom border
  // Only the selected tab has box characters, others have spaces

  const parts = tabs.map((tab, index) => {
    const isSelected = index === selectedIndex;
    const width = tab.length + 2; // 1 space padding on each side

    if (isSelected) {
      return {
        top: `┌${'─'.repeat(width)}┐`,
        mid: `│ ${tab} │`,
        bot: `└${'─'.repeat(width)}┘`,
      };
    } else {
      return {
        top: ' '.repeat(width + 2),
        mid: `  ${tab}  `,
        bot: ' '.repeat(width + 2),
      };
    }
  });

  const topLine = parts.map(p => p.top).join('');
  const midLine = parts.map(p => p.mid).join('');
  const botLine = parts.map(p => p.bot).join('');

  return (
    <Box flexDirection="column" marginTop={1}>
      <Text color={colors.secondary}>{topLine}</Text>
      <Box>
        <Text>{midLine}</Text>
        <Text color={colors.secondary}>  (tab to cycle)</Text>
      </Box>
      <Text color={colors.secondary}>{botLine}</Text>
    </Box>
  );
};

export default TabBar;
