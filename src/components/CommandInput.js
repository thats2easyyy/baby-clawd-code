import React from 'react';
import { Box, Text } from 'ink';
import { colors } from '../theme.js';
import { SCREENS } from '../App.js';

// Map screens to their subcommand representation
const getCommandText = (screen, params, searchQuery) => {
  switch (screen) {
    case SCREENS.MAIN_MENU:
      return '/skills';
    case SCREENS.CATEGORY_LIST:
      return '/skills browse';
    case SCREENS.CATEGORY_VIEW:
      return `/skills browse ${params.category || ''}`;
    case SCREENS.SKILL_DETAIL:
      return `/skills view ${params.skillName || ''}`;
    case SCREENS.CREATOR_PROFILE:
      return `/skills creator @${params.handle || ''}`;
    case SCREENS.SEARCH:
      return searchQuery ? `/skills search ${searchQuery}` : '/skills search';
    case SCREENS.POPULAR:
      return '/skills popular';
    default:
      return '/skills';
  }
};

const CommandInput = ({ currentScreen, searchQuery = '' }) => {
  const commandText = getCommandText(
    currentScreen.screen,
    currentScreen.params,
    searchQuery
  );

  return (
    <Box marginTop={1}>
      <Text color={colors.secondary}>{'>'} </Text>
      <Text color={colors.secondary} dimColor>{commandText}</Text>
    </Box>
  );
};

export default CommandInput;
