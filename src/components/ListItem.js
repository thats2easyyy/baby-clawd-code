import React from 'react';
import { Box, Text } from 'ink';
import { colors } from '../theme.js';

const ListItem = ({ label, description, isSelected, prefix = '', labelWidth = 20, labelColor, descriptionColor }) => {
  // Pad label to fixed width for alignment
  const paddedLabel = label.padEnd(labelWidth);

  // Determine colors - use custom or defaults
  const effectiveLabelColor = isSelected ? colors.header : (labelColor || colors.primary);
  const effectiveDescColor = descriptionColor || colors.secondary;

  return (
    <Box>
      <Text color={isSelected ? colors.header : colors.secondary}>
        {isSelected ? '> ' : '  '}
      </Text>
      {prefix && (
        <Text color={colors.secondary}>{prefix} </Text>
      )}
      <Text color={effectiveLabelColor}>
        {paddedLabel}
      </Text>
      {description && (
        <Text color={effectiveDescColor}>{description}</Text>
      )}
    </Box>
  );
};

export default ListItem;
