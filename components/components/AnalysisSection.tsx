
import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { ChevronDown, ChevronRight, Copy } from 'lucide-react-native';
import { Colors, Spacing, COLORS, SECTION_THEMES, TECH_SYMBOLS } from '../constants/theme';
import HighlightedText from './HighlightedText';
import TechHeader from './TechHeader';
import * as Clipboard from 'expo-clipboard';

interface AnalysisSectionProps {
  title: string;
  content: string[];
  theme: 'blue' | 'red' | 'green' | 'purple' | 'orange' | 'teal' | 'gold';
  defaultCollapsed?: boolean;
}

export function AnalysisSection({ 
  title, 
  content, 
  theme, 
  defaultCollapsed = false 
}: AnalysisSectionProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed);
  const [glowEffect, setGlowEffect] = useState(false);
  const themeData = SECTION_THEMES[theme];

  const copyToClipboard = async () => {
    const textToCopy = `${title.toUpperCase()}\n\n${content.join('\n')}`;
    await Clipboard.setStringAsync(textToCopy);
  };

  const handlePress = () => {
    setGlowEffect(true);
    setTimeout(() => setGlowEffect(false), 200);
    setCollapsed(!collapsed);
  };

  const getSectionSymbol = (): keyof typeof TECH_SYMBOLS => {
    switch (title.toLowerCase()) {
      case 'signal scan':
      case 'systemic topology re-sequencing':
        return 'scan';
      case 'mirror reflection':
      case 'causal echo filtering':
        return 'filter';
      case 'audit findings':
      case 'structural reconfiguration':
        return 'analyze';
      case 'cognitive blueprint':
      case 'systemic blueprint':
        return 'topology';
      case 'remedy path':
      case 'axiomatic resonance broadcasting':
        return 'broadcast';
      case 'check':
      case 'integrity validation':
        return 'protocol';
      case 'your move':
      case 'formative directive':
        return 'reform';
      default:
        return 'matrix';
    }
  };

  return (
    <View style={[
      styles.container, 
      { borderColor: themeData.color },
      glowEffect && {
        borderColor: themeData.glow,
        shadowColor: themeData.glow,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.8,
        shadowRadius: 15,
        elevation: 15,
      }
    ]}>
      <TouchableOpacity 
        onPress={handlePress}
        style={styles.header}
        activeOpacity={0.7}
      >
        <View style={styles.headerContent}>
          <View style={[styles.symbolContainer, { borderColor: themeData.color }]}>
            <Text style={[styles.symbol, { color: themeData.color, textShadowColor: themeData.glow }]}>
              {TECH_SYMBOLS[getSectionSymbol()]}
            </Text>
          </View>
          
          <View style={styles.titleContainer}>
            <HighlightedText 
              style={[styles.title, { color: themeData.color, textShadowColor: themeData.glow }]}
              glowColor={themeData.color}
            >
              {title}
            </HighlightedText>
            
            <Text style={[styles.subtitle, { color: COLORS.textDim }]}>
              {content.length} data points {collapsed ? '▼' : '▲'}
            </Text>
          </View>
        </View>
        
        <TouchableOpacity 
          onPress={copyToClipboard}
          style={styles.copyButton}
        >
          <Copy size={14} color={Colors.text} />
        </TouchableOpacity>
      </TouchableOpacity>

      {!collapsed && (
        <View style={styles.content}>
          {content.map((item, index) => (
            <View key={index} style={styles.contentItem}>
              <View style={[styles.bulletContainer, { borderColor: themeData.color }]}>
                <Text style={[styles.bullet, { color: themeData.color, textShadowColor: themeData.glow }]}>
                  ◊
                </Text>
              </View>
              
              <View style={styles.textContainer}>
                <HighlightedText 
                  style={[
                    styles.contentText,
                    index === 0 && styles.firstItem,
                  ]}
                  glowColor={themeData.color}
                >
                  {item}
                </HighlightedText>
              </View>
            </View>
          ))}
          
          <View style={[styles.bottomScanLine, { backgroundColor: themeData.color }]} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  symbolContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  symbol: {
    fontSize: 16,
    fontWeight: '900',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 2,
    opacity: 0.7,
  },
  copyButton: {
    padding: 8,
  },
  content: {
    padding: 16,
    paddingTop: 20,
  },
  contentItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  bulletContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bullet: {
    fontSize: 10,
    fontWeight: '900',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  textContainer: {
    flex: 1,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.text,
  },
  firstItem: {
    color: COLORS.textBright,
    fontWeight: '600',
  },
  bottomScanLine: {
    height: 1,
    width: '100%',
    marginTop: 8,
    opacity: 0.4,
  },
});
