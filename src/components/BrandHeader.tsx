import { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { AppText as Text } from '@/theme/Typography';

import {
  type AppTheme,
  useTheme,
} from '../theme';
import { useLanguage } from '../preferences/LanguageContext';

type BrandHeaderProps = {
  brandName: string;
  onOpenSettings: () => void;
  compactBottomSpacing?: boolean;
  nickname?: string | null;
};

function SettingsIcon({ color }: { color: string }) {
  return (
    <Svg
      fill="none"
      height={28}
      viewBox="0 0 24 24"
      width={28}
    >
      <Path
        d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
      <Path
        d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </Svg>
  );
}

export default function BrandHeader({
  brandName,
  onOpenSettings,
  compactBottomSpacing = false,
  nickname = null,
}: BrandHeaderProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );

  return (
    <View
      style={[
        styles.header,
        compactBottomSpacing &&
          styles.compactHeader,
      ]}
    >
      <View style={styles.brandRow}>
        <View style={styles.brandIdentity}>
          <Text style={styles.brandName}>{brandName}</Text>
          <Text style={styles.brandLeaf}>🌿</Text>
        </View>

        <Pressable
          accessibilityHint={t('home.settingsHint')}
          accessibilityLabel={t('home.settingsLabel')}
          accessibilityRole="button"
          hitSlop={10}
          onPress={onOpenSettings}
          style={({ pressed }) => [
            styles.settingsButton,
            pressed && styles.settingsButtonPressed,
          ]}
        >
          <SettingsIcon color={theme.colors.textPrimary} />
        </Pressable>
      </View>

      <Text style={styles.title}>
        {nickname
          ? t('home.namedGreeting', { nickname })
          : t('home.greeting')}
      </Text>

      <Text style={styles.subtitle}>
        {t('home.greetingSubtitle')}
      </Text>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const {
    colors,
    fontFamily,
    fontSize,
    fontWeight,
    spacing,
  } = theme;

  return StyleSheet.create({
    header: {
      marginBottom: spacing.xxl,
    },
    compactHeader: {
      marginBottom: spacing.xl,
    },

    brandRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    brandIdentity: {
      alignItems: 'center',
      flexDirection: 'row',
    },

    brandName: {
      color: colors.textPrimary,
      fontFamily: fontFamily.brand,
      fontSize: fontSize.hero,
      fontWeight: fontWeight.black,
    },

    brandLeaf: {
      fontSize: fontSize.cardTitle,
      marginLeft: spacing.sm,
    },

    settingsButton: {
      alignItems: 'center',
      height: 40,
      justifyContent: 'center',
      width: 40,
    },

    settingsButtonPressed: {
      opacity: 0.5,
    },

    title: {
      color: colors.textPrimary,
      fontSize: fontSize.title,
      fontWeight: fontWeight.extraBold,
      marginTop: spacing.lg,
    },

    subtitle: {
      color: colors.textSecondary,
      fontSize: fontSize.bodySmall,
      lineHeight: 21,
      marginTop: spacing.sm,
    },
  });
}
