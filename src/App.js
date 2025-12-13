import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import MainMenu from './screens/MainMenu.js';
import CategoryList from './screens/CategoryList.js';
import CategoryView from './screens/CategoryView.js';
import SkillDetail from './screens/SkillDetail.js';
import CreatorProfile from './screens/CreatorProfile.js';
import SearchScreen from './screens/SearchScreen.js';
import PopularView from './screens/PopularView.js';
import BackHint from './components/BackHint.js';
import { colors } from './theme.js';

// Screen names for routing
export const SCREENS = {
  MAIN_MENU: 'main_menu',
  CATEGORY_LIST: 'category_list',
  CATEGORY_VIEW: 'category_view',
  SKILL_DETAIL: 'skill_detail',
  CREATOR_PROFILE: 'creator_profile',
  SEARCH: 'search',
  POPULAR: 'popular',
};

// Navigation history for back functionality
const useNavigation = () => {
  const [history, setHistory] = useState([{ screen: SCREENS.MAIN_MENU, params: {} }]);

  const currentScreen = history[history.length - 1];

  const navigate = useCallback((screen, params = {}) => {
    setHistory(prev => [...prev, { screen, params }]);
  }, []);

  const goBack = useCallback(() => {
    setHistory(prev => {
      if (prev.length <= 1) return prev;
      return prev.slice(0, -1);
    });
  }, []);

  const goToMainMenu = useCallback(() => {
    setHistory([{ screen: SCREENS.MAIN_MENU, params: {} }]);
  }, []);

  const isAtMainMenu = history.length === 1;

  return { currentScreen, navigate, goBack, goToMainMenu, isAtMainMenu };
};

const App = () => {
  const { currentScreen, navigate, goBack, isAtMainMenu } = useNavigation();
  const { exit } = useApp();
  const [showExitHint, setShowExitHint] = useState(false);
  const exitTimeoutRef = useRef(null);

  // Clear exit hint after timeout
  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
    };
  }, []);

  // Global keyboard handler for back navigation and Ctrl+C
  useInput((input, key) => {
    if (key.escape && !isAtMainMenu) {
      goBack();
    }

    // Handle Ctrl+C
    if (input === 'c' && key.ctrl) {
      if (showExitHint) {
        // Second press - exit the app
        exit();
      } else {
        // First press - show hint
        setShowExitHint(true);
        if (exitTimeoutRef.current) {
          clearTimeout(exitTimeoutRef.current);
        }
        exitTimeoutRef.current = setTimeout(() => {
          setShowExitHint(false);
        }, 2000);
      }
    }
  });

  // Render current screen based on navigation state
  const renderScreen = () => {
    switch (currentScreen.screen) {
      case SCREENS.MAIN_MENU:
        return <MainMenu navigate={navigate} />;
      case SCREENS.CATEGORY_LIST:
        return <CategoryList navigate={navigate} />;
      case SCREENS.CATEGORY_VIEW:
        return <CategoryView category={currentScreen.params.category} navigate={navigate} />;
      case SCREENS.SKILL_DETAIL:
        return <SkillDetail skillName={currentScreen.params.skillName} navigate={navigate} />;
      case SCREENS.CREATOR_PROFILE:
        return <CreatorProfile
          handle={currentScreen.params.handle}
          showList={currentScreen.params.showList}
          navigate={navigate}
        />;
      case SCREENS.SEARCH:
        return <SearchScreen navigate={navigate} />;
      case SCREENS.POPULAR:
        return <PopularView navigate={navigate} />;
      default:
        return <Text>Unknown screen</Text>;
    }
  };

  return (
    <Box flexDirection="column">
      {renderScreen()}
      <BackHint isAtMainMenu={isAtMainMenu} />
      {showExitHint && (
        <Box marginTop={1}>
          <Text color={colors.error}>Press Ctrl-C again to exit</Text>
        </Box>
      )}
    </Box>
  );
};

// Export for testing
export { useNavigation };
export default App;
