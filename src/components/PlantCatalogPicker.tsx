import { useMemo } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { AppText as Text, AppTextInput as TextInput } from '@/theme/Typography';

import { getPlantIllustration } from '../../assets/assets';
import {
  fontSize,
  fontWeight,
  radius,
  spacing,
} from '../constants/theme';
import { getPlantEmoji } from '../constants/plantEmojiMap';
import {
  useLanguage,
  type AppLanguage,
} from '../preferences/LanguageContext';
import type { PlantCatalogItem } from '../types/plantCatalog';
import {
  useTheme,
  type AppTheme,
} from '../theme';
import FormSectionHeader from './FormSectionHeader';
import PlantVisual from './PlantVisual';

type PlantCatalogPickerProps = {
  popularPlants: PlantCatalogItem[];
  query: string;
  results: PlantCatalogItem[];
  selectedItem: PlantCatalogItem | null;
  isLoadingCatalog: boolean;
  isSearching: boolean;
  error: string | null;
  validationError: string | null;
  onChangeQuery: (query: string) => void;
  onSelect: (item: PlantCatalogItem) => void;
};

function getAlternateName(
  item: PlantCatalogItem,
  language: AppLanguage,
) {
  if (language === 'ko') {
    return item.display_name_en;
  }

  if (language === 'de') {
    return item.display_name_en;
  }

  return item.display_name_de;
}

function CatalogRow({
  item,
  isSelected,
  onPress,
}: {
  item: PlantCatalogItem;
  isSelected: boolean;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );
  const scientificLabel =
    item.entity_type === 'cultivar' && item.cultivar_name
      ? `${item.species_scientific_name} · ${item.cultivar_name}`
      : item.species_scientific_name;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected: isSelected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.resultRow,
        isSelected && styles.selectedRow,
        pressed && styles.pressedRow,
      ]}
    >
      <Text style={styles.resultEmoji}>
        {getPlantEmoji(item.species_scientific_name)}
      </Text>

      <View style={styles.resultText}>
        <Text numberOfLines={1} style={styles.resultName}>
          {item.displayName}
        </Text>
        <Text numberOfLines={1} style={styles.scientificName}>
          {scientificLabel}
        </Text>
        <Text numberOfLines={1} style={styles.alternateName}>
          {getAlternateName(item, item.requestedLanguage)}
        </Text>
      </View>

      <View
        style={[
          styles.radio,
          isSelected && styles.radioSelected,
        ]}
      >
        {isSelected && <View style={styles.radioDot} />}
      </View>
    </Pressable>
  );
}

