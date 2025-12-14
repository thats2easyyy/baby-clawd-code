import React from 'react';
import { Box } from 'ink';
import ListItem from '../components/ListItem.js';
import { getAllCreators } from '../data/index.js';

const CreatorsTab = ({ selectedIndex, filter = '' }) => {
  const allCreators = getAllCreators();

  // Filter creators based on input
  const creators = filter
    ? allCreators.filter(creator =>
        creator.handle.toLowerCase().includes(filter.toLowerCase()) ||
        creator.name.toLowerCase().includes(filter.toLowerCase())
      )
    : allCreators;

  return (
    <Box flexDirection="column" marginTop={1}>
      {creators.map((creator, index) => (
        <ListItem
          key={creator.handle}
          label={`@${creator.handle}`}
          description={creator.name}
          isSelected={index === selectedIndex}
          labelWidth={20}
        />
      ))}
      {creators.length === 0 && filter && (
        <ListItem label="No matching creators" description="" isSelected={false} />
      )}
    </Box>
  );
};

// Export helper to get item count for navigation
export const getCreatorsCount = (filter = '') => {
  const allCreators = getAllCreators();
  if (!filter) return allCreators.length;
  return allCreators.filter(creator =>
    creator.handle.toLowerCase().includes(filter.toLowerCase()) ||
    creator.name.toLowerCase().includes(filter.toLowerCase())
  ).length;
};

export const getCreatorAtIndex = (index, filter = '') => {
  const allCreators = getAllCreators();
  const creators = filter
    ? allCreators.filter(creator =>
        creator.handle.toLowerCase().includes(filter.toLowerCase()) ||
        creator.name.toLowerCase().includes(filter.toLowerCase())
      )
    : allCreators;
  return creators[index];
};

export default CreatorsTab;
