import React, { useEffect, useState } from 'react';
import { Text, TextStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
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
  const [displayedText, setDisplayedText] = useState(animated ? '' : children);
  const opacity = useSharedValue(animated ? 0 : 1);
  const glowOpacity = useSharedValue(0.5);

  useEffect(() => {
    if (animated && typeof children === 'string') {
      let currentIndex = 0;
      const text = children;
      
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          if (currentIndex <= text.length) {
            setDisplayedText(text.substring(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval(interval);
          }
        }, 30);
        
        return () => clearInterval(interval);
      }, delay);

      opacity.value = withTiming(1, { duration: 300 });
      
      return () => clearTimeout(timer);
    }
  }, [children, animated, delay]);

  useEffect(() => {
    if (glow) {
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.5, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }
  }, [glow]);

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      color: Colors[color],
      fontFamily: variant === 'mono' ? Fonts.mono : Fonts.regular,
    };

    if (glow) {
      baseStyle.textShadowColor = Colors[color];
      baseStyle.textShadowOffset = { width: 0, height: 0 };
      baseStyle.textShadowRadius = 8;
    }

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

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animated ? opacity.value : 1,
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow ? glowOpacity.value : 1,
  }));

  if (animated || glow) {
    return (
      <Animated.Text style={[getTextStyle(), style, animatedStyle, glowStyle]}>
        {displayedText}
      </Animated.Text>
    );
  }

  return <Text style={[getTextStyle(), style]}>{children}</Text>;
}
