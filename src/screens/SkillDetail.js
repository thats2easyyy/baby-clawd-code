import React, { useState } from 'react';
import { Box, Text } from 'ink';
import SelectList from '../components/SelectList.js';
import { colors } from '../theme.js';
import clipboard from 'clipboardy';
import { getSkillByName } from '../data/index.js';
import { SCREENS } from '../App.js';

const SkillDetail = ({ skillName, navigate }) => {
  const skill = getSkillByName(skillName);
  const [copied, setCopied] = useState(false);

  if (!skill) {
    return <Text color={colors.error}>Skill not found: {skillName}</Text>;
  }

  const items = [
    { label: copied ? '✓ Copied to clipboard' : 'Install', description: 'Copy install command', value: 'install' },
    { label: `View @${skill.creator}`, description: 'See creator profile', value: 'creator' },
  ];

  const handleSelect = async (item) => {
    if (item.value === 'install') {
      try {
        await clipboard.write(skill.installCommand);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        // Clipboard might not work in all environments
      }
    } else if (item.value === 'creator') {
      navigate(SCREENS.CREATOR_PROFILE, { handle: skill.creator });
    }
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color={colors.header}>{skill.name}</Text>
      </Box>

      <Box marginBottom={1} flexDirection="column">
        <Text>{skill.description}</Text>
      </Box>

      <Box marginBottom={1} flexDirection="column">
        <Box>
          <Text color={colors.secondary}>Category: </Text>
          <Text>{skill.category}</Text>
        </Box>
        <Box>
          <Text color={colors.secondary}>Creator: </Text>
          <Text>@{skill.creator}</Text>
        </Box>
        <Box>
          <Text color={colors.secondary}>Installs: </Text>
          <Text>{skill.installs.toLocaleString()}</Text>
        </Box>
      </Box>

      <Box marginBottom={1} flexDirection="column">
        <Text color={colors.secondary}>Install command:</Text>
        <Text color={colors.success}>{skill.installCommand}</Text>
      </Box>

      <SelectList items={items} onSelect={handleSelect} nameWidth={24} />
    </Box>
  );
};

export default SkillDetail;
