
import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { COLORS, TYPOGRAPHY, HIGHLIGHT_PATTERNS, TECH_SYMBOLS } from '../constants/theme';

interface HighlightedTextProps {
  children: string;
  style?: TextStyle;
  glowColor?: string;
  enableHighlights?: boolean;
}

export default function HighlightedText({ 
  children, 
  style, 
  glowColor = COLORS.primary,
  enableHighlights = true 
}: HighlightedTextProps) {
  if (!enableHighlights || !children) {
    return <Text style={[styles.baseText, style]}>{children}</Text>;
  }

  const renderHighlightedText = (text: string) => {
    let elements: React.ReactElement[] = [];
    let lastIndex = 0;
    let keyIndex = 0;

    // Combine all highlight patterns
    const allMatches: Array<{
      match: RegExpMatchArray;
      type: 'technical' | 'emphasis' | 'entities' | 'symbols';
    }> = [];

    // Find all matches
    Object.entries(HIGHLIGHT_PATTERNS).forEach(([type, pattern]) => {
      const matches = Array.from(text.matchAll(pattern));
      matches.forEach(match => {
        allMatches.push({ match, type: type as 'technical' | 'emphasis' | 'entities' | 'symbols' });
      });
    });

    // Sort by position
    allMatches.sort((a, b) => (a.match.index || 0) - (b.match.index || 0));

    // Render with highlights
    allMatches.forEach(({ match, type }) => {
      const matchIndex = match.index || 0;
      const matchText = match[0];

      // Add text before match
      if (lastIndex < matchIndex) {
        const beforeText = text.substring(lastIndex, matchIndex);
        elements.push(
          <Text key={`before-${keyIndex}`} style={[styles.baseText, style]}>
            {beforeText}
          </Text>
        );
      }

      // Add highlighted match
      const highlightStyle = getHighlightStyle(type, glowColor);
      elements.push(
        <Text key={`highlight-${keyIndex}`} style={[styles.baseText, style, highlightStyle]}>
          {matchText}
        </Text>
      );

      lastIndex = matchIndex + matchText.length;
      keyIndex++;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.substring(lastIndex);
      elements.push(
        <Text key={`remaining-${keyIndex}`} style={[styles.baseText, style]}>
          {remainingText}
        </Text>
      );
    }

    return elements.length > 0 ? elements : [
      <Text key="fallback" style={[styles.baseText, style]}>{text}</Text>
    ];
  };

  return (
    <Text style={[styles.container, style]}>
      {renderHighlightedText(children)}
    </Text>
  );
}

function getHighlightStyle(type: 'technical' | 'emphasis' | 'entities' | 'symbols', glowColor: string): TextStyle {
  const baseGlow = {
    textShadowColor: glowColor,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  };

  switch (type) {
    case 'technical':
      return {
        color: COLORS.cyan,
        fontWeight: '700',
        fontFamily: 'monospace',
        letterSpacing: 0.5,
        ...baseGlow,
        textShadowColor: COLORS.cyanGlow,
      };
    case 'emphasis':
      return {
        color: COLORS.secondary,
        fontWeight: '900',
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        ...baseGlow,
        textShadowColor: COLORS.secondaryGlow,
        textShadowRadius: 10,
      };
    case 'entities':
      return {
        color: COLORS.primary,
        fontWeight: '800',
        letterSpacing: 1,
        ...baseGlow,
        textShadowColor: COLORS.primaryGlow,
        textShadowRadius: 8,
      };
    case 'symbols':
      return {
        color: COLORS.gold,
        fontWeight: '600',
        fontSize: 18,
        ...baseGlow,
        textShadowColor: COLORS.goldGlow,
        textShadowRadius: 12,
      };
    default:
      // This case should ideally not be reached if 'type' is strictly typed
      // but providing a fallback is good practice or a specific error handling
      return baseGlow; 
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  baseText: {
    color: COLORS.text,
    ...TYPOGRAPHY.body,
  },
});
