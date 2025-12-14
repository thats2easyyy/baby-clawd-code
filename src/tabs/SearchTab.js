import React from 'react';
import { Box, Text } from 'ink';
import ListItem from '../components/ListItem.js';
import { searchSkills } from '../data/index.js';
import { colors } from '../theme.js';

const SearchTab = ({ selectedIndex, filter = '' }) => {
  // Search only shows results when there's a filter
  const skills = filter ? searchSkills(filter) : [];

  if (!filter) {
    return (
      <Box marginTop={1} marginLeft={2}>
        <Text color={colors.secondary}>Type to search skills by name or description</Text>
      </Box>
    );
  }

  if (skills.length === 0) {
    return (
      <Box marginTop={1} marginLeft={2}>
        <Text color={colors.secondary}>No results for "{filter}"</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" marginTop={1}>
      {skills.map((skill, index) => (
        <ListItem
          key={skill.name}
          label={skill.name}
          description={skill.category}
          isSelected={index === selectedIndex}
          labelWidth={22}
        />
      ))}
    </Box>
  );
};

// Export helper to get item count for navigation
export const getSearchCount = (filter = '') => {
  if (!filter) return 0;
  return searchSkills(filter).length;
};

export const getSearchSkillAtIndex = (index, filter = '') => {
  if (!filter) return null;
  const skills = searchSkills(filter);
  return skills[index];
};

export default SearchTab;
