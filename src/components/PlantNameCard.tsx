import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { AppText as Text, AppTextInput as TextInput } from '@/theme/Typography';

import { useLanguage } from '../preferences/LanguageContext';
import {
  useTheme,
  type AppTheme,
} from '../theme';
import FormSectionHeader from './FormSectionHeader';

type PlantNameCardProps = {
  plantName: string;
  onChangePlantName: (name: string) => void;
};

export default function PlantNameCard({
  plantName,
  onChangePlantName,
}: PlantNameCardProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );

  return (
    <View style={styles.formCard}>
      <FormSectionHeader
        description={t('addPlant.nicknameDescription')}
        title={t('addPlant.nicknameLabel')}
      />

      <TextInput
        value={plantName}
        onChangeText={onChangePlantName}
        placeholder={t('addPlant.nicknamePlaceholder')}
        placeholderTextColor={theme.colors.textMuted}
        style={styles.input}
        maxLength={30}
        autoCorrect={false}
        returnKeyType="done"
      />

      <Text style={styles.characterCount}>
        {t('addPlant.characterCount', {
          current: plantName.length,
          maximum: 30,
        })}
      </Text>

      <Text style={styles.autoHint}>
        {t('addPlant.nicknameAutoHint')}
      </Text>
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const { colors } = theme;

  return StyleSheet.create({
  formCard: {
    backgroundColor: colors.surfaceWarm,
    borderRadius: 20,
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 22,
  },

  input: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 22,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },

  characterCount: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: 7,
    textAlign: 'right',
  },

  autoHint: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  });
}
