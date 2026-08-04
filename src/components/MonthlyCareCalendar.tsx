import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SymbolView } from 'expo-symbols';
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { AppText as Text } from '@/theme/Typography';

import { useLanguage } from '../preferences/LanguageContext';
import {
  type AppTheme,
  useTheme,
} from '../theme';
import type { CareCalendarData } from '../services/careCalendarService';
import type { Plant } from '../types/plant';
import {
  buildMonthCells,
  getLocalDateKey,
} from '../utils/calendar';
import SproutIcon from './SproutIcon';

type MonthlyCareCalendarProps = {
  year: number;
  month: number;
  data: CareCalendarData;
  isLoading: boolean;
  error: string | null;
  plants: Plant[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onCurrentMonth: () => void;
};

const localeByLanguage = {
  ko: 'ko-KR',
  en: 'en-US',
  de: 'de-DE',
} as const;

const CELL_GAP = 2;
const CELL_HEIGHT = 32;
const PRESS_ANIMATION_DURATION = 120;
const AnimatedPressable =
  Animated.createAnimatedComponent(Pressable);

export default function MonthlyCareCalendar({
  year,
  month,
  data,
  isLoading,
  error,
  plants,
  onPreviousMonth,
  onNextMonth,
  onCurrentMonth,
}: MonthlyCareCalendarProps) {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const [gridWidth, setGridWidth] = useState(0);
  const [selectedDateKey, setSelectedDateKey] =
    useState<string | null>(null);
  const [pressedDateKey, setPressedDateKey] =
    useState<string | null>(null);
  const pressAnimation = useRef(
    new Animated.Value(0),
  ).current;
  const styles = useMemo(
    () => createStyles(theme),
    [theme],
  );
  const pressedCellStyle = useMemo(
    () => ({
      elevation: pressAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
      }),
      shadowColor: theme.colors.textPrimary,
      shadowOffset: {
        height: 1,
        width: 0,
      },
      shadowOpacity: pressAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.06, 0.01],
      }),
      shadowRadius: pressAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [1.5, 0.5],
      }),
      transform: [
        {
          scale: pressAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.975],
          }),
        },
      ],
    }),
    [pressAnimation, theme.colors.textPrimary],
  );
  const cells = useMemo(() => {
    const monthCells = buildMonthCells(
      year,
      month,
    );
    const firstCurrentMonthIndex =
      monthCells.findIndex(Boolean);

    return monthCells.map(
      (date, index) =>
        date ??
        new Date(
          year,
          month,
          index - firstCurrentMonthIndex + 1,
        ),
    );
  }, [
    month,
    year,
  ]);
  const wateringDueDates = useMemo(
    () => new Set(data.wateringDueDates),
    [data.wateringDueDates],
  );
  const wateredDates = useMemo(
    () => new Set(data.wateredDates),
    [data.wateredDates],
  );
  const selectedDuePlants = useMemo(() => {
    if (!selectedDateKey) {
      return [];
    }

    const selectedPlantIds =
      data.wateringDuePlantIdsByDate[
        selectedDateKey
      ] ?? [];
    const plantById = new Map(
      plants.map((plant) => [plant.id, plant]),
    );

    return selectedPlantIds
      .map((plantId) => plantById.get(plantId))
      .filter((plant): plant is Plant => Boolean(plant));
  }, [
    data.wateringDuePlantIdsByDate,
    plants,
    selectedDateKey,
  ]);
  const locale = localeByLanguage[language];
  const monthTitle = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        month: 'long',
        year: 'numeric',
      }).format(new Date(year, month, 1)),
    [locale, month, year],
  );
  const weekdayLabels = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(
      locale,
      {
        weekday: 'short',
      },
    );

    return Array.from({ length: 7 }, (_, index) =>
      formatter.format(new Date(2026, 0, 5 + index)),
    );
  }, [locale]);
  const todayKey = getLocalDateKey(new Date());
  const isCurrentMonth =
    new Date().getFullYear() === year &&
    new Date().getMonth() === month;
  const selectedDate = selectedDateKey
    ? cells.find(
        (date) =>
          getLocalDateKey(date) === selectedDateKey,
      )
    : null;
  const selectedDateLabel = selectedDate
    ? new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'long',
      }).format(selectedDate)
    : '';
  const cellWidth =
    gridWidth > 0
      ? Math.floor(
          (gridWidth - CELL_GAP * 6) / 7,
        )
      : 38;

  const handleGridLayout = (
    event: LayoutChangeEvent,
  ) => {
    const nextWidth = Math.floor(
      event.nativeEvent.layout.width,
    );

    if (nextWidth !== gridWidth) {
      setGridWidth(nextWidth);
    }
  };

  const handleDatePressIn = (dateKey: string) => {
    pressAnimation.stopAnimation();
    pressAnimation.setValue(0);
    setPressedDateKey(dateKey);
    Animated.timing(pressAnimation, {
      duration: PRESS_ANIMATION_DURATION,
      easing: Easing.out(Easing.quad),
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };

  const handleDatePressOut = (dateKey: string) => {
    pressAnimation.stopAnimation();
    Animated.timing(pressAnimation, {
      duration: PRESS_ANIMATION_DURATION,
      easing: Easing.out(Easing.quad),
      toValue: 0,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        setPressedDateKey((current) =>
          current === dateKey ? null : current,
        );
      }
    });
  };

  useEffect(() => {
    setSelectedDateKey(null);
  }, [month, year]);

  return (
    <>
      <View style={styles.card}>
      <View style={styles.monthHeader}>
        <Pressable
          accessibilityLabel={t(
            'home.calendar.previousMonth',
          )}
          accessibilityRole="button"
          hitSlop={8}
          onPress={onPreviousMonth}
          style={({ pressed }) => [
            styles.monthButton,
            pressed && styles.pressed,
          ]}
        >
          <SymbolView
            name={{
              android: 'arrow_back_ios_new',
              ios: 'chevron.left',
              web: 'arrow_back_ios_new',
            }}
            size={16}
            tintColor={theme.colors.textPrimary}
          />
        </Pressable>

        <View style={styles.monthCenter}>
          <Pressable
            accessibilityLabel={
              isCurrentMonth
                ? monthTitle
                : `${monthTitle}, ${t(
                    'home.calendar.returnToday',
                  )}`
            }
            accessibilityRole="button"
            disabled={isCurrentMonth}
            onPress={onCurrentMonth}
            style={styles.monthTitleButton}
          >
            <Text
              adjustsFontSizeToFit
              maxFontSizeMultiplier={1.25}
              numberOfLines={1}
              style={styles.monthTitle}
            >
              {monthTitle}
            </Text>
          </Pressable>
          <View
            accessibilityLabel={
              data.activePlantCount === 1
                ? t(
                    'home.calendar.managedPlantOne',
                  )
                : t(
                    'home.calendar.managedPlants',
                    {
                      count:
                        data.activePlantCount,
                    },
                  )
            }
            accessible
            style={styles.managedPlants}
          >
            <SproutIcon size={20} />
            <Text
              maxFontSizeMultiplier={1.2}
              style={styles.managedPlantCount}
            >
              {data.activePlantCount}
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityLabel={t(
            'home.calendar.nextMonth',
          )}
          accessibilityRole="button"
          hitSlop={8}
          onPress={onNextMonth}
          style={({ pressed }) => [
            styles.monthButton,
            pressed && styles.pressed,
          ]}
        >
          <SymbolView
            name={{
              android: 'arrow_forward_ios',
              ios: 'chevron.right',
              web: 'arrow_forward_ios',
            }}
            size={16}
            tintColor={theme.colors.textPrimary}
          />
        </Pressable>
      </View>

      {isLoading ? (
        <Text style={styles.message}>
          {t('home.calendar.loading')}
        </Text>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <View style={styles.weekdayRow}>
            {weekdayLabels.map((label, index) => (
              <Text
                key={`${label}-${index}`}
                maxFontSizeMultiplier={1.25}
                numberOfLines={1}
                style={[
                  styles.weekday,
                  {
                    width: cellWidth,
                  },
                ]}
              >
                {label}
              </Text>
            ))}
          </View>

          <View
            onLayout={handleGridLayout}
            style={styles.dateGrid}
          >
            {cells.map((date) => {
              const dateKey = getLocalDateKey(date);
              const isOutsideMonth =
                date.getFullYear() !== year ||
                date.getMonth() !== month;
              const isDue =
                !isOutsideMonth &&
                wateringDueDates.has(dateKey);
              const isWatered =
                !isOutsideMonth &&
                wateredDates.has(dateKey);
              const isToday =
                !isOutsideMonth &&
                dateKey === todayKey;
              const accessibilityStates = [
                isWatered
                  ? t('home.calendar.watered')
                  : null,
                !isWatered && isDue
                  ? t('home.calendar.wateringDue')
                  : null,
                isToday
                  ? t('home.calendar.today')
                  : null,
              ].filter(Boolean);

              return (
                <AnimatedPressable
                  accessibilityLabel={`${date.getDate()}, ${accessibilityStates.join(
                    ', ',
                  )}`}
                  accessibilityRole="button"
                  accessibilityState={{
                    selected: selectedDateKey === dateKey,
                  }}
                  disabled={isOutsideMonth}
                  key={dateKey}
                  onPress={() => {
                    setSelectedDateKey(dateKey);
                  }}
                  onPressIn={() => {
                    handleDatePressIn(dateKey);
                  }}
                  onPressOut={() => {
                    handleDatePressOut(dateKey);
                  }}
                  style={[
                    styles.dateCell,
                    {
                      height: CELL_HEIGHT,
                      width: cellWidth,
                    },
                    isDue && styles.dueCell,
                    isWatered &&
                      styles.wateredCell,
                    isToday && styles.todayCell,
                    pressedDateKey === dateKey &&
                      pressedCellStyle,
                  ]}
                >
                  <Text
                    adjustsFontSizeToFit
                    maxFontSizeMultiplier={1.3}
                    numberOfLines={1}
                    style={[
                      styles.dateNumber,
                      isOutsideMonth &&
                        styles.outsideMonthDateNumber,
                      isWatered &&
                        styles.wateredDateNumber,
                    ]}
                  >
                    {date.getDate()}
                  </Text>
                </AnimatedPressable>
              );
            })}
          </View>

          <View style={styles.legend}>
            <LegendItem
              color={theme.colors.waterDue}
              label={t(
                'home.calendar.wateringDue',
              )}
              outlined
              theme={theme}
            />
            <LegendItem
              color={theme.colors.waterDone}
              label={t('home.calendar.watered')}
              theme={theme}
            />
          </View>
        </>
      )}
      </View>

      {selectedDuePlants.length > 0 && (
        <View style={styles.duePlantList}>
          <Text style={styles.duePlantListTitle}>
            {selectedDateLabel} ·{' '}
            {t('home.calendar.wateringDue')}
          </Text>
          {selectedDuePlants.map((plant) => (
            <View
              key={plant.id}
              style={styles.duePlantRow}
            >
              <Text style={styles.duePlantName}>
                {plant.name}
              </Text>
              <Text style={styles.duePlantType}>
                {plant.typeName}
              </Text>
            </View>
          ))}
        </View>
      )}
    </>
  );
}

