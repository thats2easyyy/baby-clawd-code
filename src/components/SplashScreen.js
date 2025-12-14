import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Box, Text, useInput } from 'ink';
import { SKILLS_MAIN, SHIMMER_CHARS, parseAsciiArt, getCharCount, buildClawd } from '../utils/asciiArt.js';
import { splashGradient, cyanGradient, colors } from '../theme.js';

// Animation timing constants
const FRAME_RATE = 50; // ms between frames (~20fps)
const TYPEWRITER_CHARS_PER_FRAME = 12;
const WAVE_SPEED = 0.15;
const PULSE_SPEED = 0.08;
const SCUTTLE_INTERVAL = 800; // ms between position changes
const LEG_FRAME_RATE = 150; // ms per leg animation frame

// Clawd states
const CLAWD_STATES = {
  HIDDEN: 'hidden',
  SCUTTLING: 'scuttling',
  CENTERING: 'centering',
  HAPPY: 'happy',
};

// Interpolate between two hex colors
const interpolateColor = (color1, color2, factor) => {
  const hex = (c) => parseInt(c, 16);
  const r1 = hex(color1.slice(1, 3));
  const g1 = hex(color1.slice(3, 5));
  const b1 = hex(color1.slice(5, 7));
  const r2 = hex(color2.slice(1, 3));
  const g2 = hex(color2.slice(3, 5));
  const b2 = hex(color2.slice(5, 7));

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
};

// Get color from gradient array based on position and time
const getGradientColor = (gradient, position, time) => {
  const wavePosition = ((position + time * WAVE_SPEED) % 1 + 1) % 1;
  const gradientPos = wavePosition * (gradient.length - 1);
  const colorIndex = Math.floor(gradientPos);
  const colorFactor = gradientPos - colorIndex;

  const color1 = gradient[colorIndex];
  const color2 = gradient[Math.min(colorIndex + 1, gradient.length - 1)];

  return interpolateColor(color1, color2, colorFactor);
};

