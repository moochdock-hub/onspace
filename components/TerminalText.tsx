import React from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import { Colors, Fonts } from '../constants/theme';

interface TerminalTextProps {
  children: React.ReactNode;
  variant?: 'header' | 'body' | 'mono' | 'small';
  color?: keyof typeof Colors;
  style?: StyleProp<TextStyle>;
  glow?: boolean;
  animated?: boolean;
  delay?: number;
}

export function TerminalText({ 
  children, 
  variant = 'body', 
  color = 'text',
  style,
  glow = false,
  animated = false,
  delay = 0,
}: TerminalTextProps) {
  // Animations disabled globally to prevent React hydration mismatches (#418) on web
  // Always render static text without Reanimated to ensure SSR/hydration consistency

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      color: Colors[color],
      fontFamily: variant === 'mono' ? Fonts.mono : Fonts.regular,
    };

    switch (variant) {
      case 'header':
        return {
          ...baseStyle,
          fontSize: Fonts.sizes.xlarge,
          fontWeight: 'bold',
          textTransform: 'uppercase',
          letterSpacing: 2,
        };
      case 'small':
        return {
          ...baseStyle,
          fontSize: Fonts.sizes.small,
        };
      case 'mono':
        return {
          ...baseStyle,
          fontSize: Fonts.sizes.regular,
          fontFamily: Fonts.mono,
        };
      default:
        return {
          ...baseStyle,
          fontSize: Fonts.sizes.regular,
        };
    }
  };

  return <Text style={[getTextStyle(), style]}>{children}</Text>;
}
