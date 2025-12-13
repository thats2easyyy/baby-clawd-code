import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { colors } from '../theme.js';

// Custom SelectList component with Claude Code aesthetic
// Two-column layout: name (left) + description (right)
const SelectList = ({ items, onSelect, nameWidth = 24 }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useInput((input, key) => {
    if (key.upArrow) {
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : items.length - 1));
    } else if (key.downArrow) {
      setSelectedIndex(prev => (prev < items.length - 1 ? prev + 1 : 0));
    } else if (key.return) {
      if (items[selectedIndex]) {
        onSelect(items[selectedIndex]);
      }
    }
  });

  return (
    <Box flexDirection="column">
      {items.map((item, index) => {
        const isSelected = index === selectedIndex;
        const indicator = isSelected ? '>' : ' ';
        const name = item.label || item.name;
        const description = item.description || '';

        // Pad the name to create aligned columns
        const paddedName = name.padEnd(nameWidth);

        return (
          <Box key={item.value || index}>
            <Text color={isSelected ? colors.selected : colors.primary}>
              {indicator} {paddedName}
            </Text>
            {description && (
              <Text color={colors.secondary}>{description}</Text>
            )}
          </Box>
        );
      })}
    </Box>
  );
};

export default SelectList;
