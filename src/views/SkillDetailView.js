import React from 'react';
import { Box, Text } from 'ink';
import ListItem from '../components/ListItem.js';
import { getSkillByName, getCreatorByHandle } from '../data/index.js';
import { colors } from '../theme.js';

const SkillDetailView = ({ skillName, selectedIndex = 0 }) => {
  const skill = getSkillByName(skillName);

  if (!skill) {
    return (
      <Box marginTop={1}>
        <Text color={colors.error}>Skill not found: {skillName}</Text>
      </Box>
    );
  }

  const creator = getCreatorByHandle(skill.creator);
  const formatInstalls = (count) => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const actions = [
    { label: 'Install', description: skill.installCommand },
    { label: 'View Creator', description: `See @${skill.creator}'s profile` },
  ];

  return (
    <Box flexDirection="column" marginTop={1}>
      {/* Skill header */}
      <Box marginBottom={1}>
        <Text bold color={colors.header}>{skill.name}</Text>
      </Box>

      {/* Metadata line */}
      <Box marginBottom={1}>
        <Text color={colors.selected}>By @{skill.creator}</Text>
        <Text color={colors.secondary}> · {skill.category} · {formatInstalls(skill.installs)} installs</Text>
      </Box>

      {/* Description */}
      <Box marginBottom={1}>
        <Text color={colors.primary}>{skill.description}</Text>
      </Box>

      {/* Actions */}
      <Box flexDirection="column" marginTop={1}>
        {actions.map((action, index) => (
          <ListItem
            key={action.label}
            label={action.label}
            description={action.description}
            isSelected={index === selectedIndex}
            labelWidth={18}
          />
        ))}
      </Box>
    </Box>
  );
};

// Export action count for navigation
export const SKILL_DETAIL_ACTIONS = 2;

export default SkillDetailView;
