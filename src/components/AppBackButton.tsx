import { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
} from 'react-native';

import { useLanguage } from '../preferences/LanguageContext';
import {
  useTheme,
  type AppTheme,
} from '../theme';
import { AppText as Text } from '../theme/Typography';

type AppBackButtonProps = {
  onPress: () => void;
};

export default function AppBackButton({
  onPress,
}: AppBackButtonProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );
  const label = t('common.back');

  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      hitSlop={4}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <Text style={styles.icon}>‹</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  const {
    colors,
    fontWeight,
    spacing,
  } = theme;

  return StyleSheet.create({
    button: {
      minWidth: 44,
      minHeight: 44,
      alignItems: 'center',
      alignSelf: 'flex-start',
      flexDirection: 'row',
      marginBottom: spacing.lg,
      paddingRight: spacing.md,
    },
    icon: {
      color: colors.primary,
      fontSize: 34,
      lineHeight: 38,
    },
    label: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: fontWeight.bold,
      marginLeft: 2,
    },
    pressed: {
      opacity: 0.72,
    },
  });
}
