import { describe, test, expect } from 'bun:test';
import {
  getAllSkills,
  getAllCreators,
  getCategories,
  getSkillsByCategory,
  getSkillByName,
  getCreatorByHandle,
  getSkillsByCreator,
  getPopularSkills,
  searchSkills,
} from '../data/index.js';

describe('Data Layer', () => {
  test('getAllSkills returns all 10 skills', () => {
    const skills = getAllSkills();
    expect(skills).toHaveLength(10);
  });

  test('getAllCreators returns all 5 creators', () => {
    const creators = getAllCreators();
    expect(creators).toHaveLength(5);
  });

  test('getCategories returns 6 unique categories', () => {
    const categories = getCategories();
    expect(categories).toHaveLength(6);
    expect(categories).toContain('Browser & Testing');
    expect(categories).toContain('Development');
    expect(categories).toContain('DevOps');
  });

  test('getSkillsByCategory filters correctly', () => {
    const devopsSkills = getSkillsByCategory('DevOps');
    expect(devopsSkills.length).toBeGreaterThan(0);
    devopsSkills.forEach(skill => {
      expect(skill.category).toBe('DevOps');
    });
  });

  test('getSkillByName finds skill', () => {
    const skill = getSkillByName('dev-browser');
    expect(skill).toBeDefined();
    expect(skill.creator).toBe('SawyerHood');
  });

  test('getCreatorByHandle finds creator', () => {
    const creator = getCreatorByHandle('anthropic');
    expect(creator).toBeDefined();
    expect(creator.name).toBe('Anthropic');
  });

  test('getSkillsByCreator returns creator skills', () => {
    const skills = getSkillsByCreator('anthropic');
    expect(skills.length).toBeGreaterThan(0);
    skills.forEach(skill => {
      expect(skill.creator).toBe('anthropic');
    });
  });

  test('getPopularSkills returns sorted by installs', () => {
    const popular = getPopularSkills();
    expect(popular[0].name).toBe('docx'); // highest installs at 2341
    for (let i = 1; i < popular.length; i++) {
      expect(popular[i].installs).toBeLessThanOrEqual(popular[i - 1].installs);
    }
  });

  test('searchSkills finds by name', () => {
    const results = searchSkills('python');
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(s => s.name === 'python-development')).toBe(true);
  });

  test('searchSkills finds by description', () => {
    const results = searchSkills('browser');
    expect(results.length).toBeGreaterThan(0);
  });

  test('searchSkills returns empty for no match', () => {
    const results = searchSkills('xyznonexistent');
    expect(results).toHaveLength(0);
  });
});
