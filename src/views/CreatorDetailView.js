import React from 'react';
import { Box, Text } from 'ink';
import ListItem from '../components/ListItem.js';
import { getCreatorByHandle, getSkillsByCreator } from '../data/index.js';
import { colors } from '../theme.js';

const CreatorDetailView = ({ handle, selectedIndex = 0 }) => {
  const creator = getCreatorByHandle(handle);

  if (!creator) {
    return (
      <Box marginTop={1}>
        <Text color={colors.error}>Creator not found: @{handle}</Text>
      </Box>
    );
  }

  const skills = getSkillsByCreator(handle);

  return (
    <Box flexDirection="column" marginTop={1}>
      {/* Creator header */}
      <Box marginBottom={1}>
        <Text bold color={colors.header}>@{creator.handle}</Text>
        <Text color={colors.secondary}> · {creator.name}</Text>
      </Box>

      {/* Bio */}
      {creator.bio && (
        <Box marginBottom={1}>
          <Text color={colors.primary}>{creator.bio}</Text>
        </Box>
      )}

      {/* GitHub link */}
      {creator.github && (
        <Box marginBottom={1}>
          <Text color={colors.selected}>{creator.github}</Text>
        </Box>
      )}

      {/* Skills section */}
      <Box marginTop={1} marginBottom={1}>
        <Text color={colors.secondary}>{skills.length} skill{skills.length !== 1 ? 's' : ''}</Text>
      </Box>

      {/* Skills list */}
      <Box flexDirection="column">
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
    </Box>
  );
};

// Export helper to get item count for navigation
export const getCreatorSkillCount = (handle) => {
  return getSkillsByCreator(handle).length;
};

export const getCreatorSkillAtIndex = (handle, index) => {
  const skills = getSkillsByCreator(handle);
  return skills[index];
};

export default CreatorDetailView;
