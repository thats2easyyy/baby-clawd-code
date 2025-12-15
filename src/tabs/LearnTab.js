import React from 'react';
import { Box, Text } from 'ink';
import { colors } from '../theme.js';
import { SECTION_DIVIDER, SECTION_HEADER } from '../utils/asciiArt.js';

const LearnTab = () => {
  return (
    <Box flexDirection="column" marginTop={1}>
      {/* What's a skill? */}
      <Text dimColor>{SECTION_DIVIDER}</Text>
      <Box marginBottom={1}>
        <Text bold color={colors.header}>{SECTION_HEADER("What's a skill?")}</Text>
      </Box>
      <Box marginBottom={1}>
        <Text color={colors.primary}>
          Skills are instruction files that teach Claude Code how to perform specialized tasks.
          They load automatically when relevant to your request.
        </Text>
      </Box>

      {/* Built-in skills */}
      <Text dimColor>{SECTION_DIVIDER}</Text>
      <Box marginBottom={1}>
        <Text bold color={colors.header}>{SECTION_HEADER("Built-in skills")}</Text>
      </Box>
      <Box flexDirection="column" marginBottom={1}>
        <Box>
          <Text color={colors.selected}>  docx           </Text>
          <Text color={colors.primary}> - Create and edit Word documents</Text>
        </Box>
        <Box>
          <Text color={colors.selected}>  xlsx           </Text>
          <Text color={colors.primary}> - Create and edit Excel spreadsheets</Text>
        </Box>
        <Box>
          <Text color={colors.selected}>  pptx           </Text>
          <Text color={colors.primary}> - Create presentations</Text>
        </Box>
        <Box>
          <Text color={colors.selected}>  pdf            </Text>
          <Text color={colors.primary}> - Create and read PDFs</Text>
        </Box>
        <Box>
          <Text color={colors.selected}>  skill-creator  </Text>
          <Text color={colors.primary}> - Help you create new skills</Text>
        </Box>
        <Box>
          <Text color={colors.selected}>  mcp-builder    </Text>
          <Text color={colors.primary}> - Build MCP server integrations</Text>
        </Box>
        <Box>
          <Text color={colors.selected}>  webapp-testing </Text>
          <Text color={colors.primary}> - Test web applications</Text>
        </Box>
      </Box>

      {/* How to invoke */}
      <Text dimColor>{SECTION_DIVIDER}</Text>
      <Box marginBottom={1}>
        <Text bold color={colors.header}>{SECTION_HEADER("How to invoke")}</Text>
      </Box>
      <Box marginBottom={1}>
        <Text color={colors.primary}>
          Just describe what you want. Claude detects relevant skills automatically.
        </Text>
      </Box>
      <Box marginBottom={1}>
        <Text dimColor>Example: </Text>
        <Text color={colors.secondary}>"Create a presentation about Q4 results"</Text>
      </Box>

      {/* Glossary */}
      <Text dimColor>{SECTION_DIVIDER}</Text>
      <Box marginBottom={1}>
        <Text bold color={colors.header}>{SECTION_HEADER("Glossary")}</Text>
      </Box>
      <Box flexDirection="column">
        <Box>
          <Text color={colors.selected}>Skill    </Text>
          <Text color={colors.primary}> - Instructions that teach Claude a task</Text>
        </Box>
        <Box>
          <Text color={colors.selected}>Hook     </Text>
          <Text color={colors.primary}> - Code that runs at specific lifecycle events</Text>
        </Box>
        <Box>
          <Text color={colors.selected}>Subagent </Text>
          <Text color={colors.primary}> - A specialized Claude instance for subtasks</Text>
        </Box>
        <Box>
          <Text color={colors.selected}>Plugin   </Text>
          <Text color={colors.primary}> - A bundle of commands, skills, hooks, and agents</Text>
        </Box>
      </Box>
    </Box>
  );
};

// Export empty helpers since Learn tab isn't navigable
export const getLearnCount = () => 0;
export const getLearnItemAtIndex = () => null;

export default LearnTab;
