import * as AppleAuthentication from 'expo-apple-authentication';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { AppText as Text } from '@/theme/Typography';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../auth/AuthContext';
import { usePlants } from '../context/PlantContext';
import {
  ONBOARDING_COPY,
} from '../onboarding/content';
import { useOnboarding } from '../onboarding/OnboardingContext';
import {
  useLanguage,
  type AppLanguage,
} from '../preferences/LanguageContext';
import { useProfile } from '../profile/ProfileContext';
import { deleteCurrentAccount } from '../services/accountService';
import {
  themeRegistry,
  useTheme,
  type AppTheme,
  type ThemePreference,
} from '../theme';

const themeOptions: ThemePreference[] = [
  'system',
  'forest',
  'cream',
  'terracotta',
  'darkNight',
  'pastelGarden',
];

const languageOptions: {
  id: AppLanguage;
  label: string;
  description: string;
}[] = [
  {
    id: 'ko',
    label: '한국어',
    description: 'Korean',
  },
  {
    id: 'en',
    label: 'English',
    description: '영어',
  },
  {
    id: 'de',
    label: 'Deutsch',
    description: '독일어',
  },
];

export default function SettingsScreen() {
  const {
    theme,
    themePreference,
    setTheme,
  } = useTheme();
  const {
    language,
    setLanguage,
    t,
  } = useLanguage();
  const {
    user,
    isAnonymous,
    isAppleAvailable,
    isAppleLoading,
    authError,
    connectAppleAccount,
    restartAfterAccountDeletion,
  } = useAuth();
  const { setPlants } = usePlants();
  const { clearProfile } = useProfile();
  const { resetOnboarding } = useOnboarding();
  const [isDeletingAccount, setIsDeletingAccount] =
    useState(false);
  const [accountDeletionError, setAccountDeletionError] =
    useState(false);
  const insets = useSafeAreaInsets();

  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  };

  const handleReplayOnboarding = async () => {
    await resetOnboarding();
    router.replace('/');
  };

  const handlePermanentAccountDeletion = async () => {
    if (isDeletingAccount) return;

    setIsDeletingAccount(true);
    setAccountDeletionError(false);

    try {
      await deleteCurrentAccount();
      setPlants([]);
      clearProfile();
      await resetOnboarding();
      await restartAfterAccountDeletion();
      router.replace('/');
    } catch (error) {
      console.error('Account deletion failed:', error);
      setAccountDeletionError(true);
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const showFinalAccountDeletionConfirmation = () => {
    Alert.alert(
      t('settings.deleteAccount.finalTitle'),
      t('settings.deleteAccount.finalDescription'),
      [
        {
          text: t('settings.deleteAccount.cancel'),
          style: 'cancel',
        },
        {
          text: t('settings.deleteAccount.permanentAction'),
          style: 'destructive',
          onPress: () => {
            void handlePermanentAccountDeletion();
          },
        },
      ],
    );
  };

  const showAccountDeletionConfirmation = () => {
    if (isDeletingAccount) return;

    Alert.alert(
      t('settings.deleteAccount.firstTitle'),
      t('settings.deleteAccount.firstDescription'),
      [
        {
          text: t('settings.deleteAccount.cancel'),
          style: 'cancel',
        },
        {
          text: t('settings.deleteAccount.continue'),
          onPress: showFinalAccountDeletionConfirmation,
        },
      ],
    );
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop:
            insets.top + theme.spacing.sm,
        },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Pressable
          accessibilityLabel={t('settings.back')}
          accessibilityRole="button"
          hitSlop={10}
          onPress={handleBack}
          style={({ pressed }) => [
            styles.backButton,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        <Text style={styles.title}>
          {t('settings.title')}
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <Text style={styles.sectionTitle}>
        {t('settings.theme.title')}
      </Text>
      <Text style={styles.sectionDescription}>
        {t('settings.theme.description')}
      </Text>

      <View style={styles.optionGroup}>
        {themeOptions.map((option) => {
          const optionTheme =
            option === 'system'
              ? theme
              : themeRegistry[option];
          const selected =
            option === themePreference;
          const label =
            option === 'system'
              ? t('settings.theme.system')
              : option === 'forest'
                ? t('settings.theme.default')
                : option === 'cream'
                  ? t('settings.theme.cream')
                  : option === 'terracotta'
                    ? t(
                        'settings.theme.terracotta',
                      )
                    : option === 'darkNight'
                      ? t(
                          'settings.theme.darkNight',
                        )
                      : t(
                          'settings.theme.pastelGarden',
                        );
          const description =
            option === 'system'
              ? t(
                  'settings.theme.systemDescription',
                )
              : option === 'forest'
                ? t(
                    'settings.theme.defaultDescription',
                  )
                : option === 'cream'
                  ? t(
                      'settings.theme.creamDescription',
                    )
                  : option === 'terracotta'
                    ? t(
                        'settings.theme.terracottaDescription',
                      )
                    : option === 'darkNight'
                      ? t(
                          'settings.theme.darkNightDescription',
                        )
                      : t(
                          'settings.theme.pastelGardenDescription',
                        );

          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{
                checked: selected,
              }}
              key={option}
              onPress={() => setTheme(option)}
              style={({ pressed }) => [
                styles.option,
                selected && styles.optionSelected,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.swatchGroup}>
                <View
                  style={[
                    styles.themeSwatch,
                    {
                      backgroundColor:
                        optionTheme.colors
                          .background,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.themeSwatch,
                    styles.themeSwatchOverlap,
                    {
                      backgroundColor:
                        optionTheme.colors.primary,
                    },
                  ]}
                />
              </View>
              <View style={styles.optionText}>
                <Text style={styles.optionLabel}>
                  {label}
                </Text>
                <Text
                  style={styles.optionDescription}
                >
                  {description}
                </Text>
              </View>
              <Text style={styles.checkmark}>
                {selected ? '✓' : ''}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>
        {t('settings.language.title')}
      </Text>
      <Text style={styles.sectionDescription}>
        {t('settings.language.description')}
      </Text>

      <View style={styles.optionGroup}>
        {languageOptions.map((option) => {
          const selected =
            option.id === language;

          return (
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{
                checked: selected,
              }}
              key={option.id}
              onPress={() =>
                setLanguage(option.id)
              }
              style={({ pressed }) => [
                styles.option,
                selected && styles.optionSelected,
                pressed && styles.pressed,
              ]}
            >
              <View style={styles.optionText}>
                <Text style={styles.optionLabel}>
                  {option.label}
                </Text>
                <Text
                  style={styles.optionDescription}
                >
                  {option.description}
                </Text>
              </View>
              <Text style={styles.checkmark}>
                {selected ? '✓' : ''}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.languageNotice}>
        {t('settings.language.notice')}
      </Text>

      <Pressable
        accessibilityRole="button"
        onPress={() => {
          void handleReplayOnboarding();
        }}
        style={({ pressed }) => [
          styles.onboardingOption,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.optionText}>
          <Text style={styles.optionLabel}>
            {t(ONBOARDING_COPY.settingsTitle)}
          </Text>
          <Text style={styles.optionDescription}>
            {t(ONBOARDING_COPY.settingsDescription)}
          </Text>
        </View>
        <Text style={styles.onboardingArrow}>›</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>
        {t('settings.account.title')}
      </Text>
      <Text style={styles.sectionDescription}>
        {t('settings.account.description')}
      </Text>

      <View style={styles.accountCard}>
        <Text style={styles.accountStatus}>
          {isAnonymous
            ? t('settings.account.guest')
            : t('settings.account.protected')}
        </Text>
        <Text style={styles.accountId}>
          Poti ID ·{' '}
          {user?.id ??
            t('settings.account.idChecking')}
        </Text>

        {isAnonymous ? (
          <>
            <Text style={styles.accountNotice}>
              {t('settings.account.guestNotice')}
            </Text>

            {Platform.OS === 'ios' &&
            isAppleAvailable ? (
              <AppleAuthentication.AppleAuthenticationButton
                buttonStyle={
                  AppleAuthentication
                    .AppleAuthenticationButtonStyle
                    .BLACK
                }
                buttonType={
                  AppleAuthentication
                    .AppleAuthenticationButtonType
                    .CONTINUE
                }
                cornerRadius={12}
                onPress={() => {
                  void connectAppleAccount();
                }}
                style={styles.appleButton}
              />
            ) : (
              <Text style={styles.appleUnavailable}>
                {t(
                  'settings.account.appleUnavailable',
                )}
              </Text>
            )}

            {isAppleLoading && (
              <Text style={styles.accountProgress}>
                {t('settings.account.connecting')}
              </Text>
            )}
          </>
        ) : (
          <Text style={styles.accountNotice}>
            {t(
              'settings.account.protectedNotice',
            )}
          </Text>
        )}

        {authError && (
          <Text style={styles.accountError}>
            {authError}
          </Text>
        )}
      </View>

      <View style={styles.dangerZone}>
        <Text style={styles.dangerTitle}>
          {t('settings.deleteAccount.sectionTitle')}
        </Text>
        <Text style={styles.dangerDescription}>
          {t('settings.deleteAccount.sectionDescription')}
        </Text>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ disabled: isDeletingAccount }}
          disabled={isDeletingAccount}
          onPress={showAccountDeletionConfirmation}
          style={({ pressed }) => [
            styles.deleteAccountButton,
            pressed && styles.pressed,
            isDeletingAccount && styles.disabled,
          ]}
        >
          <Text style={styles.deleteAccountButtonText}>
            {isDeletingAccount
              ? t('settings.deleteAccount.deleting')
              : t('settings.deleteAccount.action')}
          </Text>
        </Pressable>

        {accountDeletionError && (
          <Text style={styles.accountError}>
            {t('settings.deleteAccount.error')}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

function createStyles(theme: AppTheme) {
  const {
    colors,
    fontSize,
    fontWeight,
    layout,
    radius,
    spacing,
  } = theme;

  return StyleSheet.create({
    screen: {
      backgroundColor: colors.background,
      flex: 1,
    },
    content: {
      alignSelf: 'center',
      maxWidth: layout.contentMaxWidth,
      paddingBottom: spacing.xxxl,
      paddingHorizontal:
        spacing.screenHorizontal,
      width: '100%',
    },
    header: {
      alignItems: 'center',
      flexDirection: 'row',
      minHeight: 48,
    },
    backButton: {
      alignItems: 'center',
      height: 44,
      justifyContent: 'center',
      width: 44,
    },
    backIcon: {
      color: colors.textPrimary,
      fontSize: 38,
      lineHeight: 40,
    },
    title: {
      color: colors.textPrimary,
      flex: 1,
      fontSize: fontSize.cardTitle,
      fontWeight: fontWeight.extraBold,
      textAlign: 'center',
    },
    headerSpacer: {
      width: 44,
    },
    sectionTitle: {
      color: colors.textPrimary,
      fontSize: fontSize.sectionTitle,
      fontWeight: fontWeight.extraBold,
      marginTop: spacing.xxl,
    },
    sectionDescription: {
      color: colors.textSecondary,
      fontSize: fontSize.bodySmall,
      marginTop: spacing.sm,
    },
    optionGroup: {
      gap: spacing.md,
      marginTop: spacing.lg,
    },
    option: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.lg,
      borderWidth: 1,
      flexDirection: 'row',
      minHeight: 72,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    optionSelected: {
      backgroundColor: colors.primaryFaint,
      borderColor: colors.primary,
    },
    themeSwatch: {
      borderColor: colors.border,
      borderRadius: radius.circle,
      borderWidth: 1,
      height: 28,
      width: 28,
    },
    swatchGroup: {
      flexDirection: 'row',
      marginRight: spacing.md,
      width: 42,
    },
    themeSwatchOverlap: {
      marginLeft: -14,
      marginTop: 12,
    },
    optionText: {
      flex: 1,
    },
    optionLabel: {
      color: colors.textPrimary,
      fontSize: fontSize.body,
      fontWeight: fontWeight.bold,
    },
    optionDescription: {
      color: colors.textSecondary,
      fontSize: fontSize.caption,
      marginTop: spacing.xs,
    },
    checkmark: {
      color: colors.primaryPressed,
      fontSize: fontSize.cardTitle,
      fontWeight: fontWeight.bold,
      marginLeft: spacing.md,
      minWidth: 24,
      textAlign: 'center',
    },
    pressed: {
      opacity: 0.55,
    },
    languageNotice: {
      color: colors.textMuted,
      fontSize: fontSize.caption,
      lineHeight: 18,
      marginTop: spacing.lg,
    },
    onboardingOption: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.lg,
      borderWidth: 1,
      flexDirection: 'row',
      marginTop: spacing.xxl,
      minHeight: 72,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    onboardingArrow: {
      color: colors.primary,
      fontSize: 28,
      fontWeight: fontWeight.bold,
      marginLeft: spacing.md,
    },
    accountCard: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.lg,
      borderWidth: 1,
      marginTop: spacing.lg,
      padding: spacing.lg,
    },
    accountStatus: {
      color: colors.textPrimary,
      fontSize: fontSize.body,
      fontWeight: fontWeight.extraBold,
    },
    accountId: {
      color: colors.textMuted,
      fontSize: 11,
      marginTop: spacing.sm,
    },
    accountNotice: {
      color: colors.textSecondary,
      fontSize: fontSize.bodySmall,
      lineHeight: 21,
      marginTop: spacing.lg,
    },
    appleButton: {
      height: 48,
      marginTop: spacing.lg,
      width: '100%',
    },
    appleUnavailable: {
      color: colors.textMuted,
      fontSize: fontSize.caption,
      lineHeight: 18,
      marginTop: spacing.lg,
    },
    accountProgress: {
      color: colors.primary,
      fontSize: fontSize.caption,
      marginTop: spacing.md,
      textAlign: 'center',
    },
    accountError: {
      backgroundColor: colors.dangerSoft,
      borderRadius: radius.md,
      color: colors.danger,
      fontSize: fontSize.caption,
      lineHeight: 18,
      marginTop: spacing.md,
      padding: spacing.md,
    },
    dangerZone: {
      backgroundColor: colors.dangerSoft,
      borderColor: colors.danger,
      borderRadius: radius.lg,
      borderWidth: 1,
      marginTop: spacing.xxl,
      padding: spacing.lg,
    },
    dangerTitle: {
      color: colors.danger,
      fontSize: fontSize.body,
      fontWeight: fontWeight.extraBold,
    },
    dangerDescription: {
      color: colors.textSecondary,
      fontSize: fontSize.bodySmall,
      lineHeight: 21,
      marginTop: spacing.sm,
    },
    deleteAccountButton: {
      alignItems: 'center',
      borderColor: colors.danger,
      borderRadius: radius.md,
      borderWidth: 1,
      justifyContent: 'center',
      marginTop: spacing.lg,
      minHeight: 46,
      paddingHorizontal: spacing.lg,
    },
    deleteAccountButtonText: {
      color: colors.danger,
      fontSize: fontSize.bodySmall,
      fontWeight: fontWeight.bold,
    },
    disabled: {
      opacity: 0.5,
    },
  });
}
