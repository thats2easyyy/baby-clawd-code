import React, { useState, useEffect } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { colors } from '../theme.js';
import { createServer } from './ipc.js';

// File paths for persistence
const DATA_DIR = process.env.HOME + '/.claude-sidebar';
const TASKS_FILE = DATA_DIR + '/tasks.json';
const TODOS_FILE = DATA_DIR + '/todos.json';
const SELECTED_FILE = DATA_DIR + '/selected.json';
const CONTEXT_FILE = DATA_DIR + '/context.json';

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

// Load JSON file safely
async function loadJson(path, defaultValue = []) {
  try {
    const file = Bun.file(path);
    if (await file.exists()) {
      return await file.json();
    }
  } catch {}
  return defaultValue;
}

// Save JSON file
async function saveJson(path, data) {
  try {
    await Bun.write(path, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to save:', err.message);
  }
}

// Ensure data directory exists
async function ensureDataDir() {
  const { mkdir } = await import('node:fs/promises');
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {}
}

/**
 * Header with title
 */
const Header = ({ selectedTask }) => (
  <Box flexDirection="column" marginBottom={1}>
    <Box>
      <Text color={colors.header} bold>┌────────────────────────┐</Text>
    </Box>
    <Box>
      <Text color={colors.header} bold>│  </Text>
      <Text color={colors.selected} bold>Claude Sidebar</Text>
      <Text color={colors.header} bold>       │</Text>
    </Box>
    <Box>
      <Text color={colors.header} bold>└────────────────────────┘</Text>
    </Box>
    {selectedTask && (
      <Box marginTop={1}>
        <Text color={colors.success}>▶ Active: </Text>
        <Text color={colors.primary} bold>{selectedTask}</Text>
      </Box>
    )}
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
 * Todo list display (Claude's todos - read only)
 */
const TodosPanel = ({ todos, selectedIndex }) => {
  if (!todos || todos.length === 0) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color={colors.secondary} italic>No todos from Claude yet.</Text>
        <Text color={colors.secondary} dimColor>Claude's task list will appear here.</Text>
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
 * Context panel - shows files and info
 */
const ContextPanel = ({ context, selectedIndex, onRemove }) => {
  if (!context || context.length === 0) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color={colors.secondary} italic>No context loaded.</Text>
        <Text color={colors.secondary} dimColor>Press 'a' to add files or notes.</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      {context.map((item, i) => (
        <Box key={i}>
          <Text color={i === selectedIndex ? colors.selected : colors.primary}>
            {i === selectedIndex ? '▸ ' : '  '}
          </Text>
          <Text color={colors.header}>
            {item.type === 'file' ? '□ ' : '◇ '}
          </Text>
          <Text color={i === selectedIndex ? colors.selected : colors.primary}>
            {item.name}
          </Text>
          {item.description && (
            <Text color={colors.secondary} dimColor> - {item.description}</Text>
          )}
        </Box>
      ))}
    </Box>
  );
};

/**
 * Tasks panel - your tasks to select
 */
const TasksPanel = ({ tasks, selectedIndex }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text color={colors.secondary} italic>No tasks yet.</Text>
        <Text color={colors.secondary} dimColor>Press 'a' to add a task.</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      {tasks.map((task, i) => (
        <Box key={i} flexDirection="column">
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
 * Input field for adding items
 */
const AddInput = ({ label, value, onSubmit, onCancel }) => (
  <Box marginTop={1} flexDirection="column">
    <Box>
      <Text color={colors.selected}>{label}: </Text>
      <Text color={colors.primary}>{value}</Text>
      <Text color={colors.selected}>▌</Text>
    </Box>
    <Text color={colors.secondary} dimColor>Enter to save, Esc to cancel</Text>
  </Box>
);

/**
 * Navigation hints
 */
const NavHints = ({ mode, activeTab }) => {
  if (mode === 'add') {
    return (
      <Box marginTop={1} borderStyle="single" borderColor={colors.secondary} paddingX={1}>
        <Text color={colors.secondary}>
          <Text color={colors.selected}>Enter</Text> save
          <Text color={colors.selected}> Esc</Text> cancel
        </Text>
      </Box>
    );
  }

  const tabHints = {
    0: '', // Todos - read only
    1: <Text><Text color={colors.selected}> a</Text> add <Text color={colors.selected}>d</Text> remove</Text>,
    2: <Text><Text color={colors.selected}> a</Text> add <Text color={colors.selected}>d</Text> remove <Text color={colors.selected}>Enter</Text> select</Text>,
  };

  return (
    <Box marginTop={1} borderStyle="single" borderColor={colors.secondary} paddingX={1}>
      <Text color={colors.secondary}>
        <Text color={colors.selected}>Tab</Text> switch
        <Text color={colors.selected}> ↑↓</Text> nav
        {tabHints[activeTab]}
        <Text color={colors.selected}> Esc</Text> quit
      </Text>
    </Box>
  );
};

/**
 * Main Sidebar component
 */
const Sidebar = () => {
  const { exit } = useApp();

  const [activeTab, setActiveTab] = useState(2); // Start on Tasks
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState('browse'); // browse | add | add-desc
  const [inputValue, setInputValue] = useState('');
  const [pendingName, setPendingName] = useState('');

  const [todos, setTodos] = useState([]);
  const [context, setContext] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  // Load persisted data on mount
  useEffect(() => {
    (async () => {
      await ensureDataDir();
      setTasks(await loadJson(TASKS_FILE, []));
      setContext(await loadJson(CONTEXT_FILE, []));
      setTodos(await loadJson(TODOS_FILE, []));
      const selected = await loadJson(SELECTED_FILE, null);
      if (selected?.name) setSelectedTask(selected.name);
    })();
  }, []);

  // Watch todos file for changes from Claude
  useEffect(() => {
    const interval = setInterval(async () => {
      const newTodos = await loadJson(TODOS_FILE, []);
      setTodos(newTodos);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Set up IPC server for programmatic updates
  useEffect(() => {
    const server = createServer((message) => {
      switch (message.type) {
        case 'todos':
          setTodos(message.data || []);
          saveJson(TODOS_FILE, message.data || []);
          break;
        case 'context':
          setContext(message.data || []);
          saveJson(CONTEXT_FILE, message.data || []);
          break;
        case 'tasks':
          setTasks(message.data || []);
          saveJson(TASKS_FILE, message.data || []);
          break;
        case 'focus':
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

  // Get current list
  const getList = () => {
    switch (activeTab) {
      case 0: return todos;
      case 1: return context;
      case 2: return tasks;
      default: return [];
    }
  };

  // Add item to current list
  const addItem = async (name, description = '') => {
    if (activeTab === 1) {
      // Context
      const newContext = [...context, { type: 'note', name, description }];
      setContext(newContext);
      await saveJson(CONTEXT_FILE, newContext);
    } else if (activeTab === 2) {
      // Tasks
      const newTasks = [...tasks, { name, description }];
      setTasks(newTasks);
      await saveJson(TASKS_FILE, newTasks);
    }
  };

  // Remove item from current list
  const removeItem = async () => {
    if (activeTab === 1 && context[selectedIndex]) {
      const newContext = context.filter((_, i) => i !== selectedIndex);
      setContext(newContext);
      setSelectedIndex(Math.max(0, selectedIndex - 1));
      await saveJson(CONTEXT_FILE, newContext);
    } else if (activeTab === 2 && tasks[selectedIndex]) {
      const newTasks = tasks.filter((_, i) => i !== selectedIndex);
      setTasks(newTasks);
      setSelectedIndex(Math.max(0, selectedIndex - 1));
      await saveJson(TASKS_FILE, newTasks);
    }
  };

  // Select task for Claude to work on
  const selectTask = async () => {
    if (activeTab === 2 && tasks[selectedIndex]) {
      const task = tasks[selectedIndex];
      setSelectedTask(task.name);
      await saveJson(SELECTED_FILE, task);
    }
  };

  // Handle keyboard input
  useInput((input, key) => {
    // Handle add mode
    if (mode === 'add') {
      if (key.escape) {
        setMode('browse');
        setInputValue('');
        return;
      }
      if (key.return) {
        if (inputValue.trim()) {
          setPendingName(inputValue.trim());
          setInputValue('');
          setMode('add-desc');
        }
        return;
      }
      if (key.backspace || key.delete) {
        setInputValue(prev => prev.slice(0, -1));
        return;
      }
      if (input && !key.ctrl && !key.meta) {
        setInputValue(prev => prev + input);
      }
      return;
    }

    // Handle add-desc mode (description input)
    if (mode === 'add-desc') {
      if (key.escape) {
        // Save with just the name
        addItem(pendingName, '');
        setMode('browse');
        setPendingName('');
        setInputValue('');
        return;
      }
      if (key.return) {
        addItem(pendingName, inputValue.trim());
        setMode('browse');
        setPendingName('');
        setInputValue('');
        return;
      }
      if (key.backspace || key.delete) {
        setInputValue(prev => prev.slice(0, -1));
        return;
      }
      if (input && !key.ctrl && !key.meta) {
        setInputValue(prev => prev + input);
      }
      return;
    }

    // Browse mode
    if (key.tab) {
      if (key.shift) {
        setActiveTab(prev => (prev - 1 + TABS.length) % TABS.length);
      } else {
        setActiveTab(prev => (prev + 1) % TABS.length);
      }
      return;
    }

    if (key.escape) {
      exit();
      return;
    }

    if (key.upArrow) {
      setSelectedIndex(prev => Math.max(0, prev - 1));
      return;
    }

    if (key.downArrow) {
      const max = getList().length - 1;
      setSelectedIndex(prev => Math.min(Math.max(0, max), prev + 1));
      return;
    }

    // Add item (only for context and tasks)
    if (input === 'a' && activeTab !== 0) {
      setMode('add');
      setInputValue('');
      return;
    }

    // Delete item (only for context and tasks)
    if (input === 'd' && activeTab !== 0) {
      removeItem();
      return;
    }

    // Select task
    if (key.return && activeTab === 2) {
      selectTask();
      return;
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Header selectedTask={selectedTask} />
      <TabBar tabs={TABS} selectedIndex={activeTab} />

      <Box flexDirection="column" flexGrow={1}>
        {activeTab === 0 && <TodosPanel todos={todos} selectedIndex={selectedIndex} />}
        {activeTab === 1 && <ContextPanel context={context} selectedIndex={selectedIndex} />}
        {activeTab === 2 && <TasksPanel tasks={tasks} selectedIndex={selectedIndex} />}
      </Box>

      {mode === 'add' && (
        <AddInput
          label={activeTab === 1 ? 'Add context' : 'Task name'}
          value={inputValue}
        />
      )}

      {mode === 'add-desc' && (
        <AddInput
          label="Description (optional)"
          value={inputValue}
        />
      )}

      <NavHints mode={mode} activeTab={activeTab} />
    </Box>
  );
};

export default Sidebar;