export default function PlantCatalogPicker({
  popularPlants,
  query,
  results,
  selectedItem,
  isLoadingCatalog,
  isSearching,
  error,
  validationError,
  onChangeQuery,
  onSelect,
}: PlantCatalogPickerProps) {
  const { language, t } = useLanguage();
  const { theme } = useTheme();
  const { colors } = theme;
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );
  const hasQuery = query.trim().length > 0;

  return (
    <View style={styles.card}>
      <FormSectionHeader
        description={t('addPlant.selectSpeciesDescription')}
        title={t('addPlant.selectSpecies')}
      />

      {isLoadingCatalog ? (
        <View style={styles.messageRow}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.message}>
            {t('addPlant.catalogLoading')}
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionLabel}>
            {t('addPlant.featuredPlants')}
          </Text>
          <View style={styles.popularGrid}>
            {popularPlants.map((item) => {
              const isSelected =
                selectedItem?.catalog_id === item.catalog_id;
              const imageSource = getPlantIllustration(item.image_key);

              return (
                <Pressable
                  key={item.catalog_id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => onSelect(item)}
                  style={({ pressed }) => [
                    styles.popularItem,
                    isSelected && styles.popularItemSelected,
                    pressed && styles.pressedRow,
                  ]}
                >
                  <PlantVisual
                    backgroundColor={colors.transparent}
                    emoji={getPlantEmoji(item.species_scientific_name)}
                    imageSource={imageSource}
                    imageStyle={styles.popularImage}
                    size="small"
                    style={styles.popularVisual}
                  />
                  <View style={styles.popularTextArea}>
                    <Text numberOfLines={2} style={styles.popularName}>
                      {item.displayName}
                    </Text>
                    <Text numberOfLines={2} style={styles.popularScientific}>
                      {item.species_scientific_name}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.sectionLabel}>
            {t('addPlant.search')}
          </Text>
          <TextInput
            accessibilityLabel={t('addPlant.search')}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={onChangeQuery}
            placeholder={t('addPlant.searchPlaceholder')}
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
            style={styles.searchInput}
            value={query}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          {hasQuery && (
            isSearching ? (
              <View style={styles.messageRow}>
                <ActivityIndicator color={colors.primary} />
                <Text style={styles.message}>
                  {t('addPlant.searching')}
                </Text>
              </View>
            ) : results.length === 0 ? (
              <Text style={styles.empty}>
                {t('addPlant.noSearchResults')}
              </Text>
            ) : (
              <View style={styles.resultsList}>
                {results.map((item) => (
                  <CatalogRow
                    key={item.catalog_id}
                    item={item}
                    isSelected={
                      selectedItem?.catalog_id === item.catalog_id
                    }
                    onPress={() => onSelect(item)}
                  />
                ))}
              </View>
            )
          )}

          {selectedItem && (
            <View style={styles.selectedSummary}>
              <Text style={styles.selectedLabel}>
                {t('addPlant.selectedPlant')}
              </Text>
              <CatalogRow
                item={selectedItem}
                isSelected
                onPress={() => onSelect(selectedItem)}
              />
            </View>
          )}
        </>
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
  card: {
    backgroundColor: colors.surfaceWarm,
    borderRadius: radius.card,
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 22,
  },
  sectionLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: fontWeight.extraBold,
    marginTop: 22,
    marginBottom: 10,
  },
  popularGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  popularItem: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '48%',
    height: 112,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    padding: 10,
  },
  popularItemSelected: {
    backgroundColor: colors.surfaceSoft,
    borderColor: colors.primary,
    borderWidth: 2,
  },
  popularVisual: {
    flexShrink: 0,
    width: 60,
    height: 60,
  },
  popularImage: {
    width: '100%',
    height: '100%',
    maxWidth: 58,
    maxHeight: 58,
  },
  popularTextArea: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
    minWidth: 0,
  },
  popularName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: fontWeight.extraBold,
  },
  popularScientific: {
    color: colors.textMuted,
    fontSize: 10,
    fontStyle: 'italic',
    lineHeight: 14,
    marginTop: 4,
  },
  searchInput: {
    minHeight: 48,
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    color: colors.textPrimary,
    fontSize: 15,
    paddingHorizontal: 14,
  },
  resultsList: {
    marginTop: 10,
  },
  resultRow: {
    minHeight: 70,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 8,
    padding: 11,
  },
  selectedRow: {
    backgroundColor: colors.surfaceSoft,
    borderColor: colors.primary,
  },
  pressedRow: { opacity: 0.7 },
  resultEmoji: {
    fontSize: 27,
    width: 40,
    textAlign: 'center',
  },
  resultText: { flex: 1, marginLeft: 10 },
  resultName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: fontWeight.extraBold,
  },
  scientificName: {
    color: colors.textSecondary,
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 3,
  },
  alternateName: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },
  radio: {
    width: 22,
    height: 22,
    alignItems: 'center',
    borderColor: colors.borderStrong,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    marginLeft: 8,
  },
  radioSelected: { borderColor: colors.primary },
  radioDot: {
    width: 10,
    height: 10,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  messageRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  message: {
    color: colors.textSecondary,
    fontSize: fontSize.bodySmall,
    marginLeft: 9,
  },
  empty: {
    color: colors.textSecondary,
    fontSize: fontSize.bodySmall,
    marginTop: 18,
    textAlign: 'center',
  },
  error: {
    color: colors.danger,
    fontSize: fontSize.bodySmall,
    lineHeight: 20,
    marginTop: 10,
  },
  selectedSummary: { marginTop: 18 },
  selectedLabel: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: fontWeight.bold,
    marginBottom: 8,
  },
  validationError: {
    color: colors.danger,
    fontSize: fontSize.bodySmall,
    lineHeight: 20,
    marginTop: spacing.md,
  },
  });
}
