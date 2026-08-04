import { useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { AppText as Text } from '@/theme/Typography';

import {
  useTheme,
  type AppTheme,
} from '../theme';
import { useLanguage } from '../preferences/LanguageContext';

type FeedbackBarProps = {
  message: string;
  showUndo: boolean;
  onUndo: () => void;
};

export default function FeedbackBar({
  message,
  showUndo,
  onUndo,
}: FeedbackBarProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        {message}
      </Text>

      {showUndo && (
        <Pressable
          onPress={onUndo}
          style={styles.undoButton}
        >
          <Text style={styles.undoText}>
            {t('home.undo')}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const {
    colors,
    fontSize,
    fontWeight,
    radius,
    shadows,
    spacing,
  } = theme;

  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',

      backgroundColor: colors.surfaceElevated,

      borderRadius: radius.card,

      marginTop: spacing.lg,

      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,

      ...shadows.card,
    },

    message: {
      flex: 1,

      color: colors.textPrimary,

      fontSize: fontSize.bodySmall,

      lineHeight: 20,
    },

    undoButton: {
      marginLeft: spacing.md,
    },

    undoText: {
      color: colors.primary,

      fontSize: fontSize.body,

      fontWeight: fontWeight.extraBold,
    },
  });
}
