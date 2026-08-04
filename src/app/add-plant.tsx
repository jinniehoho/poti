import { router } from 'expo-router';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { AppText as Text } from '@/theme/Typography';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import BottomNavigation, {
  BOTTOM_NAVIGATION_HEIGHT,
} from '../components/BottomNavigation';
import AppBackButton from '../components/AppBackButton';
import LastWateredDateField, {
  toLocalNoonIso,
} from '../components/LastWateredDateField';
import OrganicBackground from '../components/OrganicBackground';
import PlantCatalogPicker from '../components/PlantCatalogPicker';
import PlantNameCard from '../components/PlantNameCard';
import PlantLocationPicker from '../components/PlantLocationPicker';
import PlantTypeCard, {
  type PlantTypeOption,
} from '../components/PlantTypeCard';
import RegisterPlantButton from '../components/RegisterPlantButton';
import SwipeTabNavigation from '../components/SwipeTabNavigation';
import WateringModeCard, {
  type WateringMode,
} from '../components/WateringModeCard';
import {
  fontSize,
  fontWeight,
  layout,
  spacing,
} from '../constants/theme';
import { getPlantEmoji } from '../constants/plantEmojiMap';
import { usePlants } from '../context/PlantContext';
import { useLanguage } from '../preferences/LanguageContext';
import {
  getFeaturedPlantCatalog,
  searchPlantCatalog,
} from '../services/plantCatalogService';
import { createPlant } from '../services/plantService';
import { setLastWateredAt as saveLastWateredAt } from '../services/wateringService';
import {
  createPlantLocation,
  deletePlantLocation,
  getPlantLocations,
  type PlantLocation,
} from '../services/plantLocationService';
import { getPlantTypes } from '../services/plantTypeService';
import type { PlantCatalogItem } from '../types/plantCatalog';
import {
  useTheme,
  type AppTheme,
} from '../theme';
import {
  createUniquePlantName,
  generateRandomPlantName,
} from '../utils/plantName';
import { validateWateringDays } from '../utils/plantForm';

type FormErrors = {
  species: string | null;
  watering: string | null;
};

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

