import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, useInput, useApp } from 'ink';

// Components
import InputField from './components/InputField.js';
import TabBar from './components/TabBar.js';
import CommandMenu, { COMMANDS } from './components/CommandMenu.js';
import NavHints from './components/NavHints.js';

// Tabs
import PopularTab, { getPopularCount, getPopularSkillAtIndex } from './tabs/PopularTab.js';
import BrowseTab, { getBrowseCount, getCategoryAtIndex } from './tabs/BrowseTab.js';
import SearchTab, { getSearchCount, getSearchSkillAtIndex } from './tabs/SearchTab.js';
import CreatorsTab, { getCreatorsCount, getCreatorAtIndex } from './tabs/CreatorsTab.js';

// Views
import SkillDetailView, { SKILL_DETAIL_ACTIONS } from './views/SkillDetailView.js';
import CategoryDetailView, { getCategorySkillCount, getCategorySkillAtIndex } from './views/CategoryDetailView.js';
import CreatorDetailView, { getCreatorSkillCount, getCreatorSkillAtIndex } from './views/CreatorDetailView.js';

// Splash screen
import SplashScreen from './components/SplashScreen.js';

import { colors } from './theme.js';

// View modes
const MODES = {
  SPLASH: 'splash',             // Animated intro screen
  INITIAL: 'initial',           // Empty input, waiting for /command
  COMMAND_MENU: 'command_menu', // Showing slash command menu
  SKILLS: 'skills',             // In skills discovery (tabs)
  SKILL_DETAIL: 'skill_detail', // Viewing a skill
  CATEGORY_DETAIL: 'category',  // Viewing skills in a category
  CREATOR_DETAIL: 'creator',    // Viewing a creator's profile
};

const TABS = ['Popular', 'Browse', 'Search', 'Creators'];

