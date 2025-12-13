import { describe, test, expect, mock } from 'bun:test';
import React from 'react';
import { render } from 'ink-testing-library';
import MainMenu from '../screens/MainMenu.js';

describe('MainMenu', () => {
  test('renders title', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<MainMenu navigate={navigate} />);
    expect(lastFrame()).toContain('Skills Discovery');
  });

  test('renders subtitle', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<MainMenu navigate={navigate} />);
    expect(lastFrame()).toContain('Find and install Claude Code skills');
  });

  test('renders all menu options', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<MainMenu navigate={navigate} />);
    expect(lastFrame()).toContain('Browse by Category');
    expect(lastFrame()).toContain('Search Skills');
    expect(lastFrame()).toContain('Popular / Trending');
    expect(lastFrame()).toContain('View Creators');
  });
});
