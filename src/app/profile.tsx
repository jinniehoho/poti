import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuth } from '../auth/AuthContext';
import BottomNavigation, {
  BOTTOM_NAVIGATION_HEIGHT,
} from '../components/BottomNavigation';
import OrganicBackground from '../components/OrganicBackground';
import SwipeTabNavigation from '../components/SwipeTabNavigation';
import { useLanguage } from '../preferences/LanguageContext';
import { useProfile } from '../profile/ProfileContext';
import {
  PROFILE_NICKNAME_MAX_LENGTH,
} from '../services/profileService';
import { useTheme, type AppTheme } from '../theme';
import { AppText as Text } from '../theme/Typography';

export default function ProfileScreen() {
  const { isAnonymous } = useAuth();
  const { t } = useLanguage();
  const {
    nickname,
    isProfileLoading,
    profileError,
    refreshProfile,
    updateNickname,
  } = useProfile();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );
  const [nicknameInput, setNicknameInput] =
    useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [didSave, setDidSave] = useState(false);

  useEffect(() => {
    setNicknameInput(nickname ?? '');
  }, [nickname]);

  const normalizedNickname = nicknameInput.trim();
  const isNicknameEmpty =
    normalizedNickname.length === 0;
  const isNicknameTooLong =
    normalizedNickname.length >
    PROFILE_NICKNAME_MAX_LENGTH;
  const isUnchanged =
    normalizedNickname === (nickname ?? '');
  const isSaveDisabled =
    isSaving ||
    isNicknameEmpty ||
    isNicknameTooLong ||
    isUnchanged;

  const handleNicknameChange = (value: string) => {
    setNicknameInput(value);
    setSaveError(false);
    setDidSave(false);
  };

  const handleSave = async () => {
    if (isSaveDisabled) {
      return;
    }

    setIsSaving(true);
    setSaveError(false);
    setDidSave(false);

    try {
      await updateNickname(normalizedNickname);
      setDidSave(true);
    } catch (error) {
      console.error('Profile save failed:', error);
      setSaveError(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SwipeTabNavigation
      activeTab="profile"
      style={styles.root}
    >
      <OrganicBackground variant="form" />
      <KeyboardAvoidingView
        behavior={
          Platform.OS === 'ios' ? 'padding' : undefined
        }
        style={styles.root}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              paddingBottom:
                BOTTOM_NAVIGATION_HEIGHT +
                Math.max(
                  insets.bottom,
                  theme.spacing.sm,
                ) +
                theme.spacing.xl,
              paddingTop: Math.max(
                theme.spacing.screenTop,
                insets.top + theme.spacing.sm,
              ),
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>
            {t('profile.title')}
          </Text>
          <Text style={styles.description}>
            {t('profile.description')}
          </Text>

          <View style={styles.card}>
            <Text style={styles.label}>
              {t('profile.nicknameLabel')}
            </Text>
            <Text style={styles.help}>
              {t('profile.nicknameHelp', {
                maximum: PROFILE_NICKNAME_MAX_LENGTH,
              })}
            </Text>

            {isProfileLoading ? (
              <ActivityIndicator
                color={theme.colors.primary}
                style={styles.loader}
              />
            ) : profileError ? (
              <View style={styles.errorBlock}>
                <Text style={styles.errorText}>
                  {t('profile.loadError')}
                </Text>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => {
                    void refreshProfile();
                  }}
                  style={({ pressed }) => [
                    styles.retryButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text style={styles.retryText}>
                    {t('auth.retry')}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <>
                <TextInput
                  accessibilityLabel={t(
                    'profile.nicknameLabel',
                  )}
                  autoCapitalize="words"
                  maxLength={
                    PROFILE_NICKNAME_MAX_LENGTH + 1
                  }
                  onChangeText={handleNicknameChange}
                  onSubmitEditing={() => {
                    void handleSave();
                  }}
                  placeholder={t(
                    'profile.nicknamePlaceholder',
                  )}
                  placeholderTextColor={
                    theme.colors.textMuted
                  }
                  returnKeyType="done"
                  style={styles.input}
                  value={nicknameInput}
                />
                <Text style={styles.characterCount}>
                  {t('profile.characterCount', {
                    current: nicknameInput.length,
                    maximum:
                      PROFILE_NICKNAME_MAX_LENGTH,
                  })}
                </Text>

                {isNicknameTooLong ? (
                  <Text style={styles.validationText}>
                    {t('profile.nicknameTooLong', {
                      maximum:
                        PROFILE_NICKNAME_MAX_LENGTH,
                    })}
                  </Text>
                ) : nicknameInput.length > 0 &&
                  isNicknameEmpty ? (
                  <Text style={styles.validationText}>
                    {t('profile.nicknameRequired')}
                  </Text>
                ) : null}

                <Pressable
                  accessibilityRole="button"
                  disabled={isSaveDisabled}
                  onPress={() => {
                    void handleSave();
                  }}
                  style={({ pressed }) => [
                    styles.saveButton,
                    isSaveDisabled &&
                      styles.saveButtonDisabled,
                    pressed &&
                      !isSaveDisabled &&
                      styles.pressed,
                  ]}
                >
                  <Text style={styles.saveButtonText}>
                    {isSaving
                      ? t('profile.saving')
                      : t('profile.save')}
                  </Text>
                </Pressable>

                {didSave ? (
                  <Text style={styles.successText}>
                    {t('profile.saved')}
                  </Text>
                ) : saveError ? (
                  <Text style={styles.validationText}>
                    {t('profile.saveError')}
                  </Text>
                ) : null}
              </>
            )}
          </View>

          <View style={styles.accountCard}>
            <Text style={styles.accountTitle}>
              {isAnonymous
                ? t('profile.guestTitle')
                : t('profile.protectedTitle')}
            </Text>
            <Text style={styles.accountNotice}>
              {isAnonymous
                ? t('profile.guestNotice')
                : t('profile.protectedNotice')}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <BottomNavigation activeTab="profile" />
    </SwipeTabNavigation>
  );
}

function createStyles(theme: AppTheme) {
  const {
    colors,
    fontFamily,
    fontSize,
    fontWeight,
    layout,
    radius,
    shadows,
    spacing,
  } = theme;

  return StyleSheet.create({
    root: {
      backgroundColor: colors.background,
      flex: 1,
    },
    content: {
      alignSelf: 'center',
      maxWidth: layout.contentMaxWidth,
      paddingHorizontal: spacing.screenHorizontal,
      width: '100%',
    },
    title: {
      color: colors.textPrimary,
      fontSize: fontSize.title,
      fontWeight: fontWeight.extraBold,
    },
    description: {
      color: colors.textSecondary,
      fontSize: fontSize.bodySmall,
      lineHeight: 21,
      marginTop: spacing.sm,
    },
    card: {
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.border,
      borderRadius: radius.xl,
      borderWidth: 1,
      marginTop: spacing.xl,
      padding: spacing.xl,
      ...shadows.card,
    },
    label: {
      color: colors.textPrimary,
      fontSize: fontSize.cardTitle,
      fontWeight: fontWeight.extraBold,
    },
    help: {
      color: colors.textSecondary,
      fontSize: fontSize.bodySmall,
      lineHeight: 20,
      marginTop: spacing.sm,
    },
    loader: {
      marginVertical: spacing.xxl,
    },
    input: {
      backgroundColor: colors.surface,
      borderColor: colors.borderStrong,
      borderRadius: radius.lg,
      borderWidth: 1,
      color: colors.textPrimary,
      fontFamily: fontFamily.regular,
      fontSize: fontSize.body,
      marginTop: spacing.lg,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
    },
    characterCount: {
      color: colors.textMuted,
      fontSize: fontSize.caption,
      marginTop: spacing.xs,
      textAlign: 'right',
    },
    saveButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: radius.lg,
      marginTop: spacing.lg,
      paddingVertical: spacing.lg,
    },
    saveButtonDisabled: {
      backgroundColor: colors.primaryMuted,
      opacity: 0.7,
    },
    saveButtonText: {
      color: colors.textInverse,
      fontSize: fontSize.body,
      fontWeight: fontWeight.extraBold,
    },
    successText: {
      color: colors.success,
      fontSize: fontSize.bodySmall,
      marginTop: spacing.md,
      textAlign: 'center',
    },
    validationText: {
      color: colors.danger,
      fontSize: fontSize.bodySmall,
      marginTop: spacing.sm,
    },
    errorBlock: {
      alignItems: 'center',
      marginTop: spacing.xl,
    },
    errorText: {
      color: colors.danger,
      fontSize: fontSize.bodySmall,
      textAlign: 'center',
    },
    retryButton: {
      backgroundColor: colors.primary,
      borderRadius: radius.pill,
      marginTop: spacing.lg,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.md,
    },
    retryText: {
      color: colors.textInverse,
      fontSize: fontSize.bodySmall,
      fontWeight: fontWeight.extraBold,
    },
    accountCard: {
      backgroundColor: colors.surfaceSoft,
      borderRadius: radius.xl,
      marginTop: spacing.lg,
      padding: spacing.xl,
    },
    accountTitle: {
      color: colors.textPrimary,
      fontSize: fontSize.body,
      fontWeight: fontWeight.extraBold,
    },
    accountNotice: {
      color: colors.textSecondary,
      fontSize: fontSize.bodySmall,
      lineHeight: 21,
      marginTop: spacing.sm,
    },
    pressed: {
      opacity: 0.68,
    },
  });
}
