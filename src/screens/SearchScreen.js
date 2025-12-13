import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import SelectList from '../components/SelectList.js';
import { colors } from '../theme.js';
import { searchSkills } from '../data/index.js';
import { SCREENS } from '../App.js';

const SearchScreen = ({ navigate }) => {
  const [query, setQuery] = useState('');
  const results = query ? searchSkills(query) : [];

  useInput((input, key) => {
    if (key.backspace || key.delete) {
      setQuery(prev => prev.slice(0, -1));
    } else if (!key.ctrl && !key.meta && input && input.length === 1 && !key.escape) {
      setQuery(prev => prev + input);
    }
  });

  const items = results.map(skill => ({
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
        <Text bold color={colors.header}>Search Skills</Text>
      </Box>

      <Box marginBottom={1}>
        <Text color={colors.secondary}>Search: </Text>
        <Text>{query}</Text>
        <Text color={colors.selected}>|</Text>
      </Box>

      {query && results.length === 0 && (
        <Text color={colors.secondary}>No results for '{query}'</Text>
      )}

      {results.length > 0 && (
        <Box flexDirection="column">
          <Box marginBottom={1}>
            <Text color={colors.secondary}>{results.length} result{results.length !== 1 ? 's' : ''}</Text>
          </Box>
          <SelectList items={items} onSelect={handleSelect} nameWidth={20} />
        </Box>
      )}

      {!query && (
        <Text color={colors.secondary}>Type to search skills by name or description</Text>
      )}
    </Box>
  );
};

export default SearchScreen;
