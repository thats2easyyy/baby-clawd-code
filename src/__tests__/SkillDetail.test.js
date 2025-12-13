import { describe, test, expect, mock } from 'bun:test';
import React from 'react';
import { render } from 'ink-testing-library';
import SkillDetail from '../screens/SkillDetail.js';

describe('SkillDetail', () => {
  test('renders skill name', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<SkillDetail skillName="dev-browser" navigate={navigate} />);
    expect(lastFrame()).toContain('dev-browser');
  });

  test('renders skill description', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<SkillDetail skillName="dev-browser" navigate={navigate} />);
    expect(lastFrame()).toContain('Browser automation plugin');
  });

  test('renders category', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<SkillDetail skillName="dev-browser" navigate={navigate} />);
    expect(lastFrame()).toContain('Browser & Testing');
  });

  test('renders creator', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<SkillDetail skillName="dev-browser" navigate={navigate} />);
    expect(lastFrame()).toContain('@SawyerHood');
  });

  test('renders install count', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<SkillDetail skillName="dev-browser" navigate={navigate} />);
    expect(lastFrame()).toContain('730');
  });

  test('renders install command', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<SkillDetail skillName="dev-browser" navigate={navigate} />);
    expect(lastFrame()).toContain('/plugin marketplace add SawyerHood/dev-browser');
  });

  test('renders Install action', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<SkillDetail skillName="dev-browser" navigate={navigate} />);
    expect(lastFrame()).toContain('Install');
  });

  test('renders View creator action', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<SkillDetail skillName="dev-browser" navigate={navigate} />);
    expect(lastFrame()).toContain('View @SawyerHood');
  });

  test('shows error for unknown skill', () => {
    const navigate = mock(() => {});
    const { lastFrame } = render(<SkillDetail skillName="nonexistent" navigate={navigate} />);
    expect(lastFrame()).toContain('Skill not found');
  });
});
