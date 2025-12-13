import skills from './skills.json' with { type: 'json' };
import creators from './creators.json' with { type: 'json' };

// Get all skills
export const getAllSkills = () => skills;

// Get all creators
export const getAllCreators = () => creators;

// Get all unique categories
export const getCategories = () => {
  const categories = [...new Set(skills.map(s => s.category))];
  return categories.sort();
};

// Get skills by category
export const getSkillsByCategory = (category) => {
  return skills.filter(s => s.category === category);
};

// Get skill by name
export const getSkillByName = (name) => {
  return skills.find(s => s.name === name);
};

// Get creator by handle
export const getCreatorByHandle = (handle) => {
  return creators.find(c => c.handle === handle);
};

// Get skills by creator handle
export const getSkillsByCreator = (handle) => {
  return skills.filter(s => s.creator === handle);
};

// Get skills sorted by installs (popular)
export const getPopularSkills = () => {
  return [...skills].sort((a, b) => b.installs - a.installs);
};

// Search skills by query (name + description)
export const searchSkills = (query) => {
  const q = query.toLowerCase();
  return skills.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.description.toLowerCase().includes(q)
  );
};
