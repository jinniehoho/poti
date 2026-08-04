import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { AppText as Text } from '@/theme/Typography';
import type { ReactNode } from 'react';

import { useTheme } from '../theme';
import { useLanguage } from '../preferences/LanguageContext';
import { useAuth } from './AuthContext';

export function AuthBoundary({
  children,
}: {
  children: ReactNode;
}) {
  const {
    user,
    isAuthLoading,
    authError,
    retryAnonymousSignIn,
  } = useAuth();
  const { t } = useLanguage();
  const { theme } = useTheme();

  if (isAuthLoading) {
    return (
      <View
        style={[
          styles.centered,
          {
            backgroundColor:
              theme.colors.background,
          },
        ]}
      >
        <ActivityIndicator
          color={theme.colors.primary}
          size="large"
        />
        <Text
          style={[
            styles.message,
            {
              color:
                theme.colors.textSecondary,
            },
          ]}
        >
          {t('auth.loading')}
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View
        style={[
          styles.centered,
          {
            backgroundColor:
              theme.colors.background,
          },
        ]}
      >
        <Text
          style={[
            styles.title,
            {
              color:
                theme.colors.textPrimary,
            },
          ]}
        >
          {t('auth.createError')}
        </Text>
        <Text
          style={[
            styles.message,
            {
              color:
                theme.colors.textSecondary,
            },
          ]}
        >
          {authError ??
            t('auth.connectionError')}
        </Text>
        <Pressable
          onPress={() => {
            void retryAnonymousSignIn();
          }}
          style={[
            styles.retryButton,
            {
              backgroundColor:
                theme.colors.primary,
            },
          ]}
        >
          <Text style={styles.retryText}>
            {t('auth.retry')}
          </Text>
        </Pressable>
      </View>
    );
  }

  return children;
}

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
    textAlign: 'center',
  },
  retryButton: {
    borderRadius: 16,
    marginTop: 22,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
