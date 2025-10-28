
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { COLORS, TYPOGRAPHY, TECH_SYMBOLS } from '../constants/theme';
import HighlightedText from './HighlightedText';

interface TechHeaderProps {
  title: string;
  subtitle?: string;
  symbol?: keyof typeof TECH_SYMBOLS;
  glowColor?: string;
  level?: 1 | 2 | 3;
}

export default function TechHeader({ 
  title, 
  subtitle, 
  symbol, 
  glowColor = COLORS.primary,
  level = 1 
}: TechHeaderProps) {
  const headerStyle = level === 1 ? styles.h1 : level === 2 ? styles.h2 : styles.h3;
  const symbolChar = symbol ? TECH_SYMBOLS[symbol] : '◈';

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={[styles.symbolContainer, { borderColor: glowColor }]}>
          <Text style={[styles.symbol, { color: glowColor, textShadowColor: glowColor }]}>
            {symbolChar}
          </Text>
        </View>
        
        <View style={styles.textContainer}>
          <HighlightedText 
            style={[headerStyle, { color: glowColor, textShadowColor: glowColor }]}
            glowColor={glowColor}
          >
            {title}
          </HighlightedText>
          
          {subtitle && (
            <HighlightedText 
              style={[styles.subtitle, { color: COLORS.textDim }]}
              glowColor={glowColor}
            >
              {subtitle}
            </HighlightedText>
          )}
        </View>
      </View>
      
      <View style={[styles.scanLine, { backgroundColor: glowColor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  symbolContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(0, 255, 65, 0.05)',
  },
  symbol: {
    fontSize: 20,
    fontWeight: '900',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  textContainer: {
    flex: 1,
  },
  h1: {
    ...TYPOGRAPHY.h1,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  h2: {
    ...TYPOGRAPHY.h2,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  h3: {
    ...TYPOGRAPHY.h3,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    ...TYPOGRAPHY.mono,
    marginTop: 4,
    opacity: 0.7,
  },
  scanLine: {
    height: 2,
    width: '100%',
    opacity: 0.6,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
});
