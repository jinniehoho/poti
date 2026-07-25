export const colors = {
  background: '#F6F6EF',
  surface: '#FFFDF8',
  surfaceWarm: '#F3EDE3',

  textPrimary: '#263125',
  textSecondary: '#747B70',
  textMuted: '#999D94',

  primary: '#5C6B57',
  primarySoft: '#A9B79B',

  statusNormal: '#7DA27D',
  statusToday: '#E8B85C',
  statusOverdue: '#C96755',

  border: '#DED8CC',
  white: '#FFFFFF',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  card: 20,
  pill: 999,
} as const;

export const fontSize = {
  caption: 12,
  bodySmall: 14,
  body: 16,
  sectionTitle: 19,
  title: 28,
  hero: 32,
} as const;

export const shadows = {
  card: {
    shadowColor: '#3A4037',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
} as const;