export default function AddPlantScreen() {
  const { addPlant, plants, refreshPlants } = usePlants();
  const { language, t } = useLanguage();
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );
  const searchRequestId = useRef(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const generatedNameRef = useRef<string | null>(
    null,
  );

  const [plantName, setPlantName] = useState('');
  const [wateringMode, setWateringMode] =
    useState<WateringMode>('automatic');
  const [customWateringDays, setCustomWateringDays] =
    useState('');
  const [lastWateredAt, setLastWateredAt] =
    useState<Date | null>(null);
  const [locations, setLocations] = useState<
    PlantLocation[]
  >([]);
  const [selectedLocationId, setSelectedLocationId] =
    useState<string | null>(null);
  const [isLoadingLocations, setIsLoadingLocations] =
    useState(true);
  const [locationLoadError, setLocationLoadError] =
    useState<string | null>(null);

  const [popularPlants, setPopularPlants] = useState<
    PlantCatalogItem[]
  >([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<
    PlantCatalogItem[]
  >([]);
  const [selectedCatalogItem, setSelectedCatalogItem] =
    useState<PlantCatalogItem | null>(null);
  const [isLoadingCatalog, setIsLoadingCatalog] =
    useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [catalogError, setCatalogError] =
    useState<string | null>(null);
  const [searchError, setSearchError] =
    useState<string | null>(null);

  const [legacyOptions, setLegacyOptions] = useState<
    PlantTypeOption[]
  >([]);
  const [selectedLegacyId, setSelectedLegacyId] =
    useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] =
    useState<string | null>(null);
  const [formErrors, setFormErrors] =
    useState<FormErrors>({
      species: null,
      watering: null,
    });

  useEffect(() => {
    let isMounted = true;

    async function loadPlantChoices() {
      setIsLoadingCatalog(true);
      setCatalogError(null);

      const [catalogResult, legacyResult] =
        await Promise.allSettled([
          getFeaturedPlantCatalog(language),
          getPlantTypes(language),
        ]);

      if (!isMounted) return;

      if (
        catalogResult.status === 'fulfilled' &&
        catalogResult.value.length > 0
      ) {
        setPopularPlants(catalogResult.value);
      } else {
        setPopularPlants([]);
        setCatalogError(t('addPlant.errors.catalogLoad'));
      }

      if (legacyResult.status === 'fulfilled') {
        setLegacyOptions(legacyResult.value);
      }

      setSelectedCatalogItem(null);
      setSelectedLegacyId(null);
      setSearchQuery('');
      setSearchResults([]);
      setIsLoadingCatalog(false);
    }

    void loadPlantChoices();

    return () => {
      isMounted = false;
    };
  }, [language, t]);

  useEffect(() => {
    let isMounted = true;

    void getPlantLocations(language)
      .then((items) => {
        if (isMounted) {
          setLocations(items);
          setLocationLoadError(null);
        }
      })
      .catch((error) => {
        console.error('Plant location load failed:', error);

        if (isMounted) {
          setLocationLoadError(
            t('location.loadError'),
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoadingLocations(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [language, t]);

  useEffect(() => {
    const trimmedQuery = searchQuery.trim();

    if (!trimmedQuery || catalogError) {
      searchRequestId.current += 1;
      setSearchResults([]);
      setSearchError(null);
      setIsSearching(false);
      return;
    }

    const requestId = ++searchRequestId.current;
    setIsSearching(true);
    setSearchError(null);

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
          console.error('Plant catalog search failed:', error);

          if (searchRequestId.current === requestId) {
            setSearchResults([]);
            setSearchError(t('addPlant.errors.search'));
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
  }, [catalogError, language, searchQuery, t]);

  const selectedLegacy = legacyOptions.find(
    (option) => option.id === selectedLegacyId,
  );
  const catalogWateringDays =
    getRecommendedWateringDays(selectedCatalogItem);
  const recommendedWateringDays =
    catalogWateringDays ??
    selectedLegacy?.defaultIntervalDays ??
    null;

  const hasSelectedPlant =
    selectedCatalogItem !== null ||
    selectedLegacy !== undefined;

  const handleSelectCatalog = (
    item: PlantCatalogItem,
  ) => {
    setSelectedCatalogItem(item);
    setSelectedLegacyId(null);
    setFormErrors((current) => ({
      ...current,
      species: null,
    }));
  };

  const handleSelectLegacy = (id: number) => {
    setSelectedLegacyId(id);
    setSelectedCatalogItem(null);
    setFormErrors((current) => ({
      ...current,
      species: null,
    }));
  };

  const handleBack = () => {
    Keyboard.dismiss();

    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  const handlePlantNameChange = (name: string) => {
    generatedNameRef.current = null;
    setPlantName(name);
  };

  const handleWateringModeChange = (
    mode: WateringMode,
  ) => {
    setWateringMode(mode);
    setFormErrors((current) => ({
      ...current,
      watering: null,
    }));
  };

  const handleCustomWateringDaysChange = (
    days: string,
  ) => {
    setCustomWateringDays(days);
    setFormErrors((current) => ({
      ...current,
      watering: null,
    }));
  };

  const handleCustomInputFocus = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({
        animated: true,
      });
    }, 250);
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

  const handleRegisterPlant = async () => {
    if (isSubmitting) {
      return;
    }

    const nextErrors: FormErrors = {
      species: null,
      watering: null,
    };
    const manualDaysResult = validateWateringDays(
      customWateringDays,
    );

    if (!hasSelectedPlant) {
      nextErrors.species = t(
        'addPlant.errors.speciesRequired',
      );
      setFormErrors(nextErrors);
      return;
    }

    if (
      wateringMode === 'automatic' &&
      recommendedWateringDays === null
    ) {
      nextErrors.watering = t(
        'addPlant.errors.automaticUnavailable',
      );
    } else if (
      wateringMode === 'custom' &&
      manualDaysResult.error === 'required'
    ) {
      nextErrors.watering = t(
        'addPlant.errors.wateringDaysRequired',
      );
    } else if (
      wateringMode === 'custom' &&
      manualDaysResult.error === 'invalid'
    ) {
      nextErrors.watering = t(
        'addPlant.errors.invalidWateringDays',
      );
    }

    setFormErrors(nextErrors);

    if (nextErrors.species || nextErrors.watering) {
      return;
    }

    const finalWateringDays =
      wateringMode === 'automatic'
        ? recommendedWateringDays
        : manualDaysResult.value;

    if (finalWateringDays === null) {
      return;
    }

    const normalizedInputName = plantName.trim();
    let resolvedPlantName: string;

    if (normalizedInputName) {
      resolvedPlantName = createUniquePlantName(
        normalizedInputName,
        plants.map((plant) => plant.name),
      );
    } else {
      if (!generatedNameRef.current) {
        generatedNameRef.current =
          createUniquePlantName(
            generateRandomPlantName(language),
            plants.map((plant) => plant.name),
          );
      }

      resolvedPlantName = generatedNameRef.current;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      Keyboard.dismiss();

      const savedPlant = await createPlant({
        plantTypeId: selectedLegacy?.id ?? null,
        plantSpeciesId:
          selectedCatalogItem?.species_id ?? null,
        plantCultivarId:
          selectedCatalogItem?.cultivar_id ?? null,
        locationId: selectedLocationId,
        displayName: resolvedPlantName,
        wateringMode,
        customIntervalDays:
          wateringMode === 'custom'
            ? finalWateringDays
            : null,
      });

      const typeName =
        selectedCatalogItem?.displayName ??
        selectedLegacy?.name ??
        '';
      const scientificName =
        selectedCatalogItem?.species_scientific_name ??
        selectedLegacy?.scientificName ??
        null;

      addPlant({
        id: savedPlant.id,
        name: resolvedPlantName,
        typeName,
        scientificName,
        imageKey:
          selectedCatalogItem?.image_key ?? null,
        locationName:
          locations.find(
            (location) =>
              location.id === selectedLocationId,
          )?.name ?? null,
        temperatureMinC:
          selectedCatalogItem?.effective_temperature_min_c ?? null,
        temperatureMaxC:
          selectedCatalogItem?.effective_temperature_max_c ?? null,
        humidityMin:
          selectedCatalogItem?.effective_humidity_min ?? null,
        humidityMax:
          selectedCatalogItem?.effective_humidity_max ?? null,
        petToxic:
          selectedCatalogItem?.effective_pet_toxic ?? null,
        emoji:
          selectedCatalogItem
            ? getPlantEmoji(scientificName)
            : selectedLegacy?.emoji ?? '🪴',
        status: 'not_due',
        statusText: t(
          'home.wateringDaysRemaining',
          { days: finalWateringDays },
        ),
      });

      if (lastWateredAt) {
        await saveLastWateredAt(
          savedPlant.id,
          toLocalNoonIso(lastWateredAt),
        );
      }

      await refreshPlants();

      handleBack();
    } catch (error) {
      console.error('Plant registration failed:', error);
      setSubmitError(t('addPlant.errors.save'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SwipeTabNavigation
      activeTab="addPlant"
      style={styles.screen}
    >
      <SafeAreaView
        edges={['top']}
        style={styles.screen}
      >
        <OrganicBackground variant="form" />
        <KeyboardAvoidingView
          behavior={
            Platform.OS === 'ios' ? 'padding' : undefined
          }
          style={styles.keyboardView}
        >
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={[
              styles.content,
              {
                paddingBottom:
                  BOTTOM_NAVIGATION_HEIGHT +
                  Math.max(insets.bottom, spacing.sm) +
                  spacing.xl,
              },
            ]}
            keyboardDismissMode={
              Platform.OS === 'ios'
                ? 'interactive'
                : 'on-drag'
            }
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={Keyboard.dismiss}
            showsVerticalScrollIndicator={false}
          >
        <AppBackButton onPress={handleBack} />

        <Text style={styles.eyebrow}>
          {t('addPlant.eyebrow')}
        </Text>
        <Text style={styles.title}>
          {t('addPlant.title')}
        </Text>

        {catalogError ? (
          <>
            <Text style={styles.errorText}>{catalogError}</Text>
            <PlantTypeCard
              options={legacyOptions}
              selectedPlantTypeId={selectedLegacyId}
              onSelectPlantType={handleSelectLegacy}
              validationError={formErrors.species}
            />
          </>
        ) : (
          <PlantCatalogPicker
            popularPlants={popularPlants}
            query={searchQuery}
            results={searchResults}
            selectedItem={selectedCatalogItem}
            isLoadingCatalog={isLoadingCatalog}
            isSearching={isSearching}
            error={searchError}
            validationError={formErrors.species}
            onChangeQuery={setSearchQuery}
            onSelect={handleSelectCatalog}
          />
        )}

        <PlantNameCard
          plantName={plantName}
          onChangePlantName={handlePlantNameChange}
        />

        <PlantLocationPicker
          locations={locations}
          selectedLocationId={selectedLocationId}
          isLoading={isLoadingLocations}
          loadError={locationLoadError}
          onSelect={setSelectedLocationId}
          onAdd={handleAddLocation}
          onDelete={handleDeleteLocation}
        />

        <WateringModeCard
          mode={wateringMode}
          recommendedDays={recommendedWateringDays}
          customDays={customWateringDays}
          onChangeMode={handleWateringModeChange}
          onChangeCustomDays={
            handleCustomWateringDaysChange
          }
          onCustomInputFocus={handleCustomInputFocus}
          validationError={formErrors.watering}
        />

        <LastWateredDateField
          value={lastWateredAt}
          onChange={setLastWateredAt}
        />

        <RegisterPlantButton
          disabled={isSubmitting}
          isSubmitting={isSubmitting}
          onPress={handleRegisterPlant}
        />

        {submitError && (
          <Text style={styles.submitError}>
            {submitError}
          </Text>
        )}
          </ScrollView>
        </KeyboardAvoidingView>
        <BottomNavigation activeTab="addPlant" />
      </SafeAreaView>
    </SwipeTabNavigation>
  );
}

function createStyles(theme: AppTheme) {
  const { colors } = theme;

  return StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
    paddingTop: spacing.lg,
    paddingHorizontal: spacing.screenHorizontal,
  },
  eyebrow: {
    color: colors.textSecondary,
    fontSize: fontSize.caption,
    fontWeight: fontWeight.bold,
    letterSpacing: 1.4,
  },
  title: {
    color: colors.textPrimary,
    fontSize: 30,
    fontWeight: fontWeight.black,
    marginTop: spacing.sm,
  },
  errorText: {
    backgroundColor: colors.dangerSoft,
    color: colors.danger,
    borderRadius: 12,
    padding: spacing.lg,
    marginTop: spacing.lg,
    fontSize: fontSize.bodySmall,
    textAlign: 'center',
  },
  submitError: {
    backgroundColor: colors.dangerSoft,
    color: colors.danger,
    borderRadius: 12,
    padding: spacing.lg,
    marginTop: spacing.md,
    fontSize: fontSize.bodySmall,
    textAlign: 'center',
  },
  });
}
