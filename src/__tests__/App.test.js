import { describe, test, expect } from 'bun:test';
import React from 'react';
import { render } from 'ink-testing-library';
import App from '../App.js';

describe('App Shell', () => {
  test('renders without crashing', () => {
    const { lastFrame } = render(<App />);
    expect(lastFrame()).toBeDefined();
  });

  test('shows main menu by default', () => {
    const { lastFrame } = render(<App />);
    expect(lastFrame()).toContain('Skills Discovery');
    expect(lastFrame()).toContain('Browse by Category');
  });

  test('shows navigation hints at main menu', () => {
    const { lastFrame } = render(<App />);
    expect(lastFrame()).toContain('navigate');
    expect(lastFrame()).toContain('Enter select');
  });
});
