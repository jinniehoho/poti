import { useMemo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { AppText as Text } from '@/theme/Typography';

import { useLanguage } from '../preferences/LanguageContext';
import {
  useTheme,
  type AppTheme,
} from '../theme';

type RegisterPlantButtonProps = {
  disabled: boolean;
  isSubmitting: boolean;
  onPress: () => void;
};

export default function RegisterPlantButton({
  disabled,
  isSubmitting,
  onPress,
}: RegisterPlantButtonProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('addPlant.save')}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          disabled && styles.buttonTextDisabled,
        ]}
      >
        {isSubmitting
          ? t('addPlant.saving')
          : t('addPlant.save')}
      </Text>
    </Pressable>
  );
}

function createStyles(theme: AppTheme) {
  const { colors } = theme;

  return StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 14,
    marginTop: 24,
    paddingVertical: 17,
  },

  buttonDisabled: {
    backgroundColor: colors.primaryMuted,
  },

  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },

  buttonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '800',
  },

  buttonTextDisabled: {
    color: colors.textMuted,
  },
  });
}
