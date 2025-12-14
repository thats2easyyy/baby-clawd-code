import React from 'react';
import { Box } from 'ink';
import ListItem from '../components/ListItem.js';
import { getCategories, getSkillsByCategory } from '../data/index.js';

const BrowseTab = ({ selectedIndex, filter = '' }) => {
  const allCategories = getCategories();

  // Filter categories based on input
  const categories = filter
    ? allCategories.filter(cat =>
        cat.toLowerCase().includes(filter.toLowerCase())
      )
    : allCategories;

  return (
    <Box flexDirection="column" marginTop={1}>
      {categories.map((category, index) => {
        const skillCount = getSkillsByCategory(category).length;
        return (
          <ListItem
            key={category}
            label={category}
            description={`${skillCount} skill${skillCount !== 1 ? 's' : ''}`}
            isSelected={index === selectedIndex}
            labelWidth={25}
          />
        );
      })}
      {categories.length === 0 && filter && (
        <ListItem label="No matching categories" description="" isSelected={false} />
      )}
    </Box>
  );
};

// Export helper to get item count for navigation
export const getBrowseCount = (filter = '') => {
  const allCategories = getCategories();
  if (!filter) return allCategories.length;
  return allCategories.filter(cat =>
    cat.toLowerCase().includes(filter.toLowerCase())
  ).length;
};

export const getCategoryAtIndex = (index, filter = '') => {
  const allCategories = getCategories();
  const categories = filter
    ? allCategories.filter(cat =>
        cat.toLowerCase().includes(filter.toLowerCase())
      )
    : allCategories;
  return categories[index];
};

export default BrowseTab;
