import React from 'react';
import { Box, Text } from 'ink';
import SelectList from '../components/SelectList.js';
import { colors } from '../theme.js';
import { getCategories, getSkillsByCategory } from '../data/index.js';
import { SCREENS } from '../App.js';

const CategoryList = ({ navigate }) => {
  const categories = getCategories();

  const items = categories.map(category => {
    const count = getSkillsByCategory(category).length;
    return {
      label: category,
      description: `${count} skill${count !== 1 ? 's' : ''}`,
      value: category,
    };
  });

  const handleSelect = (item) => {
    navigate(SCREENS.CATEGORY_VIEW, { category: item.value });
  };

  return (
    <Box flexDirection="column">
      <Box marginBottom={1}>
        <Text bold color={colors.header}>Browse by Category</Text>
      </Box>
      <SelectList items={items} onSelect={handleSelect} nameWidth={20} />
    </Box>
  );
};

export default CategoryList;
