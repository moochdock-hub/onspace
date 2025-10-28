import { Platform } from 'react-native';

export const Colors = {
  background: '#0A0A0A',
  primary: '#00FF41',
  secondary: '#FFD700',
  text: '#B0B0B0',
  textBright: '#FFFFFF',
  borders: '#1A1A1A',
  error: '#FF3333',
  
  // Section themes
  blue: '#4A9EFF',
  red: '#FF4A4A',
  green: '#00FF41',
  purple: '#B347FF',
  orange: '#FF8C47',
  teal: '#47FFD7',
  gold: '#FFD700',
  
  // Enhanced colors for visual effects
  primaryGlow: 'rgba(0, 255, 65, 0.2)',
  secondaryGlow: 'rgba(255, 215, 0, 0.2)',
  shadowDark: 'rgba(0, 0, 0, 0.5)',
  borderLight: 'rgba(255, 255, 255, 0.1)',
  borderMedium: 'rgba(255, 255, 255, 0.2)',
  backgroundElevated: '#111111',
  backgroundCard: '#0F0F0F',
  
  // Glow colors for each theme
  blueGlow: 'rgba(74, 158, 255, 0.3)',
  redGlow: 'rgba(255, 74, 74, 0.3)',
  greenGlow: 'rgba(0, 255, 65, 0.3)',
  purpleGlow: 'rgba(179, 71, 255, 0.3)',
  orangeGlow: 'rgba(255, 140, 71, 0.3)',
  tealGlow: 'rgba(71, 255, 215, 0.3)',
  goldGlow: 'rgba(255, 215, 0, 0.3)',
};

export const Fonts = {
  regular: 'System',
  mono: Platform.select({
    ios: 'Courier New',
    android: 'monospace',
    default: 'monospace'
  }),
  sizes: {
    tiny: 10,
    small: 12,
    regular: 14,
    medium: 16,
    large: 18,
    xlarge: 24,
    xxlarge: 32,
    huge: 40
  },
  weights: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  }
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64
};

export const BorderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

export const Shadows = {
  small: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 6,
  }
};

export const Animations = {
  timing: {
    fast: 200,
    normal: 300,
    slow: 500,
  },
  easing: {
    default: 'ease-in-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  }
};
