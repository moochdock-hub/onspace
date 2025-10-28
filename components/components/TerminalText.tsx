
import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, TextStyle, Platform } from 'react-native';
import { COLORS, TYPOGRAPHY } from '../constants/theme';

interface TerminalTextProps {
  children: string;
  delay?: number;
  style?: TextStyle;
  enableTypewriter?: boolean;
  glowColor?: string;
  variant?: 'header' | 'mono' | 'small';
  color?: keyof typeof COLORS | 'background';
}

export function TerminalText({ 
  children, 
  delay = 30, 
  style, 
  enableTypewriter = false,
  glowColor = COLORS.primary,
  variant = 'mono',
  color
}: TerminalTextProps) {
  const [displayText, setDisplayText] = useState(enableTypewriter ? '' : children);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    if (!enableTypewriter) return;
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= children.length) {
        setDisplayText(children.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, delay);

    return () => clearInterval(interval);
  }, [children, delay, enableTypewriter]);

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  const showCursor = enableTypewriter && displayText.length < children.length;

  const getVariantStyle = () => {
    switch (variant) {
      case 'header':
        return styles.header;
      case 'small':
        return styles.small;
      default:
        return styles.mono;
    }
  };

  const getColorValue = () => {
    if (color === 'background') return COLORS.background;
    if (color && color in COLORS) return COLORS[color as keyof typeof COLORS];
    return COLORS.primary;
  };

  return (
    <Text style={[
      getVariantStyle(),
      { 
        color: color ? getColorValue() : COLORS.primary,
        textShadowColor: glowColor 
      },
      style
    ]}>
      {displayText}
      {showCursor && cursor && (
        <Text style={[styles.cursor, { color: glowColor, textShadowColor: glowColor }]}>
          ▌
        </Text>
      )}
    </Text>
  );
}

const styles = StyleSheet.create({
  mono: {
    ...TYPOGRAPHY.mono,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  header: {
    ...TYPOGRAPHY.h2,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  small: {
    ...TYPOGRAPHY.mono,
    fontSize: 12,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  cursor: {
    fontWeight: '900',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});
