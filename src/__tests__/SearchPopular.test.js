import { describe, test, expect, mock } from 'bun:test';
import React from 'react';
import { render } from 'ink-testing-library';
import SearchScreen from '../screens/SearchScreen.js';
import PopularView from '../screens/PopularView.js';

describe('SearchScreen', () => {
  test('renders title', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<SearchScreen navigate={navigate} />);
    expect(lastFrame()).toContain('Search Skills');
  });

  test('shows placeholder text when no query', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<SearchScreen navigate={navigate} />);
    expect(lastFrame()).toContain('Type to search');
  });

  test('shows search input', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<SearchScreen navigate={navigate} />);
    expect(lastFrame()).toContain('Search:');
  });
});

describe('PopularView', () => {
  test('renders title', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<PopularView navigate={navigate} />);
    expect(lastFrame()).toContain('Popular Skills');
  });

  test('shows sorted by installs subtitle', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<PopularView navigate={navigate} />);
    expect(lastFrame()).toContain('Sorted by install count');
  });

  test('shows all skills with rankings', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<PopularView navigate={navigate} />);
    // First should be docx with highest installs
    expect(lastFrame()).toContain('1. docx');
    expect(lastFrame()).toContain('2,341 installs');
  });

  test('shows install counts', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<PopularView navigate={navigate} />);
    expect(lastFrame()).toContain('installs');
  });
});
