import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { ONBOARDING_STORAGE_KEY } from './content';

type OnboardingContextValue = {
  isOnboardingLoading: boolean;
  onboardingCompleted: boolean;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
};

const OnboardingContext =
  createContext<OnboardingContextValue | null>(
    null,
  );

export function OnboardingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [
    isOnboardingLoading,
    setIsOnboardingLoading,
  ] = useState(true);
  const [
    onboardingCompleted,
    setOnboardingCompleted,
  ] = useState(false);

  useEffect(() => {
    async function restoreOnboarding() {
      try {
        const savedValue =
          await AsyncStorage.getItem(
            ONBOARDING_STORAGE_KEY,
          );

        setOnboardingCompleted(
          savedValue === 'true',
        );
      } finally {
        setIsOnboardingLoading(false);
      }
    }

    void restoreOnboarding();
  }, []);

  const completeOnboarding = useCallback(
    async () => {
      await AsyncStorage.setItem(
        ONBOARDING_STORAGE_KEY,
        'true',
      );
      setOnboardingCompleted(true);
    },
    [],
  );

  const resetOnboarding = useCallback(async () => {
    await AsyncStorage.removeItem(
      ONBOARDING_STORAGE_KEY,
    );
    setOnboardingCompleted(false);
  }, []);

  const value = useMemo(
    () => ({
      isOnboardingLoading,
      onboardingCompleted,
      completeOnboarding,
      resetOnboarding,
    }),
    [
      completeOnboarding,
      isOnboardingLoading,
      onboardingCompleted,
      resetOnboarding,
    ],
  );

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error(
      'useOnboarding must be used inside OnboardingProvider.',
    );
  }

  return context;
}

