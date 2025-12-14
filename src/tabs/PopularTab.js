import React from 'react';
import { Box } from 'ink';
import ListItem from '../components/ListItem.js';
import { getPopularSkills } from '../data/index.js';

const PopularTab = ({ selectedIndex, filter = '' }) => {
  const allSkills = getPopularSkills();

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
      {skills.map((skill, index) => (
        <ListItem
          key={skill.name}
          label={skill.name}
          description={`${skill.category} · ${formatInstalls(skill.installs)} installs`}
          isSelected={index === selectedIndex}
          prefix={`${index + 1}.`}
          labelWidth={22}
        />
      ))}
      {skills.length === 0 && filter && (
        <ListItem label="No matching skills" description="" isSelected={false} />
      )}
    </Box>
  );
};

// Export helper to get item count for navigation
export const getPopularCount = (filter = '') => {
  const allSkills = getPopularSkills();
  if (!filter) return allSkills.length;
  return allSkills.filter(s =>
    s.name.toLowerCase().includes(filter.toLowerCase()) ||
    s.description.toLowerCase().includes(filter.toLowerCase())
  ).length;
};

export const getPopularSkillAtIndex = (index, filter = '') => {
  const allSkills = getPopularSkills();
  const skills = filter
    ? allSkills.filter(s =>
        s.name.toLowerCase().includes(filter.toLowerCase()) ||
        s.description.toLowerCase().includes(filter.toLowerCase())
      )
    : allSkills;
  return skills[index];
};

export default PopularTab;
