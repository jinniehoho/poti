import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {
  AppText as Text,
  AppTextInput as TextInput,
} from '@/theme/Typography';

import { getPlantEmoji } from '../constants/plantEmojiMap';
import { useLanguage } from '../preferences/LanguageContext';
import {
  useTheme,
  type AppTheme,
} from '../theme';
import type { PlantCatalogItem } from '../types/plantCatalog';
import type { PlantTypeOption } from './PlantTypeCard';
import PlantVisual from './PlantVisual';
import { getPlantIllustration } from '../../assets/assets';

type EditPlantBasicInfoCardProps = {
  plantName: string;
  selectedCatalogItem: PlantCatalogItem | null;
  fallbackPlantType: PlantTypeOption | null;
  fallbackImageKey?: string | null;
  query: string;
  results: PlantCatalogItem[];
  isSearching: boolean;
  searchError: string | null;
  onChangePlantName: (name: string) => void;
  onChangeQuery: (query: string) => void;
  onSelectCatalogItem: (item: PlantCatalogItem) => void;
};

function isSameCatalogItem(
  first: PlantCatalogItem,
  second: PlantCatalogItem,
) {
  if (first.cultivar_id || second.cultivar_id) {
    return (
      first.cultivar_id !== null &&
      first.cultivar_id === second.cultivar_id
    );
  }

  return first.species_id === second.species_id;
}

export default function EditPlantBasicInfoCard({
  plantName,
  selectedCatalogItem,
  fallbackPlantType,
  fallbackImageKey,
  query,
  results,
  isSearching,
  searchError,
  onChangePlantName,
  onChangeQuery,
  onSelectCatalogItem,
}: EditPlantBasicInfoCardProps) {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );
  const [isChangingType, setIsChangingType] =
    useState(false);

  const plantTypeName =
    selectedCatalogItem?.displayName ??
    fallbackPlantType?.name ??
    '';
  const scientificName =
    selectedCatalogItem?.species_scientific_name ??
    fallbackPlantType?.scientificName ??
    '';
  const emoji = selectedCatalogItem
    ? getPlantEmoji(
        selectedCatalogItem.species_scientific_name,
      )
    : fallbackPlantType?.emoji;
  const visibleResults = selectedCatalogItem
    ? results.filter(
        (item) =>
          !isSameCatalogItem(
            item,
            selectedCatalogItem,
          ),
      )
    : results;

  const handleToggleSearch = () => {
    if (isChangingType) {
      onChangeQuery('');
    }

    setIsChangingType((current) => !current);
  };

  const handleSelect = (item: PlantCatalogItem) => {
    onSelectCatalogItem(item);
    onChangeQuery('');
    setIsChangingType(false);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>
        {t('editPlant.basicInfo')}
      </Text>

      <View style={styles.plantSummary}>
        <PlantVisual
          emoji={emoji}
          imageSource={getPlantIllustration(
            selectedCatalogItem?.image_key ??
              fallbackImageKey,
          )}
          size="small"
          backgroundColor={theme.colors.surfaceElevated}
        />

        <View style={styles.plantText}>
          <Text style={styles.plantName}>
            {plantTypeName}
          </Text>
          <Text style={styles.scientificName}>
            {scientificName}
          </Text>
        </View>
      </View>

      <Text style={styles.inputLabel}>
        {t('editPlant.customName')}
      </Text>
      <TextInput
        value={plantName}
        onChangeText={onChangePlantName}
        placeholder={t('addPlant.nicknamePlaceholder')}
        placeholderTextColor={theme.colors.textMuted}
        style={styles.nameInput}
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

      <Pressable
        accessibilityRole="button"
        onPress={handleToggleSearch}
        style={({ pressed }) => [
          styles.changeButton,
          pressed && styles.pressed,
        ]}
      >
        <Text style={styles.changeButtonText}>
          {isChangingType
            ? t('editPlant.closeTypeChange')
            : t('editPlant.changeType')}
        </Text>
      </Pressable>

      {isChangingType && (
        <View style={styles.searchArea}>
          <TextInput
            accessibilityLabel={t('addPlant.search')}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={onChangeQuery}
            placeholder={t('addPlant.searchPlaceholder')}
            placeholderTextColor={theme.colors.textMuted}
            returnKeyType="search"
            style={styles.searchInput}
            value={query}
          />

          {searchError && (
            <Text style={styles.errorText}>
              {searchError}
            </Text>
          )}

          {isSearching ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={theme.colors.primary} />
              <Text style={styles.loadingText}>
                {t('addPlant.searching')}
              </Text>
            </View>
          ) : query.trim() && visibleResults.length === 0 ? (
            <Text style={styles.emptyText}>
              {t('addPlant.noSearchResults')}
            </Text>
          ) : (
            visibleResults.map((item) => (
              <Pressable
                key={item.catalog_id}
                accessibilityRole="radio"
                accessibilityState={{ selected: false }}
                onPress={() => handleSelect(item)}
                style={({ pressed }) => [
                  styles.resultRow,
                  pressed && styles.pressed,
                ]}
              >
                <Text style={styles.resultEmoji}>
                  {getPlantEmoji(
                    item.species_scientific_name,
                  )}
                </Text>
                <View style={styles.resultText}>
                  <Text style={styles.resultName}>
                    {item.displayName}
                  </Text>
                  <Text style={styles.resultScientific}>
                    {item.species_scientific_name}
                    {item.cultivar_name
                      ? ` · ${item.cultivar_name}`
                      : ''}
                  </Text>
                </View>
              </Pressable>
            ))
          )}
        </View>
      )}
    </View>
  );
}

