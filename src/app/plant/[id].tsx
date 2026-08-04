import {
  router,
  Stack,
  useLocalSearchParams,
} from 'expo-router';
import {
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { AppText as Text } from '@/theme/Typography';

import AppBackButton from '../../components/AppBackButton';
import OrganicBackground from '../../components/OrganicBackground';
import PlantActionButtons from '../../components/plant/PlantActionButtons';
import PlantDetailHeader from '../../components/plant/PlantDetailHeader';
import PlantInfoCard from '../../components/plant/PlantInfoCard';
import { usePlants } from '../../context/PlantContext';
import {
  deletePlant,
  getPlantById,
} from '../../services/plantService';
import { getWateringHistory } from '../../services/wateringService';
import { useLanguage } from '../../preferences/LanguageContext';
import {
  useTheme,
  type AppTheme,
} from '../../theme';

type PlantDetail = {
  plant_id: number;
  display_name: string;
  plant_type_name: string;
  species_scientific_name: string | null;
  image_key: string | null;
  emoji: string;
  interval_days: number;
  last_watered_at: string | null;
  next_watering_at: string;
  watering_status: 'overdue' | 'due_today' | 'not_due';
  days_until_watering: number;
  temperature_min_c: number | null;
  temperature_max_c: number | null;
  humidity_min: number | null;
  humidity_max: number | null;
  pet_toxic: boolean | null;
};

type WateringHistory = {
  id: number;
  watered_at: string;
};

export default function PlantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { refreshPlants } = usePlants();
  const { language, t } = useLanguage();
  const { theme } = useTheme();
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );

  const [plant, setPlant] = useState<PlantDetail | null>(null);
  const [history, setHistory] = useState<
  WateringHistory[]
    >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] =
    useState<string | null>(null);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  useEffect(() => {
    async function loadPlant() {
      try {
        setIsLoading(true);
        setLoadError(null);

        const plantId = Number(id);

        if (!Number.isInteger(plantId)) {
          throw new Error('잘못된 식물 ID입니다.');
        }

        const result = await getPlantById(
          plantId,
          language,
        );

        const wateringHistory =
            await getWateringHistory(plantId);

        setPlant(result as PlantDetail);
        setHistory(wateringHistory);

      } catch (error) {
        console.error('식물 상세 조회 실패:', error);
        setLoadError(t('plantDetail.loadError'));
      } finally {
        setIsLoading(false);
      }
    }

    void loadPlant();
  }, [id, language, t]);

  const formatDate = (date: string | null) => {
    if (!date) {
      return t('plantDetail.neverWatered');
    }

    const locale =
      language === 'ko'
        ? 'ko-KR'
        : language === 'de'
          ? 'de-DE'
          : 'en-US';

    return new Date(date).toLocaleDateString(locale);
  };

  const formatHistoryDate = (
  date: string,
) => {
  const historyDate = new Date(date);
  const today = new Date();

  const isToday =
    historyDate.toDateString() ===
    today.toDateString();

  if (isToday) {
    return t('plantDetail.today');
  }

  const locale =
    language === 'ko'
      ? 'ko-KR'
      : language === 'de'
        ? 'de-DE'
        : 'en-US';

  return historyDate.toLocaleDateString(
    locale,
    {
      month: 'long',
      day: 'numeric',
    },
  );
};

  if (isLoading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <OrganicBackground variant="detail" />
        <ActivityIndicator
          color={theme.colors.primary}
          size="large"
        />

        <Text style={styles.loadingText}>
          {t('plantDetail.loading')}
        </Text>
      </SafeAreaView>
    );
  }

  if (loadError || !plant) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <OrganicBackground variant="detail" />
        <Text style={styles.errorText}>
          {loadError ?? t('plantDetail.notFound')}
        </Text>
        <Pressable
          accessibilityLabel={t('common.back')}
          accessibilityRole="button"
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

  const statusLabel =
    plant.watering_status === 'due_today'
      ? t('plantDetail.dueToday')
      : plant.watering_status === 'overdue'
        ? Math.abs(plant.days_until_watering) === 1
          ? t('plantDetail.overdueOneDay')
          : t('plantDetail.overdueDays', {
              days: Math.abs(plant.days_until_watering),
            })
        : plant.days_until_watering === 1
          ? t('plantDetail.dueInOneDay')
          : t('plantDetail.dueInDays', {
              days: plant.days_until_watering,
            });

  const handleEdit = () => {
    router.push(`/plant/edit/${plant.plant_id}`);
  };

  const handleDeleteRequest = () => {
    setDeleteError(null);
    setShowDeleteConfirm(true);
  };

  const handleDeleteCancel = () => {
    if (isDeleting) {
      return;
    }

    setShowDeleteConfirm(false);
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError(null);

      await deletePlant(plant.plant_id);
      await refreshPlants();

      setShowDeleteConfirm(false);
      router.replace('/');
    } catch (error) {
      console.error('식물 삭제 실패:', error);

      setDeleteError(
        t('plantDetail.deleteError'),
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <OrganicBackground variant="detail" />
      <Stack.Screen
        options={{
          title: t('plantDetail.title'),
        }}
      />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AppBackButton onPress={handleBack} />

        <PlantDetailHeader
          emoji={plant.emoji}
          name={plant.display_name}
          typeName={plant.plant_type_name}
          scientificName={plant.species_scientific_name}
          imageKey={plant.image_key}
        />

        <View style={styles.infoCardOverlap}>
          <PlantInfoCard
            intervalDays={plant.interval_days}
            statusLabel={statusLabel}
            lastWateredLabel={formatDate(plant.last_watered_at)}
            nextWateringLabel={formatDate(plant.next_watering_at)}
            temperatureMinC={plant.temperature_min_c}
            temperatureMaxC={plant.temperature_max_c}
            humidityMin={plant.humidity_min}
            humidityMax={plant.humidity_max}
            petToxic={plant.pet_toxic}
          />
        </View>
        
        <View style={styles.historyCard}>
  <Text style={styles.historyTitle}>
    {t('plantDetail.historyTitle')}
  </Text>

  {history.length === 0 ? (
    <Text style={styles.historyEmpty}>
      {t('plantDetail.historyEmpty')}
    </Text>
  ) : (
    history.slice(0, 5).map((item) => (
      <View
        key={item.id}
        style={styles.historyRow}
      >
        <Text style={styles.historyEmoji}>
          💧
        </Text>

        <Text style={styles.historyDate}>
          {formatHistoryDate(item.watered_at)}
        </Text>
      </View>
    ))
  )}
</View>

        <PlantActionButtons
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      </ScrollView>

      <Modal
        animationType="fade"
        transparent
        visible={showDeleteConfirm}
        onRequestClose={handleDeleteCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalEmoji}>🪴</Text>

            <Text style={styles.modalTitle}>
              {t('plantDetail.deleteConfirmTitle', {
                name: plant.display_name,
              })}
            </Text>

            <Text style={styles.modalDescription}>
              {t('plantDetail.deleteConfirmDescription')}
            </Text>

            {deleteError && (
              <Text style={styles.deleteError}>
                {deleteError}
              </Text>
            )}

            <Pressable
              disabled={isDeleting}
              onPress={handleDeleteConfirm}
              style={({ pressed }) => [
                styles.confirmDeleteButton,
                isDeleting && styles.disabledButton,
                pressed &&
                  !isDeleting &&
                  styles.pressedButton,
              ]}
            >
              <Text style={styles.confirmDeleteButtonText}>
                {isDeleting
                  ? t('plantDetail.deleting')
                  : t('plantDetail.deleteAction')}
              </Text>
            </Pressable>

            <Pressable
              disabled={isDeleting}
              onPress={handleDeleteCancel}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed &&
                  !isDeleting &&
                  styles.pressedButton,
              ]}
            >
              <Text style={styles.cancelButtonText}>
                {t('plantDetail.cancel')}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(theme: AppTheme) {
  const {
    colors,
    fontSize,
    fontWeight,
    layout,
    radius,
    spacing,
  } = theme;

  return StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    width: '100%',
    maxWidth: layout.contentMaxWidth,
    alignSelf: 'center',
    paddingBottom: spacing.xxxl,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.xxl,
  },

  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.screenHorizontal,
  },

  loadingText: {
    color: colors.textSecondary,
    fontSize: fontSize.bodySmall,
    marginTop: spacing.md,
  },

  errorText: {
    color: colors.danger,
    fontSize: 15,
    textAlign: 'center',
  },

  errorBackButton: {
    minHeight: 44,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.lg,
    justifyContent: 'center',
    marginTop: spacing.xl,
    paddingHorizontal: spacing.xl,
  },

  errorBackButtonText: {
    color: colors.textInverse,
    fontSize: 15,
    fontWeight: fontWeight.bold,
  },

  infoCardOverlap: {
    marginTop: -44,
    position: 'relative',
    zIndex: 2,
  },

  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.overlay,
    paddingHorizontal: spacing.screenHorizontal,
  },

  modalCard: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    paddingHorizontal: spacing.xl,
    paddingVertical: 28,
  },

  modalEmoji: {
    fontSize: 44,
  },

  modalTitle: {
    color: colors.textPrimary,
    fontSize: 21,
    fontWeight: fontWeight.extraBold,
    marginTop: 14,
    textAlign: 'center',
  },

  modalDescription: {
    color: colors.textSecondary,
    fontSize: fontSize.bodySmall,
    lineHeight: 21,
    marginTop: 10,
    textAlign: 'center',
  },

  deleteError: {
    width: '100%',
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.md,
    color: colors.danger,
    fontSize: fontSize.bodySmall,
    lineHeight: 20,
    marginTop: 18,
    padding: 13,
    textAlign: 'center',
  },

  confirmDeleteButton: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.danger,
    borderRadius: radius.lg,
    marginTop: spacing.xl,
    paddingVertical: 15,
  },

  confirmDeleteButtonText: {
    color: colors.textInverse,
    fontSize: 15,
    fontWeight: fontWeight.extraBold,
  },

  cancelButton: {
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    marginTop: spacing.md,
    paddingVertical: 15,
  },

  cancelButtonText: {
    color: colors.textSecondary,
    fontSize: 15,
    fontWeight: fontWeight.bold,
  },

  disabledButton: {
    opacity: 0.5,
  },

  pressedButton: {
    opacity: 0.72,
  },

  historyCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.xl,
    marginTop: 20,
    padding: spacing.screenHorizontal,
  },

  historyTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: fontWeight.extraBold,
  },

  historyEmpty: {
    color: colors.textMuted,
    fontSize: fontSize.bodySmall,
    marginTop: spacing.lg,
  },

  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.lg,
  },

  historyEmoji: {
    fontSize: 18,
  },

  historyDate: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: fontWeight.bold,
    marginLeft: 10,
  },
  });
}
