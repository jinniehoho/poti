export const colors = {
  // 화면 배경
  background: '#F3F3EA',

  // 카드·입력창 등 표면
  surface: '#FBFAF4',
  surfaceElevated: '#FDFCF8',
  surfaceWarm: '#E3E6D8',
  surfaceSoft: '#EDF0E6',

  // 글자
  textPrimary: '#293229',
  textSecondary: '#5F695E',
  textMuted: '#8A9186',
  textInverse: '#F8F7F0',

  // 브랜드 핵심 색상
  primary: '#3F5A48',
  primaryPressed: '#32483A',
  primarySoft: '#98A68F',
  primaryFaint: '#DDE5D7',
  primaryMuted: '#BEC9B7',
  plantAccent: '#768B6F',
  waterDue: '#DCE8EB',
  waterDone: '#8FB3BC',
  activityDay: '#D9E5D3',
  todayBorder: '#4C6653',
  calendarCell: '#F8F8F1',
  completionSurface: '#D7E7E5',

  // 상태 색상
  statusNormal: '#668162',
  statusToday: '#B88C43',
  statusOverdue: '#A65E52',

  // 공통 피드백 색상
  success: '#5F7B5C',
  warning: '#B1803E',
  danger: '#99564C',
  dangerSoft: '#F1DEDA',

  // 선·구분선
  border: '#D8D9CE',
  borderStrong: '#A9B1A2',
  divider: '#E9EAE2',

  white: '#FDFCF8',
  transparent: 'transparent',
  overlay: 'rgba(41, 50, 41, 0.42)',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  screenTop: 56,
  screenHorizontal: 22,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  card: 20,
  largeCard: 28,
  circle: 999,
  pill: 999,
} as const;

export const fontSize = {
  caption: 12,
  bodySmall: 14,
  body: 16,
  subtitle: 17,
  sectionTitle: 19,
  cardTitle: 20,
  title: 28,
  hero: 32,
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extraBold: '800',
  black: '900',
} as const;

export const fontFamily = {
  brand: 'Paperlogy',
  regular: 'Paperlogy-Regular',
  medium: 'Paperlogy-Medium',
  semiBold: 'Paperlogy-SemiBold',
  bold: 'Paperlogy-Bold',
} as const;

export const shadows = {
  card: {
    shadowColor: '#3A4037',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },

  floating: {
    shadowColor: '#263125',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 5,
  },
} as const;

export const layout = {
  contentMaxWidth: 560,
} as const;
