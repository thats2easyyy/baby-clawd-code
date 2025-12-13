import React from 'react';
import { Box, Text } from 'ink';
import SelectList from '../components/SelectList.js';
import { colors } from '../theme.js';
import { getSkillsByCategory } from '../data/index.js';
import { SCREENS } from '../App.js';

const CategoryView = ({ category, navigate }) => {
  const skills = getSkillsByCategory(category);

  const items = skills.map(skill => ({
    label: skill.name,
    description: skill.description.slice(0, 40) + (skill.description.length > 40 ? '...' : ''),
    value: skill.name,
  }));

  const handleSelect = (item) => {
    navigate(SCREENS.SKILL_DETAIL, { skillName: item.value });
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color={colors.header}>{category}</Text>
        <Text color={colors.secondary}> ({skills.length} skills)</Text>
      </Box>
      {skills.length > 0 ? (
        <SelectList items={items} onSelect={handleSelect} nameWidth={20} />
      ) : (
        <Text color={colors.secondary}>No skills in this category</Text>
      )}
    </Box>
  );
};

export default CategoryView;