function createStyles(theme: AppTheme) {
  const { colors } = theme;

  return StyleSheet.create({
    card: {
      backgroundColor: colors.surfaceWarm,
      borderRadius: 20,
      marginTop: 32,
      paddingHorizontal: 22,
      paddingVertical: 24,
    },
    cardTitle: {
      color: colors.textPrimary,
      fontSize: 20,
      fontWeight: '800',
    },
    plantSummary: {
      alignItems: 'center',
      flexDirection: 'row',
      marginTop: 18,
    },
    plantText: {
      flex: 1,
      marginLeft: 16,
    },
    plantName: {
      color: colors.textPrimary,
      fontSize: 18,
      fontWeight: '800',
    },
    scientificName: {
      color: colors.textSecondary,
      fontSize: 13,
      fontStyle: 'italic',
      marginTop: 4,
    },
    inputLabel: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '700',
      marginTop: 24,
    },
    nameInput: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 12,
      borderWidth: 1,
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '600',
      marginTop: 8,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    characterCount: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 7,
      textAlign: 'right',
    },
    changeButton: {
      alignItems: 'center',
      borderColor: colors.primary,
      borderRadius: 12,
      borderWidth: 1,
      marginTop: 18,
      paddingVertical: 12,
    },
    changeButtonText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: '800',
    },
    searchArea: {
      borderTopColor: colors.divider,
      borderTopWidth: 1,
      marginTop: 18,
      paddingTop: 18,
    },
    searchInput: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 12,
      borderWidth: 1,
      color: colors.textPrimary,
      fontSize: 15,
      minHeight: 48,
      paddingHorizontal: 14,
    },
    loadingRow: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 18,
    },
    loadingText: {
      color: colors.textSecondary,
      fontSize: 13,
      marginLeft: 8,
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: 13,
      marginTop: 18,
      textAlign: 'center',
    },
    errorText: {
      color: colors.danger,
      fontSize: 13,
      marginTop: 10,
    },
    resultRow: {
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: 12,
      borderWidth: 1,
      flexDirection: 'row',
      marginTop: 10,
      minHeight: 64,
      padding: 10,
    },
    resultEmoji: {
      fontSize: 25,
      textAlign: 'center',
      width: 38,
    },
    resultText: {
      flex: 1,
      marginLeft: 10,
    },
    resultName: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '800',
    },
    resultScientific: {
      color: colors.textSecondary,
      fontSize: 11,
      fontStyle: 'italic',
      marginTop: 3,
    },
    pressed: {
      opacity: 0.72,
    },
  });
}
