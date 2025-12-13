import React from 'react';
import { Box, Text } from 'ink';
import SelectList from '../components/SelectList.js';
import { colors } from '../theme.js';
import { SCREENS } from '../App.js';

const MainMenu = ({ navigate }) => {
  const items = [
    { label: 'Browse by Category', description: 'Explore skills organized by category', value: SCREENS.CATEGORY_LIST },
    { label: 'Search Skills', description: 'Find skills by name or keyword', value: SCREENS.SEARCH },
    { label: 'Popular / Trending', description: 'See most installed skills', value: SCREENS.POPULAR },
    { label: 'View Creators', description: 'Browse skill creators', value: SCREENS.CREATOR_PROFILE },
  ];

  const handleSelect = (item) => {
    if (item.value === SCREENS.CREATOR_PROFILE) {
      navigate(SCREENS.CREATOR_PROFILE, { showList: true });
    } else {
      navigate(item.value);
    }
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color={colors.header}>Skills Discovery</Text>
      </Box>
      <Box marginBottom={1}>
        <Text color={colors.secondary}>Find and install Claude Code skills</Text>
      </Box>
      <SelectList items={items} onSelect={handleSelect} nameWidth={20} />
    </Box>
  );
};

export default MainMenu;
