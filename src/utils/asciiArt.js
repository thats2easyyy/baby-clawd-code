// ASCII Art definitions for splash screen

// Retro pixel-style "SKILLS" - chunky block letters
export const SKILLS_ASCII = `
███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
███████╗█████╔╝ ██║██║     ██║     ███████╗
╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
███████║██║  ██╗██║███████╗███████╗███████║
╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝
`.trim();

// Alternative blockier style
export const SKILLS_BLOCKY = `
 ▄▄▄▄▄  ▄ ▄▄ ▄▄▄▄ ▄    ▄    ▄▄▄▄▄
▐▌     █▀▄  ▀█   █    █    ▐▌
 ▀▀▀▄▄ █  ▀▄ █   █    █     ▀▀▀▄▄
     ▐▌█ ▄▀  █   █    █         ▐▌
▀▄▄▄▄▀ █  █ ▄█▄▄ █▄▄▄ █▄▄▄ ▀▄▄▄▄▀
`.trim();

// Clean modern block style
export const SKILLS_MODERN = `
╔═╗╦╔═╦╦  ╦  ╔═╗
╚═╗╠╩╗║║  ║  ╚═╗
╚═╝╩ ╩╩╩═╝╩═╝╚═╝
`.trim();

// Extra chunky retro arcade style
export const SKILLS_ARCADE = `
 ▄▄▄▄  █   ▄ █ █    █    ▄▄▄▄
█▀    █▀▄▀  █ █    █    █▀
 ▀▀▄▄ █  █  █ █    █     ▀▀▄▄
    █ █  █  █ █    █        █
▀▄▄▀  █  █ ▄█ ▀▄▄▀ ▀▄▄▀ ▀▄▄▀
`.trim();

// Large impactful header - the main one we'll use
export const SKILLS_HERO = `
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█░▄▄▄▄░█░█░█▀█░█░██░██░██░█░▄▄▄▄░█░█░█▀█░█░██░██░██
█▀▄▄▄▄░█░▀▄▀░█░█░██░██░██░█▀▄▄▄▄░█░▀▄▀░█░█░██░██░██
█░▀▀▀▀░█░█░█▄█░█░██░██░██░█░▀▀▀▀░█░█░█▄█░█░██░██░██
▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
`.trim();

// Selected style: Large figlet-inspired with good visual weight
export const SKILLS_MAIN = `
 ███████╗██╗  ██╗██╗██╗     ██╗     ███████╗
 ██╔════╝██║ ██╔╝██║██║     ██║     ██╔════╝
 ███████╗█████╔╝ ██║██║     ██║     ███████╗
 ╚════██║██╔═██╗ ██║██║     ██║     ╚════██║
 ███████║██║  ██╗██║███████╗███████╗███████║
 ╚══════╝╚═╝  ╚═╝╚═╝╚══════╝╚══════╝╚══════╝
`.trim();

// Discovery subtitle in smaller text
export const DISCOVERY_ASCII = `
 ▀█▀ █ █▀ █▀▀ █▀█ █ █ █▀▀ █▀█ █ █
 █▀ █ ▄█ █▄▄ █▄█ ▀▄▀ ██▄ █▀▄ ▀▄▀
`.trim();

// Shimmer characters for sparkle effects
export const SHIMMER_CHARS = ['✦', '✧', '◆', '◇', '★', '☆', '·', '•'];

// Convert ASCII art string to 2D array for character-by-character manipulation
export const parseAsciiArt = (art) => {
  return art.split('\n').map(line => [...line]);
};

// Get total character count for typewriter effect
export const getCharCount = (art) => {
  return art.split('\n').reduce((sum, line) => sum + line.length, 0);
};

// Get character at linear index (for typewriter effect)
export const getCharAtIndex = (artLines, index) => {
  let currentIndex = 0;
  for (let row = 0; row < artLines.length; row++) {
    for (let col = 0; col < artLines[row].length; col++) {
      if (currentIndex === index) {
        return { row, col, char: artLines[row][col] };
      }
      currentIndex++;
    }
  }
  return null;
};

// ============================================
// CLAWD - The Claude mascot ASCII art
// ============================================

// Clawd frames - block character style

// Scared/scuttling (same shape as happy, no stars)
export const CLAWD_SCARED = [
  '   ▐▛███▜▌   ',
  '  ▝▜█████▛▘  ',
  '    ▘▘ ▝▝    ',
];

// Happy/celebrating (arms out, with stars)
export const CLAWD_HAPPY = [
  ' * ▐▛███▜▌ * ',
  '* ▝▜█████▛▘ *',
  ' *  ▘▘ ▝▝  * ',
];

// Leg animation frames for scuttling
export const CLAWD_LEGS_ANIMATED = [
  '    ▘▘ ▝▝    ',  // Frame 0: normal
  '    ▘  ▝▝    ',  // Frame 1: left up
  '    ▘▘ ▝▝    ',  // Frame 2: normal
  '    ▘▘  ▝    ',  // Frame 3: right up
];

// Build Clawd frame based on state
export const buildClawd = (expression = 'scared', legFrame = 0, armsExtended = false) => {
  if (expression === 'happy' || armsExtended) {
    return CLAWD_HAPPY;
  }

  // Scared/scuttling with leg animation
  const legs = CLAWD_LEGS_ANIMATED[legFrame % CLAWD_LEGS_ANIMATED.length];
  return [
    '   ▐▛███▜▌   ',
    '  ▝▜█████▛▘  ',
    legs,
  ];
};

// ============================================
// Additional Clawd Expressions
// ============================================

// Clawd searching (waiting for input)
export const CLAWD_SEARCHING = [
  '   ▐▛███▜▌ ...',
  '  ▝▜█████▛▘   ',
  '    ▘▘ ▝▝     ',
];

// Clawd confused/no results
export const CLAWD_CONFUSED = [
  ' ? ▐▛███▜▌ ? ',
  '  ▝▜█████▛▘  ',
  '    ▘▘ ▝▝    ',
];

// ============================================
// Category Icons & Decorations
// ============================================

export const CATEGORY_ICONS = {
  'Browser & Testing': '◉',
  'Development': '⌘',
  'DevOps': '⚙',
  'Documents': '☰',
  'Workflow': '▸',
  'Meta': '✧',
};

// Section dividers for visual hierarchy
export const SECTION_DIVIDER = '─────────────────────────────────────';
export const SECTION_HEADER = (text) => `▸ ${text}`;
