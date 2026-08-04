import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PlantProvider } from '../context/PlantContext';
import { ProfileProvider } from '../profile/ProfileContext';
import { AuthBoundary } from '../auth/AuthBoundary';
import { AuthProvider } from '../auth/AuthContext';
import { LanguageProvider } from '../preferences/LanguageContext';
import {
  OnboardingProvider,
  useOnboarding,
} from '../onboarding/OnboardingContext';
import { requestNotificationPermission } from '../services/notificationService';
import {
  ThemeProvider,
  useTheme,
} from '../theme/ThemeContext';

void SplashScreen.preventAutoHideAsync();

function ThemedStack() {
  const { theme } = useTheme();

  return (
    <>
      <StatusBar
        style={theme.isDark ? 'light' : 'dark'}
      />
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
}

function AppEntry() {
  const { isOnboardingLoading } =
    useOnboarding();

  if (isOnboardingLoading) {
    return null;
  }

  return (
    <AuthBoundary>
      <ProfileProvider>
        <PlantProvider>
          <ThemedStack />
        </PlantProvider>
      </ProfileProvider>
    </AuthBoundary>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Paperlogy: require('../../assets/fonts/Paperlogy.ttf'),
    'Paperlogy-Regular': require('../../assets/fonts/Paperlogy-Regular.ttf'),
    'Paperlogy-Medium': require('../../assets/fonts/Paperlogy-Medium.ttf'),
    'Paperlogy-SemiBold': require('../../assets/fonts/Paperlogy-SemiBold.ttf'),
    'Paperlogy-Bold': require('../../assets/fonts/Paperlogy-Bold.ttf'),
  });

  useEffect(() => {
    async function setupNotifications() {
      const granted =
        await requestNotificationPermission();

      console.log(
        '알림 권한:',
        granted ? '허용' : '거부',
      );
    }

    void setupNotifications();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      void SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (fontError) {
    throw fontError;
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LanguageProvider>
          <OnboardingProvider>
            <AuthProvider>
              <AppEntry />
            </AuthProvider>
          </OnboardingProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
