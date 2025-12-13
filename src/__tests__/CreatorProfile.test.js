import { describe, test, expect, mock } from 'bun:test';
import React from 'react';
import { render } from 'ink-testing-library';
import CreatorProfile from '../screens/CreatorProfile.js';

describe('CreatorProfile - List View', () => {
  test('renders title when showList is true', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<CreatorProfile showList={true} navigate={navigate} />);
    expect(lastFrame()).toContain('Creators');
  });

  test('renders all creators', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<CreatorProfile showList={true} navigate={navigate} />);
    expect(lastFrame()).toContain('@SawyerHood');
    expect(lastFrame()).toContain('@wshobson');
    expect(lastFrame()).toContain('@anthropic');
  });

  test('renders creator names', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<CreatorProfile showList={true} navigate={navigate} />);
    expect(lastFrame()).toContain('Sawyer Hood');
    expect(lastFrame()).toContain('Anthropic');
  });
});

describe('CreatorProfile - Detail View', () => {
  test('renders creator handle and name', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<CreatorProfile handle="SawyerHood" showList={false} navigate={navigate} />);
    expect(lastFrame()).toContain('@SawyerHood');
    expect(lastFrame()).toContain('Sawyer Hood');
  });

  test('renders creator bio', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<CreatorProfile handle="SawyerHood" showList={false} navigate={navigate} />);
    expect(lastFrame()).toContain('Software engineer exploring weird ways');
  });

  test('renders GitHub link', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<CreatorProfile handle="SawyerHood" showList={false} navigate={navigate} />);
    expect(lastFrame()).toContain('https://github.com/SawyerHood');
  });

  test('renders creator skills', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<CreatorProfile handle="SawyerHood" showList={false} navigate={navigate} />);
    expect(lastFrame()).toContain('dev-browser');
  });

  test('renders skill count', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<CreatorProfile handle="anthropic" showList={false} navigate={navigate} />);
    // Anthropic has multiple skills
    expect(lastFrame()).toContain('Skills (');
  });

  test('shows error for unknown creator', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<CreatorProfile handle="nonexistent" showList={false} navigate={navigate} />);
    expect(lastFrame()).toContain('Creator not found');
  });
});
