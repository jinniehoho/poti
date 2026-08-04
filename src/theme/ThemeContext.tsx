import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

import {
  defaultThemeName,
  defaultThemePreference,
  themeRegistry,
  type AppTheme,
  type ThemeName,
  type ThemePreference,
} from './themes';

type ThemeContextValue = {
  theme: AppTheme;
  themeName: ThemeName;
  themePreference: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
};

const ThemeContext =
  createContext<ThemeContextValue | null>(
    null,
  );

const THEME_STORAGE_KEY = 'poti.theme';

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [themePreference, setThemePreference] =
    useState<ThemePreference>(
      defaultThemePreference,
    );

  useEffect(() => {
    async function restoreTheme() {
      const savedTheme = await AsyncStorage.getItem(
        THEME_STORAGE_KEY,
      );

      if (
        savedTheme &&
        (savedTheme === 'system' ||
          savedTheme in themeRegistry)
      ) {
        setThemePreference(
          savedTheme as ThemePreference,
        );
      }
    }

    void restoreTheme();
  }, []);

  const setTheme = useCallback(
    (nextTheme: ThemePreference) => {
      setThemePreference(nextTheme);
      void AsyncStorage.setItem(
        THEME_STORAGE_KEY,
        nextTheme,
      );
    },
    [],
  );

  const themeName: ThemeName =
    themePreference === 'system'
      ? systemColorScheme === 'dark'
        ? 'darkNight'
        : defaultThemeName
      : themePreference;

  const value = useMemo(
    () => ({
      theme: themeRegistry[themeName],
      themeName,
      themePreference,
      setTheme,
    }),
    [setTheme, themeName, themePreference],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used inside ThemeProvider.',
    );
  }

  return context;
}