function LegendItem({
  color,
  label,
  outlined = false,
  theme,
}: {
  color: string;
  label: string;
  outlined?: boolean;
  theme: AppTheme;
}) {
  return (
    <View style={stylesForLegend.item}>
      <View
        style={[
          stylesForLegend.swatch,
          {
            backgroundColor: outlined
              ? theme.colors.transparent
              : color,
            borderColor: outlined
              ? theme.colors.waterDone
              : theme.colors.border,
          },
        ]}
      />
      <Text
        maxFontSizeMultiplier={1.3}
        style={[
          stylesForLegend.label,
          {
            color: theme.colors.textSecondary,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const stylesForLegend = StyleSheet.create({
  item: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  swatch: {
    borderRadius: 5,
    borderWidth: 1,
    height: 10,
    marginRight: 5,
    width: 10,
  },
  label: {
    fontSize: 10,
  },
});

function createStyles(theme: AppTheme) {
  const {
    colors,
    fontSize,
    fontWeight,
    radius,
    shadows,
    spacing,
  } = theme;

  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.xl,
      borderWidth: 1,
      marginTop: spacing.sm,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      ...shadows.card,
    },
    monthHeader: {
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    monthButton: {
      alignItems: 'center',
      height: 30,
      justifyContent: 'center',
      width: 30,
    },
    monthCenter: {
      alignItems: 'center',
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      minWidth: 0,
    },
    monthTitleButton: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 30,
      minWidth: 0,
    },
    monthTitle: {
      color: colors.textPrimary,
      fontSize: fontSize.subtitle,
      fontWeight: fontWeight.extraBold,
      textAlign: 'center',
    },
    managedPlants: {
      alignItems: 'center',
      flexDirection: 'row',
      marginLeft: spacing.sm,
    },
    managedPlantCount: {
      color: colors.textSecondary,
      fontSize: fontSize.caption,
      fontWeight: fontWeight.bold,
      marginLeft: 2,
      textAlign: 'center',
    },
    message: {
      color: colors.textSecondary,
      fontSize: fontSize.bodySmall,
      paddingVertical: spacing.xxl,
      textAlign: 'center',
    },
    error: {
      color: colors.danger,
      fontSize: fontSize.bodySmall,
      lineHeight: 20,
      paddingVertical: spacing.xl,
      textAlign: 'center',
    },
    weekdayRow: {
      flexDirection: 'row',
      gap: CELL_GAP,
      marginBottom: spacing.xs,
    },
    weekday: {
      color: colors.textMuted,
      fontSize: 11,
      fontWeight: fontWeight.bold,
      textAlign: 'center',
    },
    dateGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: CELL_GAP,
      width: '100%',
    },
    dateCell: {
      alignItems: 'center',
      backgroundColor: colors.transparent,
      borderColor: colors.transparent,
      borderRadius: radius.sm,
      borderWidth: 1,
      justifyContent: 'center',
      position: 'relative',
    },
    dueCell: {
      borderColor: colors.waterDone,
      borderWidth: 1.5,
    },
    wateredCell: {
      backgroundColor: colors.waterDone,
      borderColor: colors.waterDone,
    },
    todayCell: {
      borderColor: colors.todayBorder,
      borderWidth: 2,
    },
    dateNumber: {
      color: colors.textPrimary,
      fontSize: fontSize.bodySmall,
      fontWeight: fontWeight.medium,
    },
    outsideMonthDateNumber: {
      color: colors.textMuted,
    },
    wateredDateNumber: {
      color: colors.textPrimary,
    },
    legend: {
      alignItems: 'center',
      flexDirection: 'row',
      gap: spacing.lg,
      justifyContent: 'center',
      marginTop: spacing.sm,
    },
    duePlantList: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
      borderRadius: radius.lg,
      borderWidth: 1,
      marginTop: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      ...shadows.card,
    },
    duePlantListTitle: {
      color: colors.textSecondary,
      fontSize: fontSize.caption,
      fontWeight: fontWeight.bold,
      marginBottom: spacing.sm,
    },
    duePlantRow: {
      alignItems: 'baseline',
      flexDirection: 'row',
      gap: spacing.sm,
      paddingVertical: spacing.xs,
    },
    duePlantName: {
      color: colors.textPrimary,
      fontSize: fontSize.body,
      fontWeight: fontWeight.bold,
    },
    duePlantType: {
      color: colors.textSecondary,
      flex: 1,
      fontSize: fontSize.bodySmall,
    },
    pressed: {
      opacity: 0.5,
    },
  });
}
