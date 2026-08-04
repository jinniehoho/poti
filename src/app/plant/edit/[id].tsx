import { router, Stack, useLocalSearchParams } from 'expo-router';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { AppText as Text } from '@/theme/Typography';

import AppBackButton from '../../../components/AppBackButton';
import EditPlantBasicInfoCard from '../../../components/EditPlantBasicInfoCard';
import LastWateredDateField, {
  toLocalNoonIso,
} from '../../../components/LastWateredDateField';
import OrganicBackground from '../../../components/OrganicBackground';
import PlantLocationPicker from '../../../components/PlantLocationPicker';
import type { PlantTypeOption } from '../../../components/PlantTypeCard';
import WateringModeCard, {
  type WateringMode,
} from '../../../components/WateringModeCard';
import { usePlants } from '../../../context/PlantContext';
import {
  getEditablePlantById,
  updatePlant,
} from '../../../services/plantService';
import {
  createPlantLocation,
  deletePlantLocation,
  getPlantLocations,
  type PlantLocation,
} from '../../../services/plantLocationService';
import {
  searchPlantCatalog,
} from '../../../services/plantCatalogService';
import { getPlantTypes } from '../../../services/plantTypeService';
import { useLanguage } from '../../../preferences/LanguageContext';
import { setLastWateredAt } from '../../../services/wateringService';
import {
  useTheme,
  type AppTheme,
} from '../../../theme';
import type { PlantCatalogItem } from '../../../types/plantCatalog';

function getRecommendedWateringDays(
  item: PlantCatalogItem | null,
) {
  if (
    !item ||
    item.effective_watering_min_days === null ||
    item.effective_watering_max_days === null
  ) {
    return null;
  }

  return Math.round(
    (
      item.effective_watering_min_days +
      item.effective_watering_max_days
    ) / 2,
  );
}

