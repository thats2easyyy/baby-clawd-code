import React from 'react';
import { Box, Text } from 'ink';
import { colors } from '../theme.js';

const BackHint = ({ isAtMainMenu }) => {
  return (
    <Box marginTop={1}>
      <Text color={colors.secondary}>
        {isAtMainMenu
          ? '↑↓ navigate · Enter select'
          : '↑↓ navigate · Enter select · Esc back'}
      </Text>
    </Box>
  );
};

export default BackHint;
