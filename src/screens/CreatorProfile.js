import React from 'react';
import { Box, Text } from 'ink';
import SelectList from '../components/SelectList.js';
import { colors } from '../theme.js';
import { getAllCreators, getCreatorByHandle, getSkillsByCreator } from '../data/index.js';
import { SCREENS } from '../App.js';

// Creator list view
const CreatorList = ({ navigate }) => {
  const creators = getAllCreators();

  const items = creators.map(creator => ({
    label: `@${creator.handle}`,
    description: creator.name,
    value: creator.handle,
  }));

  const handleSelect = (item) => {
    navigate(SCREENS.CREATOR_PROFILE, { handle: item.value, showList: false });
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color={colors.header}>Creators</Text>
      </Box>
      <SelectList items={items} onSelect={handleSelect} nameWidth={16} />
    </Box>
  );
};

// Single creator profile view
const CreatorDetail = ({ handle, navigate }) => {
  const creator = getCreatorByHandle(handle);
  const skills = getSkillsByCreator(handle);

  if (!creator) {
    return <Text color={colors.error}>Creator not found: {handle}</Text>;
  }

  const items = skills.map(skill => ({
    label: skill.name,
    description: skill.category,
    value: skill.name,
  }));

  const handleSelect = (item) => {
    navigate(SCREENS.SKILL_DETAIL, { skillName: item.value });
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color={colors.header}>@{creator.handle}</Text>
        <Text> - {creator.name}</Text>
      </Box>

      <Box marginBottom={1}>
        <Text>{creator.bio}</Text>
      </Box>

      <Box marginBottom={1}>
        <Text color={colors.secondary}>GitHub: </Text>
        <Text color={colors.selected}>{creator.github}</Text>
      </Box>

      {skills.length > 0 && (
        <Box flexDirection="column">
          <Box marginBottom={1}>
            <Text bold>Skills ({skills.length})</Text>
          </Box>
          <SelectList items={items} onSelect={handleSelect} nameWidth={20} />
        </Box>
      )}
    </Box>
  );
};

// Main component that switches between list and detail view
const CreatorProfile = ({ handle, showList, navigate }) => {
  if (showList || !handle) {
    return <CreatorList navigate={navigate} />;
  }
  return <CreatorDetail handle={handle} navigate={navigate} />;
};

export default CreatorProfile;
