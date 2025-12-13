import React from 'react';
import { Box, Text } from 'ink';
import SelectList from '../components/SelectList.js';
import { colors } from '../theme.js';
import { getPopularSkills } from '../data/index.js';
import { SCREENS } from '../App.js';

const PopularView = ({ navigate }) => {
  const skills = getPopularSkills();

  const items = skills.map((skill, index) => ({
    label: `${index + 1}. ${skill.name}`,
    description: `${skill.installs.toLocaleString()} installs`,
    value: skill.name,
  }));

  const handleSelect = (item) => {
    navigate(SCREENS.SKILL_DETAIL, { skillName: item.value });
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color={colors.header}>Popular Skills</Text>
      </Box>
      <Box marginBottom={1}>
        <Text color={colors.secondary}>Sorted by install count</Text>
      </Box>
      <SelectList items={items} onSelect={handleSelect} nameWidth={20} />
    </Box>
  );
};

export default PopularView;
