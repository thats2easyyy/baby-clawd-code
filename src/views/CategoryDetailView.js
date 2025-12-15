import React from 'react';
import { Box, Text } from 'ink';
import ListItem from '../components/ListItem.js';
import { getSkillsByCategory } from '../data/index.js';
import { colors, categoryColors } from '../theme.js';

const CategoryDetailView = ({ category, selectedIndex = 0, filter = '' }) => {
  const allSkills = getSkillsByCategory(category);

  // Filter skills based on input
  const skills = filter
    ? allSkills.filter(s =>
        s.name.toLowerCase().includes(filter.toLowerCase()) ||
        s.description.toLowerCase().includes(filter.toLowerCase())
      )
    : allSkills;

  const formatInstalls = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  return (
    <Box flexDirection="column" marginTop={1}>
      {/* Category header */}
      <Box marginBottom={1}>
        <Text bold color={categoryColors[category] || colors.header}>{category}</Text>
        <Text color={colors.secondary}> · {skills.length} skill{skills.length !== 1 ? 's' : ''}</Text>
      </Box>

      {/* Skills list */}
      <Box flexDirection="column">
        {skills.map((skill, index) => (
          <ListItem
            key={skill.name}
            label={skill.name}
            description={`${formatInstalls(skill.installs)} installs`}
            isSelected={index === selectedIndex}
            labelWidth={22}
          />
        ))}
        {skills.length === 0 && filter && (
          <ListItem label="No matching skills" description="" isSelected={false} />
        )}
      </Box>
    </Box>
  );
};

// Export helper to get item count for navigation
export const getCategorySkillCount = (category, filter = '') => {
  const allSkills = getSkillsByCategory(category);
  if (!filter) return allSkills.length;
  return allSkills.filter(s =>
    s.name.toLowerCase().includes(filter.toLowerCase()) ||
    s.description.toLowerCase().includes(filter.toLowerCase())
  ).length;
};

export const getCategorySkillAtIndex = (category, index, filter = '') => {
  const allSkills = getSkillsByCategory(category);
  const skills = filter
    ? allSkills.filter(s =>
        s.name.toLowerCase().includes(filter.toLowerCase()) ||
        s.description.toLowerCase().includes(filter.toLowerCase())
      )
    : allSkills;
  return skills[index];
};

export default CategoryDetailView;
