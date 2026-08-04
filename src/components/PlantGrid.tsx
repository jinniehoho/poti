import {
  useMemo,
  type RefObject,
} from 'react';
import { router } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';
import { AppText as Text } from '@/theme/Typography';

import {
  useTheme,
  type AppTheme,
} from '../theme';
import type { Plant } from '../types/plant';
import { useLanguage } from '../preferences/LanguageContext';
import { getPlantIllustration } from '../../assets/assets';

import PlantVisual from './PlantVisual';

type PlantGridProps = {
  plants: Plant[];
  onAddPlant: () => void;
  addPlantRef?: RefObject<View | null>;
};

const BLOB_SHAPES: ViewStyle[] = [
  {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 22,
  },
  {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 22,
    borderBottomLeftRadius: 28,
  },
  {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 24,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 27,
  },
  {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 28,
    borderBottomRightRadius: 29,
    borderBottomLeftRadius: 19,
  },
  {
    borderTopLeftRadius: 27,
    borderTopRightRadius: 19,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 30,
  },
];

export default function PlantGrid({
  plants,
  onAddPlant,
  addPlantRef,
}: PlantGridProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );

  const getPlantStatusLabel = (plant: Plant) => {
    const days = Number.parseInt(
      plant.statusText,
      10,
    );

    if (plant.status === 'due_today') {
      return t('home.waterTodayShort');
    }

    if (plant.status === 'overdue') {
      if (!Number.isInteger(days)) {
        return t('home.wateringLate');
      }

      if (days === 1) {
        return t('home.wateringOneDayLate');
      }

      return t('home.wateringDaysLate', { days });
    }

    if (!Number.isInteger(days)) {
      return plant.statusText;
    }

    if (days === 1) {
      return t('home.waterTomorrow');
    }

    return t('home.wateringDaysRemaining', {
      days,
    });
  };

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {t('home.myPlants')}
        </Text>

        <Text style={styles.plantCount}>
          {plants.length === 1
            ? t('home.plantCountOne')
            : t('home.plantCount', {
                count: plants.length,
              })}
        </Text>
      </View>

      <View style={styles.plantRow}>
        {plants.map((plant) => {
          const isDueToday =
            plant.status === 'due_today';

          const isOverdue =
            plant.status === 'overdue';

          const stableVisualIndex = Math.abs(
            plant.id,
          );
          const blobShape =
            BLOB_SHAPES[
              stableVisualIndex % BLOB_SHAPES.length
            ];
          const blobColors = [
            theme.colors.primaryFaint,
            theme.colors.surfaceWarm,
            theme.colors.surfaceSoft,
            theme.colors.primarySoft,
          ];
          const blobColor =
            blobColors[
              stableVisualIndex % blobColors.length
            ];

          return (
            <Pressable
              key={plant.id}
              accessibilityRole="button"
              accessibilityLabel={t(
                'home.openPlant',
                { name: plant.name },
              )}
              onPress={() =>
                router.push(`/plant/${plant.id}`)
              }
              style={({ pressed }) => [
                styles.plantItem,
                pressed &&
                  styles.plantItemPressed,
              ]}
            >
              <View
                style={[
                  styles.thumbnailBlob,
                  blobShape,
                  { backgroundColor: blobColor },
                ]}
              >
                <PlantVisual
                  emoji={plant.emoji}
                  imageSource={getPlantIllustration(
                    plant.imageKey,
                  )}
                  size="small"
                  backgroundColor={
                    theme.colors.transparent
                  }
                  style={styles.thumbnailVisual}
                  imageStyle={styles.thumbnailImage}
                />
              </View>

              <Text
                numberOfLines={1}
                style={styles.plantName}
              >
                {plant.name}
              </Text>

              {plant.locationName ? (
                <Text
                  numberOfLines={1}
                  style={styles.locationChip}
                >
                  {plant.locationName}
                </Text>
              ) : null}

              <Text
                numberOfLines={1}
                style={styles.plantType}
              >
                {plant.typeName}
              </Text>

              <Text
                numberOfLines={2}
                style={[
                  styles.plantStatus,
                  isDueToday &&
                    styles.dueTodayStatus,
                  isOverdue &&
                    styles.overdueStatus,
                ]}
              >
                {getPlantStatusLabel(plant)}
              </Text>
            </Pressable>
          );
        })}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t(
            'home.addPlantAccessibility',
          )}
          onPress={onAddPlant}
          style={({ pressed }) => [
            styles.plantItem,
            pressed &&
              styles.addItemPressed,
          ]}
        >
          <View
            ref={addPlantRef}
            style={[
              styles.addVisual,
              styles.addCircle,
            ]}
          >
            <Text style={styles.addIcon}>
              ＋
            </Text>
          </View>

          <Text style={styles.plantName}>
            {t('home.addPlant')}
          </Text>

          <Text style={styles.plantStatus}>
            {t('home.newPot')}
          </Text>
        </Pressable>
      </View>
    </>
  );
}

function createStyles(theme: AppTheme) {
  const {
    colors,
    spacing,
    radius,
    fontSize,
    fontWeight,
  } = theme;

  return StyleSheet.create({
    sectionHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: spacing.xxxl,
    },

    sectionTitle: {
      color: colors.textPrimary,
      fontSize: fontSize.sectionTitle,
      fontWeight: fontWeight.extraBold,
    },

    plantCount: {
      color: colors.textSecondary,
      fontSize: fontSize.bodySmall,
      fontWeight: fontWeight.bold,
    },

    plantRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -6,
      marginTop: spacing.lg,
    },

    plantItem: {
      width: '25%',
      alignItems: 'center',
      marginBottom: spacing.xl,
      paddingHorizontal: 6,
    },

    plantItemPressed: {
      opacity: 0.65,
    },

    thumbnailBlob: {
      width: 70,
      height: 70,
      alignItems: 'center',
      justifyContent: 'center',
    },

    thumbnailVisual: {
      width: 74,
      height: 74,
      overflow: 'visible',
    },

    thumbnailImage: {
      width: '100%',
      height: '100%',
      transform: [
        { scale: 1.32 },
      ],
    },

    addVisual: {
      width: 70,
      height: 70,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: radius.circle,
    },

    plantName: {
      width: '100%',
      color: colors.textPrimary,
      fontSize: 13,
      fontWeight: fontWeight.extraBold,
      marginTop: spacing.sm,
      textAlign: 'center',
    },

    plantStatus: {
      width: '100%',
      color: colors.textSecondary,
      fontSize: 11,
      marginTop: spacing.xs,
      textAlign: 'center',
    },

    plantType: {
      width: '100%',
      color: colors.textSecondary,
      fontSize: 10,
      marginTop: spacing.xs,
      textAlign: 'center',
    },

    locationChip: {
      maxWidth: '100%',
      backgroundColor: colors.primaryFaint,
      borderRadius: radius.pill,
      color: colors.primary,
      fontSize: 9,
      fontWeight: fontWeight.bold,
      marginTop: spacing.xs,
      overflow: 'hidden',
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      textAlign: 'center',
    },

    dueTodayStatus: {
      color: colors.statusToday,
      fontWeight: fontWeight.bold,
    },

    overdueStatus: {
      color: colors.statusOverdue,
      fontWeight: fontWeight.bold,
    },

    addCircle: {
      backgroundColor: colors.transparent,
      borderColor: colors.borderStrong,
      borderStyle: 'dashed',
      borderWidth: 1.5,
    },

    addIcon: {
      color: colors.primary,
      fontSize: 30,
      fontWeight: fontWeight.regular,
    },

    addItemPressed: {
      opacity: 0.65,
    },
  });
}
