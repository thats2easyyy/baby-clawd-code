import React from 'react';
import { Box, Text } from 'ink';
import { colors } from '../theme.js';

// Available commands
const COMMANDS = [
  { name: '/skills', description: 'Discover and install Claude Code skills' },
];

const CommandMenu = ({ filter = '', selectedIndex = 0 }) => {
  // Filter commands based on input (remove leading /)
  const searchTerm = filter.startsWith('/') ? filter.slice(1).toLowerCase() : filter.toLowerCase();
  const filteredCommands = COMMANDS.filter(cmd =>
    cmd.name.toLowerCase().includes(searchTerm) ||
    cmd.description.toLowerCase().includes(searchTerm)
  );

  if (filteredCommands.length === 0) {
    return (
      <Box marginTop={1} marginLeft={2}>
        <Text color={colors.secondary}>No matching commands</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      {filteredCommands.map((cmd, index) => {
        const isSelected = index === selectedIndex;
        return (
          <Box key={cmd.name} marginLeft={2}>
            <Text color={isSelected ? colors.header : colors.selected}>
              {cmd.name}
            </Text>
            <Text color={colors.secondary}>{'    '}{cmd.description}</Text>
          </Box>
        );
      })}
    </Box>
  );
};

// Export commands for use elsewhere
export { COMMANDS };
export default CommandMenu;
