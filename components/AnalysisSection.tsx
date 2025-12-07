import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown, ChevronRight, Copy } from 'lucide-react-native';
import { TerminalText } from './TerminalText';
import { Colors, Spacing } from '../constants/theme';
import * as Clipboard from 'expo-clipboard';
import { colorCycleText } from '../utils/colorCycler';

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
  const themeColor = Colors[theme];

  const copyToClipboard = async () => {
    const textToCopy = `${title.toUpperCase()}\n\n${content.join('\n')}`;
    await Clipboard.setStringAsync(textToCopy);
  };

  return (
    <View style={[styles.container, { borderLeftColor: themeColor }]}>
      <TouchableOpacity 
        style={styles.header}
        onPress={() => setCollapsed(!collapsed)}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          {collapsed ? (
            <ChevronRight size={16} color={themeColor} />
          ) : (
            <ChevronDown size={16} color={themeColor} />
          )}
          <TerminalText 
            variant="header" 
            color={theme}
            style={styles.title}
          >
            {title}
          </TerminalText>
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
          {content.map((item, index) => {
            const segments = useMemo(() => colorCycleText(item), [item]);
            return (
              <View key={index} style={styles.contentItem}>
                {item.startsWith('→') || item.startsWith('⚠️') ? (
                  <View style={styles.bulletLine}>
                    {segments.map((segment, segIndex) => (
                      <TerminalText 
                        key={segIndex} 
                        variant="mono" 
                        style={[styles.bulletPoint, { color: segment.color }]}
                      >
                        {segment.text}{segIndex < segments.length - 1 ? ' ' : ''}
                      </TerminalText>
                    ))}
                  </View>
                ) : (
                  <View style={styles.paragraphLine}>
                    {segments.map((segment, segIndex) => (
                      <TerminalText 
                        key={segIndex} 
                        style={[styles.paragraph, { color: segment.color }]}
                      >
                        {segment.text}{segIndex < segments.length - 1 ? ' ' : ''}
                      </TerminalText>
                    ))}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderLeftWidth: 3,
    borderRadius: 4,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borders,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    marginLeft: Spacing.sm,
  },
  copyButton: {
    padding: Spacing.xs,
  },
  content: {
    padding: Spacing.md,
  },
  contentItem: {
    marginBottom: Spacing.sm,
  },
  bulletLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  paragraphLine: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  bulletPoint: {
    fontSize: 16,
    lineHeight: 22,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: Spacing.xs,
  },
});