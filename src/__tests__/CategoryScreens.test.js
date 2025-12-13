import { describe, test, expect, mock } from 'bun:test';
import React from 'react';
import { render } from 'ink-testing-library';
import CategoryList from '../screens/CategoryList.js';
import CategoryView from '../screens/CategoryView.js';

describe('CategoryList', () => {
  test('renders title', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<CategoryList navigate={navigate} />);
    expect(lastFrame()).toContain('Browse by Category');
  });

  test('renders all 6 categories', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<CategoryList navigate={navigate} />);
    expect(lastFrame()).toContain('Browser & Testing');
    expect(lastFrame()).toContain('Development');
    expect(lastFrame()).toContain('DevOps');
    expect(lastFrame()).toContain('Documents');
    expect(lastFrame()).toContain('Meta');
    expect(lastFrame()).toContain('Workflow');
  });

  test('shows skill count for each category', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<CategoryList navigate={navigate} />);
    // Browser & Testing has 2 skills
    expect(lastFrame()).toContain('2 skills');
  });
});

describe('CategoryView', () => {
  test('renders category name', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<CategoryView category="DevOps" navigate={navigate} />);
    expect(lastFrame()).toContain('DevOps');
  });

  test('renders skills in category', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<CategoryView category="DevOps" navigate={navigate} />);
    expect(lastFrame()).toContain('kubernetes-operations');
    expect(lastFrame()).toContain('devops-automation-pack');
  });

  test('shows skill count', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<CategoryView category="DevOps" navigate={navigate} />);
    expect(lastFrame()).toContain('(2 skills)');
  });
});
