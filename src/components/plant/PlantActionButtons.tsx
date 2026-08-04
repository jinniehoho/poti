import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text } from '@/theme/Typography';
import { useLanguage } from '../../preferences/LanguageContext';
import {
  useTheme,
  type AppTheme,
} from '../../theme';

type PlantActionButtonsProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function PlantActionButtons({
  onEdit,
  onDelete,
}: PlantActionButtonsProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );

  return (
    <View style={styles.container}>
      <Pressable
        accessibilityRole="button"
        onPress={onEdit}
        style={({ pressed }) => [
          styles.editButton,
          pressed && styles.pressedButton,
        ]}
      >
        <Text style={styles.editButtonText}>
          {t('plantDetail.edit')}
        </Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={onDelete}
        style={({ pressed }) => [
          styles.deleteButton,
          pressed && styles.pressedButton,
        ]}
      >
        <Text style={styles.deleteButtonText}>
          {t('plantDetail.delete')}
        </Text>
      </Pressable>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const { colors } = theme;

  return StyleSheet.create({
  container: {
    width: '100%',
  },

  editButton: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
    marginTop: 26,
    paddingVertical: 16,
  },

  editButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '700',
  },

  deleteButton: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    marginTop: 14,
    paddingVertical: 16,
  },

  deleteButtonText: {
    color: colors.textSecondary,
    fontSize: 16,
    fontWeight: '700',
  },

  pressedButton: {
    opacity: 0.7,
  },
  });
}