const App = () => {
  const { exit } = useApp();

  // Core state
  const [mode, setMode] = useState(MODES.SPLASH);
  const [inputValue, setInputValue] = useState('');

  // Command menu state
  const [commandIndex, setCommandIndex] = useState(0);

  // Skills mode state
  const [activeTab, setActiveTab] = useState(0);
  const [listIndex, setListIndex] = useState(0);

  // Detail view state
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCreator, setSelectedCreator] = useState(null);
  const [detailIndex, setDetailIndex] = useState(0);

  // Exit handling
  const [showExitHint, setShowExitHint] = useState(false);
  const exitTimeoutRef = useRef(null);

  // Clear exit hint timeout on unmount
  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
    };
  }, []);

  // Reset list index when tab changes or filter changes
  useEffect(() => {
    setListIndex(0);
  }, [activeTab, inputValue]);

  // Get current list count based on active tab
  const getListCount = () => {
    const filter = mode === MODES.SKILLS ? inputValue : '';
    switch (activeTab) {
      case 0: return getPopularCount(filter);
      case 1: return getBrowseCount(filter);
      case 2: return getSearchCount(filter);
      case 3: return getCreatorsCount(filter);
      default: return 0;
    }
  };

  // Get filtered commands
  const getFilteredCommands = () => {
    const searchTerm = inputValue.startsWith('/') ? inputValue.slice(1).toLowerCase() : inputValue.toLowerCase();
    return COMMANDS.filter(cmd =>
      cmd.name.toLowerCase().includes(searchTerm) ||
      cmd.description.toLowerCase().includes(searchTerm)
    );
  };

  // Handle keyboard input
  useInput((input, key) => {
    // Splash screen handles its own input (except Ctrl+C)
    if (mode === MODES.SPLASH) {
      // Only allow Ctrl+C to fall through for exit handling
      if (!(input === 'c' && key.ctrl)) {
        return;
      }
    }

    // Handle Ctrl+C for exit
    if (input === 'c' && key.ctrl) {
      if (showExitHint) {
        exit();
      } else {
        setShowExitHint(true);
        if (exitTimeoutRef.current) {
          clearTimeout(exitTimeoutRef.current);
        }
        exitTimeoutRef.current = setTimeout(() => {
          setShowExitHint(false);
        }, 2000);
      }
      return;
    }

    // Handle escape for going back
    if (key.escape) {
      switch (mode) {
        case MODES.COMMAND_MENU:
          setMode(MODES.INITIAL);
          setInputValue('');
          setCommandIndex(0);
          break;
        case MODES.SKILLS:
          setMode(MODES.INITIAL);
          setInputValue('');
          setActiveTab(0);
          setListIndex(0);
          break;
        case MODES.SKILL_DETAIL:
          // Go back to previous context
          if (selectedCategory) {
            setMode(MODES.CATEGORY_DETAIL);
          } else if (selectedCreator) {
            setMode(MODES.CREATOR_DETAIL);
          } else {
            setMode(MODES.SKILLS);
          }
          setSelectedSkill(null);
          setDetailIndex(0);
          break;
        case MODES.CATEGORY_DETAIL:
          setMode(MODES.SKILLS);
          setSelectedCategory(null);
          setListIndex(0);
          break;
        case MODES.CREATOR_DETAIL:
          setMode(MODES.SKILLS);
          setSelectedCreator(null);
          setListIndex(0);
          break;
        default:
          break;
      }
      return;
    }

    // Handle Tab key for switching tabs in skills mode
    if (key.tab && mode === MODES.SKILLS) {
      if (key.shift) {
        setActiveTab(prev => (prev - 1 + TABS.length) % TABS.length);
      } else {
        setActiveTab(prev => (prev + 1) % TABS.length);
      }
      return;
    }

    // Handle arrow keys
    if (key.upArrow || key.downArrow) {
      const direction = key.upArrow ? -1 : 1;

      switch (mode) {
        case MODES.COMMAND_MENU: {
          const cmds = getFilteredCommands();
          setCommandIndex(prev => Math.max(0, Math.min(cmds.length - 1, prev + direction)));
          break;
        }
        case MODES.SKILLS: {
          const count = getListCount();
          setListIndex(prev => Math.max(0, Math.min(count - 1, prev + direction)));
          break;
        }
        case MODES.SKILL_DETAIL:
          setDetailIndex(prev => Math.max(0, Math.min(SKILL_DETAIL_ACTIONS - 1, prev + direction)));
          break;
        case MODES.CATEGORY_DETAIL: {
          const count = getCategorySkillCount(selectedCategory, inputValue);
          setDetailIndex(prev => Math.max(0, Math.min(count - 1, prev + direction)));
          break;
        }
        case MODES.CREATOR_DETAIL: {
          const count = getCreatorSkillCount(selectedCreator);
          setDetailIndex(prev => Math.max(0, Math.min(count - 1, prev + direction)));
          break;
        }
        default:
          break;
      }
      return;
    }

    // Handle Enter key
    if (key.return) {
      switch (mode) {
        case MODES.COMMAND_MENU: {
          const cmds = getFilteredCommands();
          if (cmds.length > 0 && cmds[commandIndex]) {
            if (cmds[commandIndex].name === '/skills') {
              setMode(MODES.SKILLS);
              setInputValue('');
              setCommandIndex(0);
            }
          }
          break;
        }
        case MODES.SKILLS: {
          const filter = inputValue;
          switch (activeTab) {
            case 0: { // Popular
              const skill = getPopularSkillAtIndex(listIndex, filter);
              if (skill) {
                setSelectedSkill(skill.name);
                setSelectedCategory(null);
                setSelectedCreator(null);
                setMode(MODES.SKILL_DETAIL);
                setDetailIndex(0);
                setInputValue('');
              }
              break;
            }
            case 1: { // Browse
              const category = getCategoryAtIndex(listIndex, filter);
              if (category) {
                setSelectedCategory(category);
                setMode(MODES.CATEGORY_DETAIL);
                setDetailIndex(0);
                setInputValue('');
              }
              break;
            }
            case 2: { // Search
              const skill = getSearchSkillAtIndex(listIndex, filter);
              if (skill) {
                setSelectedSkill(skill.name);
                setSelectedCategory(null);
                setSelectedCreator(null);
                setMode(MODES.SKILL_DETAIL);
                setDetailIndex(0);
                setInputValue('');
              }
              break;
            }
            case 3: { // Creators
              const creator = getCreatorAtIndex(listIndex, filter);
              if (creator) {
                setSelectedCreator(creator.handle);
                setMode(MODES.CREATOR_DETAIL);
                setDetailIndex(0);
                setInputValue('');
              }
              break;
            }
          }
          break;
        }
        case MODES.CATEGORY_DETAIL: {
          const skill = getCategorySkillAtIndex(selectedCategory, detailIndex, inputValue);
          if (skill) {
            setSelectedSkill(skill.name);
            setMode(MODES.SKILL_DETAIL);
            setDetailIndex(0);
          }
          break;
        }
        case MODES.CREATOR_DETAIL: {
          const skill = getCreatorSkillAtIndex(selectedCreator, detailIndex);
          if (skill) {
            setSelectedSkill(skill.name);
            setMode(MODES.SKILL_DETAIL);
            setDetailIndex(0);
          }
          break;
        }
        case MODES.SKILL_DETAIL: {
          if (detailIndex === 0) {
            // Install action - could copy to clipboard
            // For now just visual feedback
          } else if (detailIndex === 1) {
            // View creator
            const skill = getPopularSkillAtIndex(0, '') || { creator: 'unknown' };
            // Get the actual skill's creator
            import('./data/index.js').then(({ getSkillByName }) => {
              const s = getSkillByName(selectedSkill);
              if (s) {
                setSelectedCreator(s.creator);
                setSelectedCategory(null);
                setMode(MODES.CREATOR_DETAIL);
                setDetailIndex(0);
              }
            });
          }
          break;
        }
        default:
          break;
      }
      return;
    }

    // Handle backspace
    if (key.backspace || key.delete) {
      setInputValue(prev => {
        const newValue = prev.slice(0, -1);
        // If we delete the slash, go back to initial mode
        if (mode === MODES.COMMAND_MENU && !newValue.startsWith('/')) {
          setMode(MODES.INITIAL);
          setCommandIndex(0);
        }
        return newValue;
      });
      return;
    }

    // Handle regular character input
    if (input && input.length === 1 && !key.ctrl && !key.meta) {
      setInputValue(prev => {
        const newValue = prev + input;
        // If we type /, show command menu
        if (mode === MODES.INITIAL && newValue === '/') {
          setMode(MODES.COMMAND_MENU);
        }
        return newValue;
      });
    }
  });

  // Render content based on mode
  const renderContent = () => {
    switch (mode) {
      case MODES.INITIAL:
        return null;

      case MODES.COMMAND_MENU:
        return <CommandMenu filter={inputValue} selectedIndex={commandIndex} />;

      case MODES.SKILLS:
        return (
          <>
            <TabBar tabs={TABS} selectedIndex={activeTab} />
            {activeTab === 0 && <PopularTab selectedIndex={listIndex} filter={inputValue} />}
            {activeTab === 1 && <BrowseTab selectedIndex={listIndex} filter={inputValue} />}
            {activeTab === 2 && <SearchTab selectedIndex={listIndex} filter={inputValue} />}
            {activeTab === 3 && <CreatorsTab selectedIndex={listIndex} filter={inputValue} />}
          </>
        );

      case MODES.SKILL_DETAIL:
        return <SkillDetailView skillName={selectedSkill} selectedIndex={detailIndex} />;

      case MODES.CATEGORY_DETAIL:
        return <CategoryDetailView category={selectedCategory} selectedIndex={detailIndex} filter={inputValue} />;

      case MODES.CREATOR_DETAIL:
        return <CreatorDetailView handle={selectedCreator} selectedIndex={detailIndex} />;

      default:
        return null;
    }
  };

  // Determine hint mode
  const getHintMode = () => {
    switch (mode) {
      case MODES.INITIAL: return 'initial';
      case MODES.COMMAND_MENU: return 'command';
      case MODES.SKILLS: return 'tabs';
      default: return 'detail';
    }
  };

  // Render splash screen
  if (mode === MODES.SPLASH) {
    return <SplashScreen onContinue={() => setMode(MODES.INITIAL)} />;
  }

  return (
    <Box flexDirection="column">
      <InputField value={inputValue} />
      {renderContent()}
      <NavHints mode={getHintMode()} />
      {showExitHint && (
        <Box marginTop={1}>
          <Text color={colors.error}>Press Ctrl-C again to exit</Text>
        </Box>
      )}
    </Box>
  );
};

export default App;
