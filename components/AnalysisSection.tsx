import React, { useState, useMemo } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Markdown from 'react-native-markdown-display';
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
            const renderColorizedText = () => (
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
            );

            return (
              <View key={index} style={styles.contentItem}>
                {item.startsWith('→') || item.startsWith('⚠️') ? (
                  <View style={styles.bulletLine}>{renderColorizedText()}</View>
                ) : (
                  <Markdown
                    style={markdownStyles}
                    rules={{
                      paragraph: (node) => {
                        const children = (node.children || []) as any[];
                        const extract = (n: any): string => {
                          if (!n) return '';
                          if (typeof n.content === 'string') return n.content;
                          if (Array.isArray(n.children)) return n.children.map((c: any) => extract(c)).join(' ');
                          return '';
                        };
                        return (
                          <View style={styles.paragraphLine}>
                            {children.flatMap((child, idx) => {
                              const isStrong = child.type === 'strong';
                              const text = extract(child);
                              const segs = colorCycleText(text);
                              return segs.map((seg, i) => (
                                <TerminalText
                                  key={`${idx}-${i}`}
                                  style={[styles.paragraph, isStrong && { fontWeight: '700' }, { color: seg.color }]}
                                >
                                  {seg.text}{i < segs.length - 1 ? ' ' : ''}
                                </TerminalText>
                              ));
                            })}
                          </View>
                        );
                      },
                      list_item: (node) => {
                        const children = (node.children || []) as any[];
                        const extract = (n: any): string => {
                          if (!n) return '';
                          if (typeof n.content === 'string') return n.content;
                          if (Array.isArray(n.children)) return n.children.map((c: any) => extract(c)).join(' ');
                          return '';
                        };
                        return (
                          <View style={styles.paragraphLine}>
                            <TerminalText style={[styles.paragraph, { color: Colors.text }]}>{'• '}</TerminalText>
                            {children.flatMap((child, idx) => {
                              const isStrong = child.type === 'strong';
                              const text = extract(child);
                              const segs = colorCycleText(text);
                              return segs.map((seg, i) => (
                                <TerminalText
                                  key={`${idx}-${i}`}
                                  style={[styles.paragraph, isStrong && { fontWeight: '700' }, { color: seg.color }]}
                                >
                                  {seg.text}{i < segs.length - 1 ? ' ' : ''}
                                </TerminalText>
                              ));
                            })}
                          </View>
                        );
                      },
                    }}
                  >
                    {item}
                  </Markdown>
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

const markdownStyles = {
  body: {
    color: Colors.text,
  },
  paragraph: {
    color: Colors.text,
  },
  heading1: {
    color: Colors.text,
  },
  heading2: {
    color: Colors.text,
  },
  list_item: {
    color: Colors.text,
  },
  bullet_list: {
    color: Colors.text,
  },
  ordered_list: {
    color: Colors.text,
  },
  strong: {
    color: Colors.text,
    fontWeight: '700' as const,
  },
};