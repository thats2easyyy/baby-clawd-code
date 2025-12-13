import React from 'react';
import { Box, Text } from 'ink';
import { colors } from '../theme.js';

const Header = ({ title, subtitle }) => {
  return (
    <Box flexDirection="column" marginBottom={1}>
      <Text bold color={colors.header}>{title}</Text>
      {subtitle && <Text color={colors.secondary}>{subtitle}</Text>}
    </Box>
  );
};

export default Header;
