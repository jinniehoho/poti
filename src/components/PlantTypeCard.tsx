import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { AppText as Text } from '@/theme/Typography';

import { useLanguage } from '../preferences/LanguageContext';
import {
  useTheme,
  type AppTheme,
} from '../theme';
import FormSectionHeader from './FormSectionHeader';

export type PlantTypeOption = {
  id: number;
  name: string;
  scientificName: string;
  emoji: string;
  defaultIntervalDays: number;
};

type PlantTypeCardProps = {
  options: PlantTypeOption[];
  selectedPlantTypeId: number | null;
  onSelectPlantType: (plantTypeId: number) => void;
  validationError?: string | null;
};

export default function PlantTypeCard({
  options,
  selectedPlantTypeId,
  onSelectPlantType,
  validationError = null,
}: PlantTypeCardProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );

  return (
    <View style={styles.formCard}>
      <FormSectionHeader
        description={t('addPlant.selectSpeciesDescription')}
        title={t('addPlant.selectSpecies')}
      />

      <View style={styles.optionList}>
        {options.map((option) => {
          const isSelected = selectedPlantTypeId === option.id;

          return (
            <Pressable
              key={option.id}
              onPress={() => onSelectPlantType(option.id)}
              style={({ pressed }) => [
                styles.optionItem,
                isSelected && styles.optionItemSelected,
                pressed && styles.optionItemPressed,
              ]}
            >
              <View style={styles.optionIcon}>
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
              </View>

              <View style={styles.optionTextArea}>
                <Text style={styles.optionName}>{option.name}</Text>

                <Text style={styles.optionScientificName}>
                  {option.scientificName}
                </Text>
              </View>

              <View
                style={[
                  styles.radioOuter,
                  isSelected && styles.radioOuterSelected,
                ]}
              >
                {isSelected && <View style={styles.radioInner} />}
              </View>
            </Pressable>
          );
        })}
      </View>

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
    padding: 14,
  },

  optionItemSelected: {
    backgroundColor: colors.primaryFaint,
    borderColor: colors.primary,
    borderWidth: 2,
  },

  optionItemPressed: {
    opacity: 0.75,
  },

  optionIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    backgroundColor: colors.background,
    borderRadius: 12,
  },

  optionEmoji: {
    fontSize: 27,
  },

  optionTextArea: {
    flex: 1,
    marginLeft: 13,
  },

  optionName: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },

  optionScientificName: {
    color: colors.textMuted,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },

  radioOuter: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    borderRadius: 11,
    marginLeft: 10,
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

  validationError: {
    color: colors.danger,
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
  },
  });
}
