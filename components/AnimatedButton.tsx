import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, BorderRadius, Shadows } from '../constants/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface AnimatedButtonProps {
  onPress: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  glowColor?: string;
  haptics?: boolean;
}

export function AnimatedButton({
  onPress,
  disabled = false,
  children,
  style,
  glowColor = Colors.primary,
  haptics = true,
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);
  const glowIntensity = useSharedValue(0);

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.95, { damping: 15, stiffness: 150 });
      glowIntensity.value = withTiming(1, { duration: 150 });
      if (haptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1, { damping: 15, stiffness: 150 });
      glowIntensity.value = withTiming(0, { duration: 300 });
    }
  };

  const handlePress = () => {
    if (!disabled) {
      if (haptics) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
      onPress();
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    shadowOpacity: disabled ? 0 : 0.3 + glowIntensity.value * 0.4,
  }));

  return (
    <AnimatedTouchable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.9}
      style={[
        styles.button,
        {
          shadowColor: glowColor,
          opacity: disabled ? 0.5 : 1,
        },
        style,
        animatedStyle,
      ]}
    >
      {children}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  button: {
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 12,
    elevation: 5,
  },
});
