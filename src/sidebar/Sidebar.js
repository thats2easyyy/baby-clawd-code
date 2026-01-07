import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { colors } from '../theme.js';
import { createServer } from './ipc.js';

const TABS = ['Todos', 'Context', 'Tasks'];

// Status icons for todos
const STATUS_ICONS = {
  pending: '○',
  in_progress: '◐',
  completed: '●',
};

const STATUS_COLORS = {
  pending: colors.secondary,
  in_progress: colors.selected,
  completed: colors.success,
};

/**
 * Header with title and decorative border
 */
const Header = () => (
  <Box flexDirection="column" marginBottom={1}>
    <Box>
      <Text color={colors.header} bold>┌───────────────────┐</Text>
    </Box>
    <Box>
      <Text color={colors.header} bold>│   </Text>
      <Text color={colors.selected} bold>Claude Sidebar</Text>
      <Text color={colors.header} bold>   │</Text>
    </Box>
    <Box>
      <Text color={colors.header} bold>└───────────────────┘</Text>
    </Box>
  </Box>
);

/**
 * Tab bar component
 */
const TabBar = ({ tabs, selectedIndex }) => (
  <Box marginBottom={1}>
    {tabs.map((tab, i) => (
      <Box key={tab} marginRight={1}>
        <Text
          color={i === selectedIndex ? colors.selected : colors.secondary}
          bold={i === selectedIndex}
          inverse={i === selectedIndex}
        >
          {' '}{tab}{' '}
        </Text>
      </Box>
    ))}
  </Box>
);

/**
 * Todo list display
 */
const TodosPanel = ({ todos, selectedIndex }) => {
  if (!todos || todos.length === 0) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color={colors.secondary} italic>No todos yet.</Text>
        <Text color={colors.secondary} dimColor>Claude will add tasks here as they work.</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      {todos.map((todo, i) => (
        <Box key={i}>
          <Text color={i === selectedIndex ? colors.selected : colors.primary}>
            {i === selectedIndex ? '▸ ' : '  '}
          </Text>
          <Text color={STATUS_COLORS[todo.status] || colors.secondary}>
            {STATUS_ICONS[todo.status] || '○'}{' '}
          </Text>
          <Text
            color={i === selectedIndex ? colors.selected : colors.primary}
            strikethrough={todo.status === 'completed'}
          >
            {todo.content}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

/**
 * Context panel - shows files, info, and other context
 */
const ContextPanel = ({ context }) => {
  if (!context || context.length === 0) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color={colors.secondary} italic>No context loaded.</Text>
        <Text color={colors.secondary} dimColor>Files and info will appear here.</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      {context.map((item, i) => (
        <Box key={i} marginBottom={1}>
          <Box flexDirection="column">
            <Text color={colors.header}>{item.type === 'file' ? '📄 ' : '📋 '}{item.name}</Text>
            {item.description && (
              <Text color={colors.secondary} dimColor>   {item.description}</Text>
            )}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

/**
 * Tasks panel - shows available tasks to run
 */
const TasksPanel = ({ tasks, selectedIndex }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color={colors.secondary} italic>No tasks available.</Text>
        <Text color={colors.secondary} dimColor>Define tasks to run from here.</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      {tasks.map((task, i) => (
        <Box key={i} flexDirection="column" marginBottom={1}>
          <Box>
            <Text color={i === selectedIndex ? colors.selected : colors.primary}>
              {i === selectedIndex ? '▸ ' : '  '}
            </Text>
            <Text color={i === selectedIndex ? colors.selected : colors.header} bold>
              {task.name}
            </Text>
          </Box>
          {task.description && (
            <Text color={colors.secondary} dimColor>    {task.description}</Text>
          )}
        </Box>
      ))}
    </Box>
  );
};

/**
 * Navigation hints
 */
const NavHints = () => (
  <Box marginTop={1} borderStyle="single" borderColor={colors.secondary} paddingX={1}>
    <Text color={colors.secondary}>
      <Text color={colors.selected}>Tab</Text> switch
      <Text color={colors.selected}> ↑↓</Text> navigate
      <Text color={colors.selected}> Enter</Text> select
      <Text color={colors.selected}> Esc</Text> close
    </Text>
  </Box>
);

/**
 * Main Sidebar component
 */
const Sidebar = ({ initialTodos = [], initialContext = [], initialTasks = [] }) => {
  const { exit } = useApp();

  const [activeTab, setActiveTab] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [todos, setTodos] = useState(initialTodos);
  const [context, setContext] = useState(initialContext);
  const [tasks, setTasks] = useState(initialTasks);

  // Set up IPC server to receive updates
  useEffect(() => {
    const server = createServer((message) => {
      switch (message.type) {
        case 'todos':
          setTodos(message.data || []);
          break;
        case 'context':
          setContext(message.data || []);
          break;
        case 'tasks':
          setTasks(message.data || []);
          break;
        case 'focus':
          // Focus a specific tab
          const tabIndex = TABS.findIndex(t => t.toLowerCase() === message.data?.toLowerCase());
          if (tabIndex >= 0) setActiveTab(tabIndex);
          break;
      }
    });

    return () => server.stop();
  }, []);

  // Reset selection when tab changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [activeTab]);

  // Get current list length
  const getListLength = () => {
    switch (activeTab) {
      case 0: return todos.length;
      case 1: return context.length;
      case 2: return tasks.length;
      default: return 0;
    }
  };

  // Handle keyboard input
  useInput((input, key) => {
    // Tab switching
    if (key.tab) {
      if (key.shift) {
        setActiveTab(prev => (prev - 1 + TABS.length) % TABS.length);
      } else {
        setActiveTab(prev => (prev + 1) % TABS.length);
      }
      return;
    }

    // Exit
    if (key.escape) {
      exit();
      return;
    }

    // Navigation
    if (key.upArrow) {
      setSelectedIndex(prev => Math.max(0, prev - 1));
      return;
    }
    if (key.downArrow) {
      const max = getListLength() - 1;
      setSelectedIndex(prev => Math.min(max, prev + 1));
      return;
    }

    // Select/run task
    if (key.return && activeTab === 2 && tasks[selectedIndex]) {
      // For now, just log - could trigger an action via IPC
      console.log('Selected task:', tasks[selectedIndex].name);
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Header />
      <TabBar tabs={TABS} selectedIndex={activeTab} />

      <Box flexDirection="column" flexGrow={1}>
        {activeTab === 0 && <TodosPanel todos={todos} selectedIndex={selectedIndex} />}
        {activeTab === 1 && <ContextPanel context={context} />}
        {activeTab === 2 && <TasksPanel tasks={tasks} selectedIndex={selectedIndex} />}
      </Box>

      <NavHints />
    </Box>
  );
};

export default Sidebar;
