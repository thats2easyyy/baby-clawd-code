import React from 'react';
import { Box, Text } from 'ink';
import { colors } from '../theme.js';

const ListItem = ({ label, description, isSelected, prefix = '', labelWidth = 20 }) => {
  // Pad label to fixed width for alignment
  const paddedLabel = label.padEnd(labelWidth);

  return (
    <Box>
      <Text color={isSelected ? colors.header : colors.secondary}>
        {isSelected ? '> ' : '  '}
      </Text>
      {prefix && (
        <Text color={colors.secondary}>{prefix} </Text>
      )}
      <Text color={isSelected ? colors.header : colors.primary}>
        {paddedLabel}
      </Text>
      {description && (
        <Text color={colors.secondary}>{description}</Text>
      )}
    </Box>
  );
};

export default ListItem;