export default function EditPlantScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { refreshPlants } = usePlants();
  const { language, t } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );
  const searchRequestId = useRef(0);

  const [plantTypeOptions, setPlantTypeOptions] =
    useState<PlantTypeOption[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<
    PlantCatalogItem[]
  >([]);
  const [selectedCatalogItem, setSelectedCatalogItem] =
    useState<PlantCatalogItem | null>(null);
  const [fallbackImageKey, setFallbackImageKey] =
    useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [catalogError, setCatalogError] =
    useState<string | null>(null);

  const [plantName, setPlantName] = useState('');
  const [locations, setLocations] = useState<
    PlantLocation[]
  >([]);
  const [selectedLocationId, setSelectedLocationId] =
    useState<string | null>(null);
  const [locationLoadError, setLocationLoadError] =
    useState<string | null>(null);

  const [selectedPlantTypeId, setSelectedPlantTypeId] =
    useState<number | null>(null);
  const [originalSpeciesId, setOriginalSpeciesId] =
    useState<string | null>(null);
  const [originalCultivarId, setOriginalCultivarId] =
    useState<string | null>(null);

  const [wateringMode, setWateringMode] =
    useState<WateringMode>('automatic');

  const [customWateringDays, setCustomWateringDays] =
    useState('');
  const [lastWateredAt, setLastWateredAtState] =
    useState<Date | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] =
    useState<string | null>(null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    const plantId = Number(id);

    router.replace(
      Number.isInteger(plantId)
        ? `/plant/${plantId}`
        : '/',
    );
  };

  useEffect(() => {
    async function loadEditData() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const plantId = Number(id);

        if (!Number.isInteger(plantId)) {
          throw new Error('잘못된 식물 ID입니다.');
        }

        const [plantTypes, plant, plantLocations] =
          await Promise.all([
          getPlantTypes(language),
          getEditablePlantById(plantId),
          getPlantLocations(language).catch((error) => {
            console.error(
              'Plant location load failed:',
              error,
            );
            setLocationLoadError(
              t('location.loadError'),
            );
            return [];
          }),
        ]);

        let currentCatalogItem: PlantCatalogItem | null =
          null;

        if (plant.plantSpeciesId) {
          try {
            const matches = await searchPlantCatalog({
              query:
                plant.scientificName ??
                plant.catalogName,
              language,
              limit: 30,
            });

            currentCatalogItem =
              matches.find(
                (item) =>
                  item.species_id ===
                    plant.plantSpeciesId &&
                  item.cultivar_id ===
                    plant.plantCultivarId,
              ) ?? null;
          } catch (error) {
            console.warn(
              'Current catalog item lookup failed:',
              error,
            );
          }
        }

        const currentCatalogOption:
          | PlantTypeOption
          | null =
          plant.plantTypeId === null &&
          currentCatalogItem === null
            ? {
              id: -1,
              name: plant.catalogName,
              scientificName:
                plant.scientificName ??
                plant.catalogName,
              emoji: plant.emoji,
              defaultIntervalDays:
                plant.recommendedIntervalDays,
            }
            : null;

        setPlantTypeOptions(
          currentCatalogOption
            ? [currentCatalogOption, ...plantTypes]
            : plantTypes,
        );
        setPlantName(plant.displayName);
        setLocations(plantLocations);
        setSelectedLocationId(plant.locationId);
        setSelectedPlantTypeId(
          currentCatalogItem
            ? null
            : plant.plantTypeId ?? -1,
        );
        setSelectedCatalogItem(currentCatalogItem);
        setFallbackImageKey(plant.imageKey);
        setSearchQuery('');
        setSearchResults([]);
        setCatalogError(null);
        setOriginalSpeciesId(plant.plantSpeciesId);
        setOriginalCultivarId(plant.plantCultivarId);
        setWateringMode(plant.wateringMode);

        setCustomWateringDays(
          plant.customIntervalDays !== null
            ? String(plant.customIntervalDays)
            : '',
        );
        setLastWateredAtState(
          plant.lastWateredAt
            ? new Date(plant.lastWateredAt)
            : null,
        );
      } catch (error) {
        console.error('수정할 식물 정보 조회 실패:', error);

        setLoadError(
          t('editPlant.loadError'),
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadEditData();
  }, [id, language, t]);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery) {
      searchRequestId.current += 1;
      setSearchResults([]);
      setCatalogError(null);
      setIsSearching(false);
      return;
    }

    const requestId = ++searchRequestId.current;
    setIsSearching(true);
    setCatalogError(null);

    const timer = setTimeout(() => {
      void searchPlantCatalog({
        query: trimmedQuery,
        language,
        limit: 30,
      })
        .then((items) => {
          if (searchRequestId.current === requestId) {
            setSearchResults(items);
          }
        })
        .catch((error) => {
          console.error(
            'Plant catalog search failed:',
            error,
          );

          if (searchRequestId.current === requestId) {
            setSearchResults([]);
            setCatalogError(
              t('addPlant.errors.search'),
            );
          }
        })
        .finally(() => {
          if (searchRequestId.current === requestId) {
            setIsSearching(false);
          }
        });
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [language, searchQuery, t]);

  const selectedPlantType = plantTypeOptions.find(
    (option) => option.id === selectedPlantTypeId,
  );

  const recommendedWateringDays =
    getRecommendedWateringDays(
      selectedCatalogItem,
    ) ??
    selectedPlantType?.defaultIntervalDays ??
    null;

  const trimmedPlantName = plantName.trim();
  const customDaysNumber = Number(customWateringDays);

  const isCustomDaysValid =
    customWateringDays !== '' &&
    Number.isInteger(customDaysNumber) &&
    customDaysNumber >= 1 &&
    customDaysNumber <= 365;

  const isWateringValid =
    wateringMode === 'automatic'
      ? recommendedWateringDays !== null
      : isCustomDaysValid;

  const isFormValid =
    trimmedPlantName.length > 0 &&
    (
      selectedCatalogItem !== null ||
      selectedPlantType !== undefined
    ) &&
    isWateringValid;

  const handleSelectCatalog = (
    item: PlantCatalogItem,
  ) => {
    setSelectedCatalogItem(item);
    setSelectedPlantTypeId(null);
  };

  const handleAddLocation = async (name: string) => {
    const location = await createPlantLocation(name);
    setLocations((current) => [...current, location]);
    setSelectedLocationId(location.id);
  };

  const handleDeleteLocation = async (locationId: string) => {
    await deletePlantLocation(locationId);
    setLocations((current) =>
      current.filter((location) => location.id !== locationId),
    );
    setSelectedLocationId((current) =>
      current === locationId ? null : current,
    );
    await refreshPlants();
  };

  const handleSave = async () => {
    const plantId = Number(id);

    if (
      !Number.isInteger(plantId) ||
      !isFormValid ||
      (
        !selectedCatalogItem &&
        !selectedPlantType
      ) ||
      isSubmitting
    ) {
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await updatePlant(plantId, {
        plantTypeId:
          selectedCatalogItem ||
          selectedPlantType?.id === -1
            ? null
            : selectedPlantType?.id ?? null,
        plantSpeciesId:
          selectedCatalogItem?.species_id ??
          (
            selectedPlantType?.id === -1
              ? originalSpeciesId
              : null
          ),
        plantCultivarId:
          selectedCatalogItem?.cultivar_id ??
          (
            selectedPlantType?.id === -1
              ? originalCultivarId
              : null
          ),
        locationId: selectedLocationId,
        displayName: trimmedPlantName,
        wateringMode,
        customIntervalDays:
          wateringMode === 'custom'
            ? customDaysNumber
            : null,
      });
      await setLastWateredAt(
        plantId,
        lastWateredAt
          ? toLocalNoonIso(lastWateredAt)
          : null,
      );

      await refreshPlants();

      router.dismissTo('/');
    } catch (error) {
      console.error('식물 정보 수정 실패:', error);

      setSubmitError(
        t('editPlant.saveError'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centeredScreen}>
        <OrganicBackground variant="form" />
        <ActivityIndicator
          color={theme.colors.primary}
          size="large"
        />

        <Text style={styles.loadingText}>
          {t('editPlant.loading')}
        </Text>
      </SafeAreaView>
    );
  }

  if (loadError) {
    return (
      <SafeAreaView style={styles.centeredScreen}>
        <OrganicBackground variant="form" />
        <Text style={styles.errorText}>{loadError}</Text>

        <Pressable
          onPress={handleBack}
          style={styles.errorBackButton}
        >
          <Text style={styles.errorBackButtonText}>
            {t('common.back')}
          </Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <OrganicBackground variant="form" />
      <Stack.Screen
        options={{
          title: t('editPlant.title'),
        }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <AppBackButton onPress={handleBack} />

        <Text style={styles.eyebrow}>
          {t('editPlant.eyebrow')}
        </Text>

        <Text style={styles.title}>
          {t('editPlant.title')}
        </Text>

        <Text style={styles.description}>
          {t('editPlant.description')}
        </Text>

        <EditPlantBasicInfoCard
          plantName={plantName}
          selectedCatalogItem={selectedCatalogItem}
          fallbackPlantType={selectedPlantType ?? null}
          fallbackImageKey={fallbackImageKey}
          query={searchQuery}
          results={searchResults}
          isSearching={isSearching}
          searchError={catalogError}
          onChangePlantName={setPlantName}
          onChangeQuery={setSearchQuery}
          onSelectCatalogItem={handleSelectCatalog}
        />

        <PlantLocationPicker
          locations={locations}
          selectedLocationId={selectedLocationId}
          loadError={locationLoadError}
          onSelect={setSelectedLocationId}
          onAdd={handleAddLocation}
          onDelete={handleDeleteLocation}
        />

        <WateringModeCard
          mode={wateringMode}
          recommendedDays={recommendedWateringDays}
          customDays={customWateringDays}
          onChangeMode={setWateringMode}
          onChangeCustomDays={setCustomWateringDays}
        />

        <LastWateredDateField
          value={lastWateredAt}
          onChange={setLastWateredAtState}
        />

        <Pressable
          disabled={!isFormValid || isSubmitting}
          onPress={handleSave}
          style={({ pressed }) => [
            styles.saveButton,
            (!isFormValid || isSubmitting) &&
              styles.saveButtonDisabled,
            pressed &&
              isFormValid &&
              !isSubmitting &&
              styles.saveButtonPressed,
          ]}
        >
          <Text style={styles.saveButtonText}>
            {isSubmitting
              ? t('editPlant.saving')
              : t('editPlant.save')}
          </Text>
        </Pressable>

        {submitError && (
          <Text style={styles.submitError}>
            {submitError}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme) {
  const { colors } = theme;

  return StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  centeredScreen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 22,
  },

  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingBottom: 48,
    paddingHorizontal: 22,
    paddingTop: 24,
  },

  eyebrow: {
    color: colors.plantAccent,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
  },

  title: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: '800',
    marginTop: 8,
  },

  description: {
    color: colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },

  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 12,
  },

  errorText: {
    color: colors.danger,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },

  errorBackButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 13,
  },

  errorBackButtonText: {
    color: colors.textInverse,
    fontSize: 15,
    fontWeight: '700',
  },

  saveButton: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 18,
    marginTop: 24,
    paddingVertical: 16,
  },

  saveButtonDisabled: {
    backgroundColor: colors.primaryMuted,
    opacity: 0.4,
  },

  saveButtonPressed: {
    opacity: 0.75,
  },

  saveButtonText: {
    color: colors.textInverse,
    fontSize: 16,
    fontWeight: '800',
  },

  submitError: {
    backgroundColor: colors.dangerSoft,
    borderRadius: 12,
    color: colors.danger,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
    padding: 14,
    textAlign: 'center',
  },
  });
}
