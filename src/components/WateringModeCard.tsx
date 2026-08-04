import { useMemo } from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { AppText as Text, AppTextInput as TextInput } from '@/theme/Typography';

import { useLanguage } from '../preferences/LanguageContext';
import {
  useTheme,
  type AppTheme,
} from '../theme';
import FormSectionHeader from './FormSectionHeader';

export type WateringMode = 'automatic' | 'custom';

type WateringModeCardProps = {
  mode: WateringMode;
  recommendedDays: number | null;
  customDays: string;
  onChangeMode: (mode: WateringMode) => void;
  onChangeCustomDays: (days: string) => void;
  onCustomInputFocus?: () => void;
  validationError?: string | null;
};

export default function WateringModeCard({
  mode,
  recommendedDays,
  customDays,
  onChangeMode,
  onChangeCustomDays,
  onCustomInputFocus = () => {},
  validationError = null,
}: WateringModeCardProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );
  const isAutomatic = mode === 'automatic';
  const isCustom = mode === 'custom';

  return (
    <View style={styles.formCard}>
      <FormSectionHeader
        description={t('addPlant.wateringDescription')}
        title={t('addPlant.wateringTitle')}
      />

      <View style={styles.optionList}>
        <Pressable
          onPress={() => {
            Keyboard.dismiss();
            onChangeMode('automatic');
          }}
          style={({ pressed }) => [
            styles.optionItem,
            isAutomatic && styles.optionItemSelected,
            pressed && styles.optionItemPressed,
          ]}
        >
          <View style={styles.optionTextArea}>
            <Text style={styles.optionName}>
              {t('addPlant.wateringAutomatic')}
            </Text>

            <Text style={styles.optionDescription}>
              {recommendedDays !== null
                ? recommendedDays === 1
                  ? t(
                      'addPlant.wateringRecommendedOne',
                    )
                  : t('addPlant.wateringRecommended', {
                      days: recommendedDays,
                    })
                : t('addPlant.wateringSelectPlant')}
            </Text>
          </View>

          <View
            style={[
              styles.radioOuter,
              isAutomatic && styles.radioOuterSelected,
            ]}
          >
            {isAutomatic && <View style={styles.radioInner} />}
          </View>
        </Pressable>

        <Pressable
          onPress={() => onChangeMode('custom')}
          style={({ pressed }) => [
            styles.optionItem,
            isCustom && styles.optionItemSelected,
            pressed && styles.optionItemPressed,
          ]}
        >
          <View style={styles.optionTextArea}>
            <Text style={styles.optionName}>
              {t('addPlant.wateringManual')}
            </Text>

            <Text style={styles.optionDescription}>
              {t('addPlant.wateringManualDescription')}
            </Text>
          </View>

          <View
            style={[
              styles.radioOuter,
              isCustom && styles.radioOuterSelected,
            ]}
          >
            {isCustom && <View style={styles.radioInner} />}
          </View>
        </Pressable>
      </View>

      {isCustom && (
        <View style={styles.customInputArea}>
          <Text style={styles.customInputLabel}>
            {t('addPlant.wateringDaysQuestion')}
          </Text>

          <View style={styles.customInputRow}>
            <TextInput
              value={customDays}
              onChangeText={(text) => {
                const numbersOnly = text.replace(/[^0-9]/g, '');
                onChangeCustomDays(numbersOnly);
              }}
              placeholder="7"
              placeholderTextColor={
                theme.colors.textMuted
              }
              keyboardType="number-pad"
              returnKeyType="done"
              onFocus={onCustomInputFocus}
              onSubmitEditing={Keyboard.dismiss}
              maxLength={3}
              style={styles.customInput}
            />

            <Text style={styles.daysText}>
              {t('addPlant.wateringDaysUnit')}
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={Keyboard.dismiss}
              style={({ pressed }) => [
                styles.doneButton,
                pressed && styles.doneButtonPressed,
              ]}
            >
              <Text style={styles.doneButtonText}>
                {t('common.done')}
              </Text>
            </Pressable>
          </View>

        </View>
      )}

      {validationError && (
        <Text style={styles.validationError}>
          {validationError}
        </Text>
      )}
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

  optionList: {
    marginTop: 20,
  },

  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    marginBottom: 10,
    padding: 16,
  },

  optionItemSelected: {
    backgroundColor: colors.primaryFaint,
    borderColor: colors.primary,
    borderWidth: 2,
  },

  optionItemPressed: {
    opacity: 0.75,
  },

  optionTextArea: {
    flex: 1,
    paddingRight: 12,
  },

  optionName: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },

  optionDescription: {
    color: colors.textMuted,
    fontSize: 13,
    lineHeight: 19,
    marginTop: 5,
  },

  radioOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    borderRadius: 11,
  },

  radioOuterSelected: {
    borderColor: colors.primary,
  },

  radioInner: {
    width: 10,
    height: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },

  customInputArea: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    marginTop: 4,
    padding: 16,
  },

  customInputLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },

  customInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  customInput: {
    width: 88,
    backgroundColor: colors.surfaceElevated,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '800',
    paddingHorizontal: 14,
    paddingVertical: 12,
    textAlign: 'center',
  },

  daysText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 10,
  },

  doneButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginLeft: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },

  doneButtonPressed: {
    opacity: 0.7,
  },

  doneButtonText: {
    color: colors.textInverse,
    fontSize: 13,
    fontWeight: '800',
  },

  validationError: {
    color: colors.danger,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },
  });
}
