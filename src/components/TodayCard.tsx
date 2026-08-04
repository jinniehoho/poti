import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from 'react';
import {
  AccessibilityInfo,
  Animated,
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { AppText as Text } from '@/theme/Typography';

import {
  useTheme,
  type AppTheme,
} from '../theme';
import type { Plant } from '../types/plant';
import { useLanguage } from '../preferences/LanguageContext';
import { getPlantIllustration } from '../../assets/assets';

import PlantVisual from './PlantVisual';
import TodayProgressBar from './TodayProgressBar';

type TodayCardProps = {
  plant?: Plant;
  currentTaskNumber: number;
  totalTaskCount: number;
  onWater: (plant: Plant) => void;
  isWatering: boolean;
  isCompleted: boolean;
  completionKey: number;
  showCompletedEmpty: boolean;
  waterButtonRef?: RefObject<View | null>;
};

function getOverdueDays(statusText: string) {
  const days = Number.parseInt(statusText, 10);

  return Number.isInteger(days) ? days : null;
}

export default function TodayCard({
  plant,
  currentTaskNumber,
  totalTaskCount,
  onWater,
  isWatering,
  isCompleted,
  completionKey,
  showCompletedEmpty,
  waterButtonRef,
}: TodayCardProps) {
  const { theme } = useTheme();
  const { t } = useLanguage();

  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );
  const completionProgress = useRef(
    new Animated.Value(0),
  ).current;
  const plantScale = useRef(
    new Animated.Value(1),
  ).current;
  const dropProgress = useRef(
    new Animated.Value(0),
  ).current;
  const waveProgress = useRef(
    new Animated.Value(0),
  ).current;
  const waveOpacity = useRef(
    new Animated.Value(0),
  ).current;
  const announcedCompletionKey = useRef(0);
  const [reduceMotion, setReduceMotion] =
    useState(false);
  const [cardSize, setCardSize] = useState({
    height: 0,
    width: 0,
  });

  const handleCardLayout = (
    event: LayoutChangeEvent,
  ) => {
    const { height, width } =
      event.nativeEvent.layout;

    if (
      height !== cardSize.height ||
      width !== cardSize.width
    ) {
      setCardSize({ height, width });
    }
  };

  useEffect(() => {
    void AccessibilityInfo.isReduceMotionEnabled().then(
      setReduceMotion,
    );
    const subscription =
      AccessibilityInfo.addEventListener(
        'reduceMotionChanged',
        setReduceMotion,
      );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    completionProgress.stopAnimation();
    plantScale.stopAnimation();
    dropProgress.stopAnimation();
    waveProgress.stopAnimation();
    waveOpacity.stopAnimation();
    dropProgress.setValue(0);
    waveProgress.setValue(0);
    waveOpacity.setValue(0);

    if (!isCompleted) {
      completionProgress.setValue(0);
      plantScale.setValue(1);
      return;
    }

    if (
      announcedCompletionKey.current !==
      completionKey
    ) {
      announcedCompletionKey.current =
        completionKey;
      AccessibilityInfo.announceForAccessibility(
        t('home.careToday.watered'),
      );
    }

    if (reduceMotion) {
      completionProgress.setValue(1);
      plantScale.setValue(1);
      return;
    }

    Animated.parallel([
      Animated.timing(completionProgress, {
        duration: 360,
        toValue: 1,
        useNativeDriver: false,
      }),
      Animated.sequence([
        Animated.timing(dropProgress, {
          duration: 520,
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(dropProgress, {
          duration: 130,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.parallel([
          Animated.timing(waveProgress, {
            duration: 1350,
            toValue: 1,
            useNativeDriver: true,
          }),
          Animated.timing(waveOpacity, {
            duration: 160,
            toValue: 0.6,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(160),
        Animated.timing(waveOpacity, {
          duration: 280,
          toValue: 0,
          useNativeDriver: true,
        }),
      ]),
      Animated.sequence([
        Animated.delay(1250),
        Animated.timing(plantScale, {
          duration: 180,
          toValue: 1.045,
          useNativeDriver: true,
        }),
        Animated.timing(plantScale, {
          duration: 240,
          toValue: 1,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [
    completionKey,
    completionProgress,
    dropProgress,
    isCompleted,
    plantScale,
    reduceMotion,
    t,
    waveOpacity,
    waveProgress,
  ]);

  if (!plant) {
    return (
      <View style={styles.emptyCard}>
        <Text style={styles.emptyEmoji}>🌿</Text>

        <Text style={styles.emptyTitle}>
          {showCompletedEmpty
            ? t('home.careToday.complete')
            : t('home.noPlantsDueTitle')}
        </Text>

        {!showCompletedEmpty && (
          <Text style={styles.emptyText}>
            {t('home.noPlantsDueDescription')}
          </Text>
        )}
      </View>
    );
  }

  const isOverdue = plant.status === 'overdue';

  const featuredLabel = isOverdue
    ? t('home.waitingForWater')
    : t('home.waterToday');

  const overdueDays = getOverdueDays(
    plant.statusText,
  );
  const overdueLabel =
    overdueDays === null
      ? t('home.wateringLate')
      : overdueDays === 1
        ? t('home.wateringOneDayLate')
        : t('home.wateringDaysLate', {
            days: overdueDays,
          });
  const statusLabel = isOverdue
    ? `⚠️ ${overdueLabel}`
    : null;

  const completedTaskCount = Math.min(
    totalTaskCount,
    Math.max(
      0,
      currentTaskNumber - 1 +
        (isCompleted ? 1 : 0),
    ),
  );

  return (
    <Animated.View
      onLayout={handleCardLayout}
      style={[
        styles.featuredCard,
        isOverdue && styles.overdueCard,
        {
          backgroundColor:
            completionProgress.interpolate({
              inputRange: [0, 1],
              outputRange: [
                isOverdue
                  ? theme.colors.dangerSoft
                  : theme.colors.primaryFaint,
                theme.colors.completionSurface,
              ],
            }),
        },
      ]}
    >
      {isCompleted && !reduceMotion && (
        <>
          <Animated.Text
            style={[
              styles.waterDrop,
              {
                opacity: dropProgress.interpolate({
                  inputRange: [0, 0.12, 0.82, 1],
                  outputRange: [0, 1, 0.9, 0],
                }),
                transform: [
                  {
                    translateY: dropProgress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-20, 86],
                    }),
                  },
                  {
                    scale: dropProgress.interpolate({
                      inputRange: [0, 0.2, 1],
                      outputRange: [0.86, 1, 1.08],
                    }),
                  },
                ],
              },
            ]}
          >
            💧
          </Animated.Text>

          {cardSize.height > 0 && cardSize.width > 0 ? (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.waterWave,
                {
                  height: cardSize.height + 24,
                  width: cardSize.width * 1.16,
                  opacity: waveOpacity,
                  transform: [
                    {
                      translateX: waveProgress.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, -12, 8],
                      }),
                    },
                    {
                      translateY: waveProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [
                          cardSize.height + 24,
                          0,
                        ],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Svg
                height="100%"
                preserveAspectRatio="none"
                viewBox={`0 0 ${cardSize.width * 1.16} ${cardSize.height + 24}`}
                width="100%"
              >
                <Path
                  d={`M 0 24 C ${cardSize.width * 0.14} 4, ${cardSize.width * 0.3} 44, ${cardSize.width * 0.48} 23 S ${cardSize.width * 0.82} 5, ${cardSize.width * 1.16} 24 V ${cardSize.height + 24} H 0 Z`}
                  fill={theme.colors.waterDone}
                />
              </Svg>
            </Animated.View>
          ) : null}
        </>
      )}

      <Animated.View
        style={{
          transform: [{ scale: plantScale }],
        }}
      >
        <PlantVisual
          emoji={plant.emoji}
          imageSource={getPlantIllustration(
            plant.imageKey,
          )}
          size="medium"
          backgroundColor={
            isOverdue
              ? theme.colors.surface
              : theme.colors.surfaceElevated
          }
          style={styles.featuredVisual}
        />
      </Animated.View>

      <Text
        style={[
          styles.featuredLabel,
          isOverdue && styles.overdueLabel,
        ]}
      >
        {featuredLabel}
      </Text>

      <Text style={styles.featuredName}>
        {plant.name}
      </Text>

      {plant.locationName ? (
        <View style={styles.locationChip}>
          <Text style={styles.locationChipText}>
            {plant.locationName}
          </Text>
        </View>
      ) : null}

      <Text style={styles.featuredType}>
        {plant.typeName}
      </Text>

      {totalTaskCount > 0 && (
        <TodayProgressBar
          completed={completedTaskCount}
          total={totalTaskCount}
        />
      )}

      {isOverdue && statusLabel ? (
        <View
          style={[
            styles.statusBadge,
            isOverdue && styles.overdueBadge,
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,
              isOverdue &&
                styles.overdueBadgeText,
            ]}
          >
            {statusLabel}
          </Text>
        </View>
      ) : null}

      <Pressable
        ref={waterButtonRef}
        accessibilityRole="button"
        accessibilityLabel={t(
          'home.waterAccessibility',
          { name: plant.name },
        )}
        disabled={isWatering || isCompleted}
        onPress={() => onWater(plant)}
        style={({ pressed }) => [
          styles.waterButton,
          isOverdue && styles.overdueWaterButton,
          isCompleted && styles.completedButton,
          (isWatering || isCompleted) &&
            styles.waterButtonDisabled,
          pressed &&
            !isWatering &&
            !isCompleted &&
            styles.waterButtonPressed,
        ]}
      >
        <Text style={styles.waterButtonText}>
          {isCompleted
            ? t('home.careToday.watered')
            : isWatering
            ? t('home.recordingWatering')
            : t('home.careToday.water')}
        </Text>
      </Pressable>
      {isCompleted && (
        <Text
          accessibilityLiveRegion="polite"
          style={styles.srCompletion}
        >
          {t('home.careToday.watered')}
        </Text>
      )}
    </Animated.View>
  );
}

function createStyles(theme: AppTheme) {
  const {
    colors,
    fontSize,
    fontWeight,
    radius,
    spacing,
  } = theme;

  return StyleSheet.create({
    featuredCard: {
      alignItems: 'center',
      backgroundColor: colors.primaryFaint,
      borderRadius: radius.largeCard,
      marginTop: spacing.lg,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.xxl,
      overflow: 'hidden',
    },

    overdueCard: {
      backgroundColor: colors.dangerSoft,
    },

    featuredVisual: {
      marginBottom: spacing.xl,
    },

    featuredLabel: {
      color: colors.textSecondary,
      fontSize: fontSize.bodySmall,
      fontWeight: fontWeight.bold,
    },

    overdueLabel: {
      color: colors.danger,
    },

    featuredName: {
      color: colors.textPrimary,
      fontSize: 30,
      fontWeight: fontWeight.black,
      marginTop: spacing.xs,
    },

    featuredType: {
      color: colors.textSecondary,
      fontSize: fontSize.bodySmall,
      marginTop: spacing.xs,
    },

    locationChip: {
      backgroundColor: colors.surface,
      borderRadius: radius.pill,
      marginTop: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },

    locationChipText: {
      color: colors.primary,
      fontSize: fontSize.caption,
      fontWeight: fontWeight.bold,
    },

    statusBadge: {
      backgroundColor: colors.surface,
      borderRadius: radius.pill,
      marginTop: spacing.lg,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
    },

    overdueBadge: {
      backgroundColor: colors.dangerSoft,
    },

    statusBadgeText: {
      color: colors.primary,
      fontSize: fontSize.caption,
      fontWeight: fontWeight.extraBold,
    },

    overdueBadgeText: {
      color: colors.danger,
    },

    waterButton: {
      alignItems: 'center',
      backgroundColor: colors.primary,
      borderRadius: radius.lg,
      marginTop: spacing.xl,
      paddingVertical: spacing.lg,
      width: '100%',
    },

    overdueWaterButton: {
      backgroundColor: colors.danger,
    },

    waterButtonDisabled: {
      opacity: 0.72,
    },
    completedButton: {
      backgroundColor: colors.waterDone,
    },

    waterButtonPressed: {
      opacity: 0.82,
      transform: [{ scale: 0.99 }],
    },

    waterButtonText: {
      color: colors.textInverse,
      fontSize: fontSize.body,
      fontWeight: fontWeight.extraBold,
    },

    emptyCard: {
      alignItems: 'center',
      backgroundColor: colors.surfaceElevated,
      borderRadius: radius.largeCard,
      marginTop: spacing.lg,
      padding: spacing.xxl,
    },

    emptyEmoji: {
      fontSize: 46,
    },

    emptyTitle: {
      color: colors.textPrimary,
      fontSize: fontSize.cardTitle,
      fontWeight: fontWeight.extraBold,
      marginTop: spacing.md,
    },

    emptyText: {
      color: colors.textSecondary,
      fontSize: fontSize.bodySmall,
      lineHeight: 21,
      marginTop: spacing.sm,
      textAlign: 'center',
    },
    waterDrop: {
      fontSize: 26,
      left: '50%',
      marginLeft: -13,
      position: 'absolute',
      top: 18,
      zIndex: 3,
    },
    waterWave: {
      bottom: 0,
      left: '-8%',
      position: 'absolute',
      zIndex: 1,
    },
    srCompletion: {
      height: 1,
      opacity: 0,
      position: 'absolute',
      width: 1,
    },
  });
}
