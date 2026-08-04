import AsyncStorage from '@react-native-async-storage/async-storage';
import { getLocales } from 'expo-localization';
import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import {
  translate,
  type AppLanguage,
  type TranslationKey,
  type TranslationParams,
} from '../i18n/translations';

export type { AppLanguage };

type LanguageContextValue = {
  language: AppLanguage;
  setLanguage: (language: AppLanguage) => void;
  t: (
    key: TranslationKey,
    params?: TranslationParams,
  ) => string;
};

const LANGUAGE_STORAGE_KEY = 'poti.language';
const supportedLanguages: AppLanguage[] = [
  'ko',
  'en',
  'de',
];

function getDeviceLanguage(): AppLanguage {
  const deviceLanguage =
    getLocales()[0]?.languageCode;

  if (deviceLanguage === 'ko') {
    return 'ko';
  }

  if (deviceLanguage === 'de') {
    return 'de';
  }

  return 'en';
}

const LanguageContext =
  createContext<LanguageContextValue | null>(
    null,
  );

export function LanguageProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [language, setLanguageState] =
    useState<AppLanguage>(getDeviceLanguage);

  useEffect(() => {
    async function restoreLanguage() {
      const savedLanguage =
        await AsyncStorage.getItem(
          LANGUAGE_STORAGE_KEY,
        );

      if (
        supportedLanguages.includes(
          savedLanguage as AppLanguage,
        )
      ) {
        setLanguageState(
          savedLanguage as AppLanguage,
        );
      }
    }

    void restoreLanguage();
  }, []);

  const setLanguage = (
    nextLanguage: AppLanguage,
  ) => {
    setLanguageState(nextLanguage);
    void AsyncStorage.setItem(
      LANGUAGE_STORAGE_KEY,
      nextLanguage,
    );
  };

  const t = useCallback(
    (
      key: TranslationKey,
      params?: TranslationParams,
    ) => translate(language, key, params),
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
    }),
    [language, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(
      'useLanguage must be used inside LanguageProvider.',
    );
  }

  return context;
}
