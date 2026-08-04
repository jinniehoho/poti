import {
  colors,
  fontFamily,
  fontSize,
  fontWeight,
  layout,
  radius,
  shadows,
  spacing,
} from '../constants/theme';

export type ThemeName =
  | 'forest'
  | 'cream'
  | 'terracotta'
  | 'darkNight'
  | 'pastelGarden';

export type ThemePreference =
  | 'system'
  | ThemeName;

export type ThemeColors = {
  [Key in keyof typeof colors]: string;
};

export type AppTheme = {
  name: ThemeName;
  label: string;
  isDark: boolean;
  colors: ThemeColors;
  spacing: typeof spacing;
  radius: typeof radius;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
  fontFamily: typeof fontFamily;
  shadows: typeof shadows;
  layout: typeof layout;
};

const sharedTokens = {
  spacing,
  radius,
  fontSize,
  fontWeight,
  fontFamily,
  shadows,
  layout,
};

export const forestTheme: AppTheme = {
  name: 'forest',
  label: 'Forest',
  isDark: false,
  colors: {
    ...colors,
  },
  ...sharedTokens,
};

export const creamTheme: AppTheme = {
  name: 'cream',
  label: 'Cream',
  isDark: false,
  colors: {
    background: '#F4F1EA',

    surface: '#E6DACA',
    surfaceElevated: '#FAF8F3',
    surfaceWarm: '#CBB9A4',
    surfaceSoft: '#D8C9B5',

    textPrimary: '#332D28',
    textSecondary: '#62584F',
    textMuted: '#8B8178',
    textInverse: '#FAF8F3',

    primary: '#806C5B',
    primaryPressed: '#6A594B',
    primarySoft: '#B6A18C',
    primaryFaint: '#DED2C2',
    primaryMuted: '#C8B7A3',
    plantAccent: '#7D806B',
    waterDue: '#D9E3E4',
    waterDone: '#8FA8AD',
    activityDay: '#DDE0CF',
    todayBorder: '#806C5B',
    calendarCell: '#F0E9DE',
    completionSurface: '#D5E1DF',

    statusNormal: '#727A62',
    statusToday: '#97834F',
    statusOverdue: '#7B5E52',

    success: '#6F7B63',
    warning: '#97834F',
    danger: '#795B50',
    dangerSoft: '#E7DDD4',

    border: '#B7A896',
    borderStrong: '#968574',
    divider: '#D4C8B8',

    white: '#FAF8F3',
    transparent: 'transparent',
    overlay: 'rgba(51, 45, 40, 0.42)',
  },
  ...sharedTokens,
};

export const terracottaTheme: AppTheme = {
  name: 'terracotta',
  label: 'Terracotta',
  isDark: false,
  colors: {
    background: '#F4ECE3',

    surface: '#FCF7F0',
    surfaceElevated: '#FFF9F3',
    surfaceWarm: '#D8B39B',
    surfaceSoft: '#F0DDD1',

    textPrimary: '#4C362D',
    textSecondary: '#745B50',
    textMuted: '#9A857A',
    textInverse: '#FFF8F1',

    primary: '#A46447',
    primaryPressed: '#874A37',
    primarySoft: '#C98F74',
    primaryFaint: '#F1D8CB',
    primaryMuted: '#DDB6A4',
    plantAccent: '#88937B',
    waterDue: '#DFE8EA',
    waterDone: '#8DADB5',
    activityDay: '#E1E5D7',
    todayBorder: '#A46447',
    calendarCell: '#FAF2EA',
    completionSurface: '#DBE7E5',

    statusNormal: '#7D8A70',
    statusToday: '#BD834A',
    statusOverdue: '#A45143',

    success: '#6F8268',
    warning: '#B77A3D',
    danger: '#9D473C',
    dangerSoft: '#F1D7D1',

    border: '#E0CFC3',
    borderStrong: '#B99D8C',
    divider: '#EFE2D8',

    white: '#FFF9F3',
    transparent: 'transparent',
    overlay: 'rgba(76, 54, 45, 0.42)',
  },
  ...sharedTokens,
};

export const darkNightTheme: AppTheme = {
  name: 'darkNight',
  label: 'Dark Night',
  isDark: true,
  colors: {
    background: '#181B25',
    surface: '#243446',
    surfaceElevated: '#415562',
    surfaceWarm: '#344757',
    surfaceSoft: '#2D3D4D',

    textPrimary: '#F1ECE2',
    textSecondary: '#C5CFD4',
    textMuted: '#9EAAB0',
    textInverse: '#181B25',

    primary: '#C7AC6B',
    primaryPressed: '#D6BE83',
    primarySoft: '#8D805F',
    primaryFaint: '#3B4650',
    primaryMuted: '#737D77',
    plantAccent: '#A9A271',
    waterDue: '#33495A',
    waterDone: '#66869A',
    activityDay: '#465A55',
    todayBorder: '#C7AC6B',
    calendarCell: '#2B3C4E',
    completionSurface: '#38505B',

    statusNormal: '#98A786',
    statusToday: '#C7AC6B',
    statusOverdue: '#C9897E',

    success: '#92AA89',
    warning: '#C7AC6B',
    danger: '#D08C82',
    dangerSoft: '#4B3339',

    border: '#737D77',
    borderStrong: '#939C96',
    divider: '#4B5960',

    white: '#F1ECE2',
    transparent: 'transparent',
    overlay: 'rgba(10, 12, 18, 0.72)',
  },
  ...sharedTokens,
};

export const pastelGardenTheme: AppTheme = {
  name: 'pastelGarden',
  label: 'Pastel Garden',
  isDark: false,
  colors: {
    background: '#DAE9FA',
    surface: '#F7DFDF',
    surfaceElevated: '#F9E9EA',
    surfaceWarm: '#FCEFF0',
    surfaceSoft: '#EFBDBD',

    textPrimary: '#364A52',
    textSecondary: '#5E7076',
    textMuted: '#839498',
    textInverse: '#243C3E',

    primary: '#76B8AA',
    primaryPressed: '#609F92',
    primarySoft: '#BDE7DA',
    primaryFaint: '#F7DFDF',
    primaryMuted: '#ABC9C3',
    plantAccent: '#D69FA8',
    waterDue: '#CBE3EE',
    waterDone: '#8FC1D5',
    activityDay: '#BDE7DA',
    todayBorder: '#77B9AA',
    calendarCell: '#F8C9B8',
    completionSurface: '#D9ECE7',

    statusNormal: '#6F9B83',
    statusToday: '#B78958',
    statusOverdue: '#A96972',

    success: '#6F9B83',
    warning: '#B78958',
    danger: '#A96972',
    dangerSoft: '#F5D6D9',

    border: '#B8CAC8',
    borderStrong: '#8EAAA8',
    divider: '#D6E2E0',

    white: '#FCF8F7',
    transparent: 'transparent',
    overlay: 'rgba(54, 74, 82, 0.32)',
  },
  ...sharedTokens,
};

export const themeRegistry: Record<
  ThemeName,
  AppTheme
> = {
  forest: forestTheme,
  cream: creamTheme,
  terracotta: terracottaTheme,
  darkNight: darkNightTheme,
  pastelGarden: pastelGardenTheme,
};

export const defaultThemeName: ThemeName =
  'forest';

export const defaultThemePreference: ThemePreference =
  'system';