const SplashScreen = ({ onContinue }) => {
  // Animation state
  const [frame, setFrame] = useState(0);
  const [shimmerMap, setShimmerMap] = useState({});
  const [discoveryShimmer, setDiscoveryShimmer] = useState([]);  // Positions of sparkles around DISCOVERY

  // Clawd state
  const [clawdState, setClawdState] = useState(CLAWD_STATES.HIDDEN);
  const [clawdX, setClawdX] = useState(16); // Start in the middle (half of 33)
  const [legFrame, setLegFrame] = useState(0);

  // Transition state
  const [colorTransition, setColorTransition] = useState(0); // 0 = orange, 1 = cyan
  const [transitionStartFrame, setTransitionStartFrame] = useState(null);

  // Animation phases after typewriter: 0=nothing, 1=clawd, 2=discovery, 3=subtitle, 4=press enter
  const [animPhase, setAnimPhase] = useState(0);
  const [phase1StartFrame, setPhase1StartFrame] = useState(null);
  const [phase2StartFrame, setPhase2StartFrame] = useState(null);
  const [phase3StartFrame, setPhase3StartFrame] = useState(null);
  const [phase4StartFrame, setPhase4StartFrame] = useState(null);

  // Parse ASCII art
  const artLines = useMemo(() => parseAsciiArt(SKILLS_MAIN), []);
  const totalChars = useMemo(() => getCharCount(SKILLS_MAIN), []);
  const maxLineLength = useMemo(() => Math.max(...artLines.map(l => l.length)), [artLines]);

  // Typewriter progress
  const charsToShow = Math.min(frame * TYPEWRITER_CHARS_PER_FRAME, totalChars);
  const typewriterComplete = charsToShow >= totalChars;

  // Handle Enter key
  useInput((input, key) => {
    if (key.return && clawdState === CLAWD_STATES.SCUTTLING) {
      // Start transition sequence
      setClawdState(CLAWD_STATES.CENTERING);
      setTransitionStartFrame(frame);
    }
  });

  // Main animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => f + 1);
    }, FRAME_RATE);

    return () => clearInterval(interval);
  }, []);

  // Phased animation after typewriter completes
  const animStarted = useRef(false);

  useEffect(() => {
    if (!typewriterComplete || animStarted.current) return;
    animStarted.current = true;

    // Phase 1: Clawd appears immediately
    setAnimPhase(1);
    setPhase1StartFrame(frame);
    setClawdState(CLAWD_STATES.SCUTTLING);

    // Phase 2: DISCOVERY starts typing immediately after SKILLS
    setTimeout(() => setAnimPhase(2), 100);

    // Phase 3: Subtitle appears after 1600ms
    setTimeout(() => setAnimPhase(3), 1600);

    // Phase 4: "Press Enter" appears after 3000ms
    setTimeout(() => setAnimPhase(4), 3000);
  }, [typewriterComplete]);

  // Track when phases start for typewriter effects
  useEffect(() => {
    if (animPhase === 2 && phase2StartFrame === null) {
      setPhase2StartFrame(frame);
    }
    if (animPhase === 3 && phase3StartFrame === null) {
      setPhase3StartFrame(frame);
    }
    if (animPhase === 4 && phase4StartFrame === null) {
      setPhase4StartFrame(frame);
    }
  }, [animPhase, phase2StartFrame, phase3StartFrame, phase4StartFrame, frame]);

  // Discovery shimmer effect - sparkles around the word (only during transition)
  useEffect(() => {
    // Only shimmer after Enter is pressed (during transition)
    if (clawdState !== CLAWD_STATES.CENTERING && clawdState !== CLAWD_STATES.HAPPY) {
      setDiscoveryShimmer([]);
      return;
    }

    const shimmerInterval = setInterval(() => {
      // Generate 2-3 sparkles on each side for even distribution
      const sparkles = [];
      const leftCount = Math.floor(Math.random() * 2) + 2;  // 2-3 on left
      const rightCount = Math.floor(Math.random() * 2) + 2; // 2-3 on right

      // Left side sparkles (positions 0-5)
      for (let i = 0; i < leftCount; i++) {
        sparkles.push({
          x: Math.floor(Math.random() * 6),  // 0-5
          char: SHIMMER_CHARS[Math.floor(Math.random() * SHIMMER_CHARS.length)]
        });
      }
      // Right side sparkles (positions 6-11)
      for (let i = 0; i < rightCount; i++) {
        sparkles.push({
          x: Math.floor(Math.random() * 6) + 6,  // 6-11
          char: SHIMMER_CHARS[Math.floor(Math.random() * SHIMMER_CHARS.length)]
        });
      }
      setDiscoveryShimmer(sparkles);
    }, 400);

    return () => clearInterval(shimmerInterval);
  }, [clawdState]);

  // Scuttling movement (left-right)
  // Underline is 46 chars, Clawd is ~13 chars, so range is 0 to 33
  const [walkDirection, setWalkDirection] = useState(1); // 1 = right, -1 = left

  useEffect(() => {
    if (clawdState !== CLAWD_STATES.SCUTTLING) return;

    const walkInterval = setInterval(() => {
      setClawdX(x => {
        const newX = x + walkDirection * 2; // Move 2 units per frame
        // Reverse direction at edges
        if (newX >= 33) {
          setWalkDirection(-1);
          return 33;
        }
        if (newX <= 0) {
          setWalkDirection(1);
          return 0;
        }
        return newX;
      });
    }, 100); // Smooth walking speed

    return () => clearInterval(walkInterval);
  }, [clawdState, walkDirection]);

  // Leg animation when moving
  useEffect(() => {
    if (clawdState !== CLAWD_STATES.SCUTTLING && clawdState !== CLAWD_STATES.CENTERING) return;

    const legInterval = setInterval(() => {
      setLegFrame(f => f + 1);
    }, LEG_FRAME_RATE);

    return () => clearInterval(legInterval);
  }, [clawdState]);

  // Centering transition
  useEffect(() => {
    if (clawdState !== CLAWD_STATES.CENTERING) return;

    // Smoothly move to center (center is at 16, half of 33)
    const centerInterval = setInterval(() => {
      setClawdX(x => {
        const center = 16;
        if (Math.abs(x - center) < 1) return center;
        return x + (center - x) * 0.3;
      });
    }, 50);

    // After centering, become happy
    const happyTimeout = setTimeout(() => {
      setClawdState(CLAWD_STATES.HAPPY);
      setClawdX(16);

      // Exit after celebration
      setTimeout(() => {
        if (onContinue) onContinue();
      }, 2000);
    }, 600);

    return () => {
      clearInterval(centerInterval);
      clearTimeout(happyTimeout);
    };
  }, [clawdState, onContinue]);

  // Color transition animation
  useEffect(() => {
    if (transitionStartFrame === null) return;

    const transitionDuration = 12; // frames (~600ms)
    const elapsed = frame - transitionStartFrame;
    const progress = Math.min(elapsed / transitionDuration, 1);

    setColorTransition(progress);

    // Trigger shimmer during transition
    if (progress > 0 && progress < 1) {
      setShimmerMap(prev => {
        const next = {};
        // Decay existing
        Object.keys(prev).forEach(key => {
          if (Math.random() > 0.3) next[key] = prev[key];
        });
        // Add new shimmers
        for (let i = 0; i < 5; i++) {
          const row = Math.floor(Math.random() * artLines.length);
          const col = Math.floor(Math.random() * artLines[row].length);
          if (artLines[row][col] !== ' ') {
            next[`${row}-${col}`] = SHIMMER_CHARS[Math.floor(Math.random() * SHIMMER_CHARS.length)];
          }
        }
        return next;
      });

    } else if (progress >= 1) {
      setShimmerMap({});
    }
  }, [frame, transitionStartFrame, artLines]);

  // Get current gradient based on transition
  const getCurrentGradient = useCallback(() => {
    if (colorTransition === 0) return splashGradient;
    if (colorTransition === 1) return cyanGradient;

    // Blend gradients
    return splashGradient.map((orangeColor, i) => {
      const cyanColor = cyanGradient[i % cyanGradient.length];
      return interpolateColor(orangeColor, cyanColor, colorTransition);
    });
  }, [colorTransition]);

  // Render the ASCII art
  const renderArt = () => {
    const gradient = getCurrentGradient();
    let globalCharIndex = 0;

    return artLines.map((line, rowIndex) => {
      const segments = [];
      let currentSegment = { chars: '', color: null };

      for (let colIndex = 0; colIndex < line.length; colIndex++) {
        const char = line[colIndex];
        const charGlobalIndex = globalCharIndex;
        globalCharIndex++;

        // Typewriter: not yet revealed
        if (charGlobalIndex >= charsToShow) {
          if (currentSegment.chars) {
            segments.push(currentSegment);
            currentSegment = { chars: '', color: null };
          }
          segments.push({ chars: ' ', color: null });
          continue;
        }

        // Check shimmer
        const shimmerKey = `${rowIndex}-${colIndex}`;
        const isShimmering = shimmerMap[shimmerKey];

        // Calculate gradient color
        const position = colIndex / maxLineLength;
        const color = isShimmering ? '#FFFFFF' : getGradientColor(gradient, position, frame * 0.1);

        // Flash effect for newly revealed
        const isNewlyRevealed = charGlobalIndex >= charsToShow - TYPEWRITER_CHARS_PER_FRAME && !typewriterComplete;
        const finalColor = isNewlyRevealed && char !== ' ' ? '#FFFFFF' : color;
        const displayChar = isShimmering && char !== ' ' ? isShimmering : char;

        if (currentSegment.color === finalColor || char === ' ') {
          currentSegment.chars += displayChar;
        } else {
          if (currentSegment.chars) segments.push(currentSegment);
          currentSegment = { chars: displayChar, color: finalColor };
        }
      }

      if (currentSegment.chars) segments.push(currentSegment);

      return (
        <Box key={`row-${rowIndex}`}>
          {segments.map((seg, i) => (
            <Text key={`seg-${rowIndex}-${i}`} color={seg.color}>{seg.chars}</Text>
          ))}
        </Box>
      );
    });
  };

  // Render Clawd
  const renderClawd = () => {
    if (clawdState === CLAWD_STATES.HIDDEN) return null;

    const isHappy = clawdState === CLAWD_STATES.HAPPY;
    const expression = isHappy ? 'happy' : 'scared';
    const clawdLines = buildClawd(expression, legFrame, isHappy);

    // Get Clawd color
    const clawdColor = colorTransition === 0
      ? colors.header
      : interpolateColor(colors.header, '#81D4FA', colorTransition);

    // Calculate padding for horizontal position within the 46-char line
    const padding = Math.max(0, Math.round(clawdX));

    return (
      <Box flexDirection="column" alignItems="center" marginTop={1}>
        {/* Container matches underline width (46 chars), no centering inside */}
        <Box width={46} flexDirection="column">
          <Box paddingLeft={padding} flexDirection="column">
            {clawdLines.map((line, i) => (
              <Box key={`clawd-${i}`}>
                <Text color={clawdColor}>{line}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  // Render DISCOVERY with shimmer sparkles
  const renderDiscovery = () => {
    if (animPhase < 2) return null; // Only show after phase 2

    // Wide letter-spacing
    const fullWord = 'D I S C O V E R Y';

    // Typewriter effect - reveal characters over time
    const framesSincePhase2 = phase2StartFrame !== null ? frame - phase2StartFrame : 0;
    const charsToReveal = Math.min(Math.floor(framesSincePhase2 * 2), fullWord.length); // 2 chars per frame
    const word = fullWord.substring(0, charsToReveal);
    const isTyping = charsToReveal < fullWord.length;

    // Lighter salmon/orange color for the word
    const wordColor = colorTransition > 0
      ? interpolateColor('#D4856A', '#81D4FA', colorTransition)
      : '#D4856A';

    const sparkleColor = colorTransition > 0
      ? interpolateColor(colors.header, '#81D4FA', colorTransition)
      : colors.header;

    // Build segments with sparkles on left, word in middle, sparkles on right
    const leftSparkles = discoveryShimmer.filter(s => s.x < 6).slice(0, 3);
    const rightSparkles = discoveryShimmer.filter(s => s.x >= 6).slice(0, 3);

    // Build left side with sparkles
    let leftSide = '      ';  // 6 chars
    leftSparkles.forEach(s => {
      const pos = Math.abs(s.x % 6);
      leftSide = leftSide.substring(0, pos) + s.char + leftSide.substring(pos + 1);
    });

    // Build right side with sparkles
    let rightSide = '      ';  // 6 chars
    rightSparkles.forEach(s => {
      const pos = Math.abs(s.x % 6);
      rightSide = rightSide.substring(0, pos) + s.char + rightSide.substring(pos + 1);
    });

    return (
      <Box marginTop={1}>
        <Text color={sparkleColor}>{leftSide}</Text>
        <Text color={wordColor}>{word}</Text>
        <Text color={sparkleColor}>{rightSide}</Text>
      </Box>
    );
  };

  // Pulsing "Press Enter" - changes to cyan during transition
  const pulseIntensity = Math.sin(frame * PULSE_SPEED) * 0.5 + 0.5;
  const baseColor = colorTransition > 0
    ? interpolateColor(colors.header, '#81D4FA', colorTransition)
    : colors.header;
  const pulseColor = interpolateColor('#666666', baseColor, pulseIntensity);

  // Subtitle visible after phase 3
  const subtitleVisible = animPhase >= 3;

  // Press Enter visible after phase 4
  const pressEnterVisible = animPhase >= 4;

  // Underline starts growing after Clawd appears (phase 1)
  const underlineVisible = animPhase >= 1;
  const framesSincePhase1 = phase1StartFrame !== null ? frame - phase1StartFrame : 0;
  const underlineLength = Math.min(Math.floor(framesSincePhase1 * 2), 46); // Grows 2 chars per frame
  const underlineColor = colorTransition > 0
    ? interpolateColor(colors.header, '#81D4FA', colorTransition)
    : colors.header;

  return (
    <Box
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      paddingTop={1}
      paddingBottom={1}
    >
      {/* ASCII Art Header */}
      <Box flexDirection="column" alignItems="center">
        {renderArt()}
      </Box>

      {/* DISCOVERY with shimmer */}
      {renderDiscovery()}

      {/* Clawd */}
      {renderClawd()}

      {/* Animated underline */}
      {underlineVisible && (
        <Box>
          <Text color={underlineColor}>
            {'═'.repeat(underlineLength)}
          </Text>
        </Box>
      )}

      {/* Subtitle with typewriter */}
      <Box marginTop={1}>
        {subtitleVisible && (() => {
          const fullText = 'A Claude Code concept by Tyler Nishida';
          const framesSincePhase3 = phase3StartFrame !== null ? frame - phase3StartFrame : 0;
          const charsToReveal = Math.min(Math.floor(framesSincePhase3 * 2), fullText.length);
          const revealed = fullText.substring(0, charsToReveal);
          const padding = ' '.repeat(fullText.length - charsToReveal);
          return <Text color={colors.secondary}>{revealed}{padding}</Text>;
        })()}
      </Box>

      {/* Press Enter prompt with typewriter - hide after pressing */}
      <Box marginTop={1}>
        {pressEnterVisible && clawdState === CLAWD_STATES.SCUTTLING && (() => {
          const fullText = 'Press Enter to continue...';
          const framesSincePhase4 = phase4StartFrame !== null ? frame - phase4StartFrame : 0;
          const charsToReveal = Math.min(Math.floor(framesSincePhase4 * 2), fullText.length);
          const revealed = fullText.substring(0, charsToReveal);
          const padding = ' '.repeat(fullText.length - charsToReveal);
          return <Text color={pulseColor}>{revealed}{padding}</Text>;
        })()}
        {clawdState === CLAWD_STATES.HAPPY && (
          <Text color="#81D4FA">
            Welcome!
          </Text>
        )}
      </Box>

    </Box>
  );
};

export default SplashScreen;
