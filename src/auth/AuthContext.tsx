import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Platform } from 'react-native';
import type {
  Session,
  User,
} from '@supabase/supabase-js';

import { supabase } from '../lib/supabase';
import { useLanguage } from '../preferences/LanguageContext';

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  isAnonymous: boolean;
  isAppleAvailable: boolean;
  isAuthLoading: boolean;
  isAppleLoading: boolean;
  authError: string | null;
  retryAnonymousSignIn: () => Promise<void>;
  connectAppleAccount: () => Promise<void>;
  restartAfterAccountDeletion: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextValue | null>(null);

function getErrorCode(error: unknown) {
  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error
  ) {
    return String(error.code);
  }

  return null;
}

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { t } = useLanguage();
  const [session, setSession] =
    useState<Session | null>(null);
  const [isAuthLoading, setIsAuthLoading] =
    useState(true);
  const [isAppleLoading, setIsAppleLoading] =
    useState(false);
  const [isAppleAvailable, setIsAppleAvailable] =
    useState(false);
  const [authError, setAuthError] =
    useState<string | null>(null);

  const createAnonymousSession = async () => {
    setIsAuthLoading(true);
    setAuthError(null);

    try {
      const {
        data,
        error,
      } = await supabase.auth.signInAnonymously();

      if (error) {
        throw error;
      }

      setSession(data.session);
    } catch (error) {
      console.error('Anonymous sign-in failed:', error);
      setAuthError(t('auth.genericError'));
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    async function initializeAuth() {
      const {
        data,
        error,
      } = await supabase.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error('Session restore failed:', error);
        setAuthError(t('auth.genericError'));
        setIsAuthLoading(false);
        return;
      }

      if (data.session) {
        setSession(data.session);
        setIsAuthLoading(false);
        return;
      }

      await createAnonymousSession();
    }

    void initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
      },
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      return;
    }

    void AppleAuthentication.isAvailableAsync()
      .then(setIsAppleAvailable)
      .catch(() => setIsAppleAvailable(false));
  }, []);

  const connectAppleAccount = async () => {
    if (
      Platform.OS !== 'ios' ||
      !isAppleAvailable ||
      isAppleLoading
    ) {
      return;
    }

    setIsAppleLoading(true);
    setAuthError(null);

    try {
      const rawNonce = Crypto.randomUUID();
      const credential =
        await AppleAuthentication.signInAsync({
          nonce: rawNonce,
          requestedScopes: [
            AppleAuthentication
              .AppleAuthenticationScope
              .FULL_NAME,
            AppleAuthentication
              .AppleAuthenticationScope
              .EMAIL,
          ],
        });

      if (!credential.identityToken) {
        throw new Error(
          'APPLE_IDENTITY_TOKEN_MISSING',
        );
      }

      const credentials = {
        provider: 'apple' as const,
        token: credential.identityToken,
        nonce: rawNonce,
      };

      const { error } = session?.user.is_anonymous
        ? await supabase.auth.linkIdentity(
            credentials,
          )
        : await supabase.auth.signInWithIdToken(
            credentials,
          );

      if (error) {
        throw error;
      }

      const fullName = [
        credential.fullName?.givenName,
        credential.fullName?.middleName,
        credential.fullName?.familyName,
      ]
        .filter(Boolean)
        .join(' ');

      if (fullName) {
        await supabase.auth.updateUser({
          data: {
            full_name: fullName,
            given_name:
              credential.fullName?.givenName,
            family_name:
              credential.fullName?.familyName,
          },
        });
      }
    } catch (error) {
      if (
        getErrorCode(error) !==
        'ERR_REQUEST_CANCELED'
      ) {
        console.error('Apple sign-in failed:', error);
        setAuthError(t('auth.genericError'));
      }
    } finally {
      setIsAppleLoading(false);
    }
  };

  const restartAfterAccountDeletion = async () => {
    setIsAuthLoading(true);
    setAuthError(null);

    try {
      await supabase.auth.signOut({ scope: 'local' });
      await AsyncStorage.clear();

      const { data, error } =
        await supabase.auth.signInAnonymously();

      if (error) {
        throw error;
      }

      setSession(data.session);
    } catch (error) {
      console.error(
        'Fresh anonymous session failed after account deletion:',
        error,
      );
      setSession(null);
      setAuthError(t('auth.genericError'));
      throw error;
    } finally {
      setIsAuthLoading(false);
    }
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAnonymous:
        session?.user.is_anonymous ?? true,
      isAppleAvailable,
      isAuthLoading,
      isAppleLoading,
      authError,
      retryAnonymousSignIn:
        createAnonymousSession,
      connectAppleAccount,
      restartAfterAccountDeletion,
    }),
    [
      session,
      isAppleAvailable,
      isAuthLoading,
      isAppleLoading,
      authError,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider.',
    );
  }

  return context;
}
