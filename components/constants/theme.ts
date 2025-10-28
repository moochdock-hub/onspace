import { Platform } from 'react-native';

export const COLORS = {
  background: '#0A0A0A',
  primary: '#00FF41',
  primaryGlow: '#00FF41',
  secondary: '#FFD700',
  secondaryGlow: '#FFD700',
  text: '#B0B0B0',
  textBright: '#FFFFFF',
  textDim: '#808080',
  borders: '#1A1A1A',
  error: '#FF3333',
  errorGlow: '#FF3333',
  
  // High-tech accent colors
  cyan: '#00FFFF',
  cyanGlow: '#00FFFF',
  purple: '#9D4EDD',
  purpleGlow: '#9D4EDD',
  orange: '#FF8500',
  orangeGlow: '#FF8500',
  blue: '#0066FF',
  blueGlow: '#0066FF',
  red: '#FF0040',
  redGlow: '#FF0040',
  teal: '#00FFAA',
  tealGlow: '#00FFAA',
  gold: '#FFD700',
  goldGlow: '#FFD700',
};

export const TYPOGRAPHY = {
  // Main headers
  h1: {
    fontSize: 28,
    fontWeight: '900' as const,
    letterSpacing: 2,
    textTransform: 'uppercase' as const,
  },
  h2: {
    fontSize: 22,
    fontWeight: '800' as const,
    letterSpacing: 1.5,
    textTransform: 'uppercase' as const,
  },
  h3: {
    fontSize: 18,
    fontWeight: '700' as const,
    letterSpacing: 1,
    textTransform: 'uppercase' as const,
  },
  
  // Body text
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 26,
  },
  
  // Technical/monospace
  mono: {
    fontSize: 14,
    fontFamily: Platform.select({
      ios: 'Courier New',
      android: 'monospace',
      default: 'monospace'
    }),
    fontWeight: '500' as const,
    letterSpacing: 0.5,
  },
  monoLarge: {
    fontSize: 16,
    fontFamily: Platform.select({
      ios: 'Courier New',
      android: 'monospace',
      default: 'monospace'
    }),
    fontWeight: '600' as const,
    letterSpacing: 0.8,
  },
  
  // Special effects
  glow: {
    textShadowColor: '#00FF41',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  glowStrong: {
    textShadowColor: '#00FF41',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
};

export const SECTION_THEMES = {
  blue: {
    color: '#0066FF',
    glow: '#0066FF',
    gradient: ['#0066FF', '#0044CC'],
  },
  red: {
    color: '#FF0040',
    glow: '#FF0040',
    gradient: ['#FF0040', '#CC0030'],
  },
  green: {
    color: '#00FF41',
    glow: '#00FF41',
    gradient: ['#00FF41', '#00CC33'],
  },
  purple: {
    color: '#9D4EDD',
    glow: '#9D4EDD',
    gradient: ['#9D4EDD', '#7B2CBF'],
  },
  orange: {
    color: '#FF8500',
    glow: '#FF8500',
    gradient: ['#FF8500', '#E55100'],
  },
  teal: {
    color: '#00FFAA',
    glow: '#00FFAA',
    gradient: ['#00FFAA', '#00CC88'],
  },
  gold: {
    color: '#FFD700',
    glow: '#FFD700',
    gradient: ['#FFD700', '#FFA000'],
  },
};

export const TECH_SYMBOLS = {
  scan: '⚡',
  process: '⟨⟩',
  analyze: '◈',
  reform: '⦿',
  broadcast: '📡',
  filter: '🎧',
  topology: '🗺️',
  axiom: '⚆',
  protocol: '⟐',
  cascade: '⟶',
  matrix: '▣',
  node: '●',
  link: '⟷',
  pulse: '◊',
  signal: '〜',
  wave: '∿',
  field: '⧨',
  quantum: '⊕',
  neural: '⧬',
  cyber: '⟪⟫',
  digital: '⟨⟩',
  binary: '⟦⟧',
};

export const HIGHLIGHT_PATTERNS = {
  technical: /\b(axiom|protocol|topology|resonance|cascade|matrix|neural|quantum|digital|binary|cyber|systemic|formative|coherent|harmonic|structural|informational|architectural)\b/gi,
  emphasis: /\b(CRITICAL|URGENT|WARNING|ERROR|SUCCESS|COMPLETE|ACTIVE|DETECTED|OVERRIDE|REFORMATION|SYNTHESIS|BROADCASTING|FILTERING)\b/gi,
  entities: /\b(EGO AUDITOR|SYSTEM|PROTOCOL|ANALYSIS|ENGINE|FRAMEWORK|ARCHITECTURE|BLUEPRINT)\b/gi,
  symbols: /(→|⚡|◈|⦿|📡|🎧|🗺️|⟨⟩|⟐|⟶|▣|●|⟷|◊|〜|∿|⧨|⊕|⧬|⟪⟫|⟦⟧)/g,
};

// Legacy support
export const Colors = {
  background: COLORS.background,
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  text: COLORS.text,
  textBright: COLORS.textBright,
  borders: COLORS.borders,
  error: COLORS.error,
  blue: COLORS.blue,
  red: COLORS.red,
  green: COLORS.primary,
  purple: COLORS.purple,
  orange: COLORS.orange,
  teal: COLORS.teal,
  gold: COLORS.gold,
};

export const Fonts = {
  regular: 'System',
  mono: Platform.select({
    ios: 'Courier New',
    android: 'monospace',
    default: 'monospace'
  }),
  sizes: {
    small: 12,
    regular: 14,
    medium: 16,
    large: 18,
    xlarge: 24,
    xxlarge: 32
  }
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};